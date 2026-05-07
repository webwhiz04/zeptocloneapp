import { Resend } from "resend";

import config from "../config/config.js";

const isProduction = config.NODE_ENV === "production";

export const getSanitizedEmailFrom = () => config.EMAIL_FROM?.trim() || config.EMAIL_USER?.trim();
export const getSanitizedResendApiKey = () => config.RESEND_API_KEY?.trim();

export const getMailConfigError = () => {
  const from = getSanitizedEmailFrom();
  const apiKey = getSanitizedResendApiKey();

  if (!from) {
    return "EMAIL_FROM must be set in backend/.env";
  }

  if (!apiKey) {
    return "RESEND_API_KEY must be set in backend/.env";
  }

  return null;
};

export const getMailSendErrorMessage = (error) => {
  const message = error?.message?.toLowerCase() || "";

  if (
    error?.name === "ValidationError" ||
    message.includes("invalid from") ||
    message.includes("invalid to") ||
    message.includes("missing to")
  ) {
    return "Invalid email payload. Check EMAIL_FROM, recipient address, and message fields.";
  }

  if (error?.statusCode === 401 || message.includes("unauthorized")) {
    return "Resend authentication failed. Check RESEND_API_KEY.";
  }

  if (error?.statusCode === 429 || message.includes("rate limit")) {
    return "Email sending was rate limited. Try again shortly.";
  }

  if (!isProduction && error?.message) {
    return `Server error while sending email: ${error.message}`;
  }

  return "Server error while sending email";
};

const getResendClient = () => {
  const apiKey = getSanitizedResendApiKey();

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
};

const formatFromAddress = () => {
  const from = getSanitizedEmailFrom();

  if (!from) {
    return "Zepto <onboarding@resend.dev>";
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
        content: bufferContent.toString("base64"),
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

  const resend = getResendClient();

  if (!resend) {
    return { success: false, message: "RESEND_API_KEY must be set in backend/.env" };
  }

  try {
    const result = await resend.emails.send({
      from: formatFromAddress(),
      to,
      subject,
      text,
      html,
      replyTo,
      ...(attachments.length ? { attachments: normalizeAttachments(attachments) } : {}),
    });

    if (result.error) {
      return { success: false, message: result.error.message || "Failed to send email" };
    }

    return { success: true, data: result.data };
  } catch (error) {
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
