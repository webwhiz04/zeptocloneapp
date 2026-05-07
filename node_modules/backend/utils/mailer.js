import nodemailer from "nodemailer";
import config from "../config/config.js";

const isProduction = config.NODE_ENV === "production";

export const getSanitizedEmailFrom = () => config.EMAIL_FROM?.trim() || config.EMAIL_USER?.trim();

export const getMailConfigError = () => {
  const user = config.EMAIL_USER?.trim();
  const pass = config.EMAIL_PASS?.trim();

  if (!user || !pass) {
    return "EMAIL_USER and EMAIL_PASS environment variables are missing";
  }

  return null;
};

export const getMailSendErrorMessage = (error) => {
  const message = error?.message?.toLowerCase() || "";

  if (
    error?.code === "EAUTH" ||
    message.includes("authentication") ||
    message.includes("invalid login")
  ) {
    return "SMTP authentication failed. Check EMAIL_USER and EMAIL_PASS.";
  }

  if (message.includes("invalid to") || message.includes("invalid from") || message.includes("missing to")) {
    return "Invalid email payload. Check EMAIL_FROM, recipient address, and message fields.";
  }

  if (!isProduction && error?.message) {
    return `Server error while sending email: ${error.message}`;
  }

  return "Server error while sending email";
};

const createTransporter = () => {
  const user = config.EMAIL_USER?.trim();
  const pass = config.EMAIL_PASS?.trim();

  if (!user || !pass) return null;

  // Use explicit configuration for Gmail on Port 465 (SSL)
  // This is more stable in cloud environments like Render than Port 587.
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: { user, pass },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,   // 10 seconds
    socketTimeout: 10000,     // 10 seconds
  });

  return transporter;
};

const formatFromAddress = () => {
  const from = getSanitizedEmailFrom();

  if (!from) {
    return "Zepto <no-reply@yourdomain.com>";
  }

  if (from.includes("<") && from.includes(">")) {
    return from;
  }

  return `Zepto <${from}>`;
};

const normalizeAttachments = (attachments = []) =>
  attachments
    .filter(Boolean)
    .map((attachment) => {
      const content = attachment.content;
      const bufferContent = Buffer.isBuffer(content)
        ? content
        : typeof content === "string"
        ? Buffer.from(content)
        : Buffer.from(content || "");

      return {
        filename: attachment.filename,
        content: bufferContent,
        contentType: attachment.contentType,
      };
    });

export const sendMail = async ({ to, subject, text, html, replyTo, attachments = [] }) => {
  const mailConfigError = getMailConfigError();

  if (mailConfigError) {
    if (!isProduction) {
      console.warn("Email disabled in development:", mailConfigError);
      return { success: true, devMode: true };
    }

    return { success: false, message: mailConfigError };
  }

  const transporter = createTransporter();

  if (!transporter) {
    return { success: false, message: "Email transporter configuration is invalid" };
  }

  // Verify transporter early so auth/connection errors appear in logs.
  try {
    if (typeof transporter.verify === "function") {
      await transporter.verify();
    }
  } catch (verifyErr) {
    console.error("SMTP verify failed:", {
      message: verifyErr?.message,
      code: verifyErr?.code,
      response: verifyErr?.response,
      stack: verifyErr?.stack,
    });

    if (!isProduction) {
      console.warn("Email transporter verify failed in development:", verifyErr.message);
      return { success: true, devMode: true };
    }

    return { success: false, message: getMailSendErrorMessage(verifyErr) };
  }

  try {
    const info = await transporter.sendMail({
      from: formatFromAddress(),
      to,
      subject,
      text,
      html,
      replyTo,
      attachments: attachments.length ? normalizeAttachments(attachments) : undefined,
    });

    return { success: true, data: info };
  } catch (error) {
    // Log full error details to server logs for debugging.
    console.error("Email send error:", {
      message: error?.message,
      code: error?.code,
      response: error?.response,
      stack: error?.stack,
    });

    if (!isProduction) {
      console.warn("Email send failed in development:", error.message);
      return { success: true, devMode: true };
    }

    return { success: false, message: getMailSendErrorMessage(error) };
  }
};

export const sendOtpEmail = async (email, otp) => {
  const result = await sendMail({
    to: email,
    subject: "Your OTP Code - Login Verification",
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    replyTo: getSanitizedEmailFrom(),
  });

  if (result.success) {
    return result;
  }

  if (!isProduction) {
    console.warn("OTP mail failed in development:", result.message);
    console.log(`DEV OTP for ${email}: ${otp}`);
    return { success: true, devMode: true };
  }

  return result;
};
