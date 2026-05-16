import nodemailer from "nodemailer";
import config from "../config/config.js";

const isProduction = config.NODE_ENV === "production";
const RESEND_API_URL = "https://api.resend.com/emails";
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const hasBrevoApiConfig = () => Boolean(config.BREVO_API_KEY?.trim() && config.EMAIL_FROM?.trim());
const hasResendConfig = () => Boolean(config.RESEND_API_KEY?.trim() && config.EMAIL_FROM?.trim());

export const getSanitizedEmailFrom = () => config.EMAIL_FROM?.trim() || config.EMAIL_USER?.trim();

export const getMailConfigError = () => {
  const resendKey = config.RESEND_API_KEY?.trim();
  const from = getSanitizedEmailFrom();
  const user = config.EMAIL_USER?.trim();
  const pass = config.EMAIL_PASS?.trim();

  if (resendKey && !from) {
    return "EMAIL_FROM is required when using RESEND_API_KEY";
  }

  const brevoKey = config.BREVO_API_KEY?.trim();
  if (brevoKey && !from) {
    return "EMAIL_FROM is required when using BREVO_API_KEY";
  }

  if (!brevoKey && !resendKey && (!user || !pass)) {
    return "Missing mail configuration. Set BREVO_API_KEY + EMAIL_FROM, RESEND_API_KEY + EMAIL_FROM, or EMAIL_USER + EMAIL_PASS";
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

  if (message.includes("resend") || message.includes("unauthorized") || message.includes("invalid_api_key")) {
    return "Resend API auth failed. Check RESEND_API_KEY and EMAIL_FROM sender verification.";
  }

  if (message.includes("invalid to") || message.includes("invalid from") || message.includes("missing to")) {
    return "Invalid email payload. Check EMAIL_FROM, recipient address, and message fields.";
  }

  if (message.includes("timeout") || message.includes("etimedout") || message.includes("socket hang up")) {
    return "SMTP connection timed out. On deployment, prefer BREVO_API_KEY or RESEND_API_KEY over raw SMTP, or try SMTP_PORT=465 with SMTP_SECURE=true for Brevo.";
  }

  if (error?.message) {
    return `Email error: ${error.message}`;
  }

  return "Server error while sending email";
};

const createTransporter = ({ port = config.SMTP_PORT || 587, secure = Boolean(config.SMTP_SECURE) } = {}) => {
  const user = config.EMAIL_USER?.trim();
  const pass = config.EMAIL_PASS?.trim();

  if (!user || !pass) return null;

  const transporter = nodemailer.createTransport({
    host: config.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(port),
    secure,
    auth: { user, pass },
    family: 4,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    requireTLS: port === 587,
  });

  return transporter;
};

const sendWithSmtpFallback = async ({ to, subject, text, html, replyTo, attachments = [] }) => {
  const candidates = [
    {
      port: Number(config.SMTP_PORT || 587),
      secure: Boolean(config.SMTP_SECURE),
    },
    {
      port: 465,
      secure: true,
    },
    {
      port: 587,
      secure: false,
    },
  ];

  const tried = [];

  for (const candidate of candidates) {
    const signature = `${candidate.port}/${candidate.secure ? "secure" : "starttls"}`;
    if (tried.includes(signature)) continue;
    tried.push(signature);

    const transporter = createTransporter(candidate);
    if (!transporter) {
      continue;
    }

    try {
      const fromAddress = formatFromAddress();
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject,
        text,
        html,
        replyTo: replyTo || getSanitizedEmailFrom(),
        attachments: attachments.length ? normalizeAttachments(attachments) : undefined,
      });

      return { ...info, provider: `smtp:${candidate.port}` };
    } catch (error) {
      const message = String(error?.message || "").toLowerCase();
      const isTimeout = message.includes("timeout") || message.includes("etimedout") || message.includes("socket hang up");
      const isConnect = message.includes("connect") || message.includes("tls") || error?.code === "ECONNECTION";

      if (!isTimeout && !isConnect) {
        throw error;
      }

      console.warn(`SMTP attempt failed on port ${candidate.port}: ${error.message}`);
    }
  }

  throw new Error("SMTP connection timed out on all configured ports");
};

const formatFromAddress = () => {
  const from = getSanitizedEmailFrom();

  if (!from) {
    return "Zepto Admin <zeptoecommerce@gmail.com>";
  }

  // If the user provided the full format like "Company <email@company.com>", use it as is.
  if (from.includes("<") && from.includes(">")) {
    return from;
  }

  // If they only provided an email, we wrap it with the company name "Zepto Admin".
  return `Zepto Admin <${from}>`;
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

const normalizeResendAttachments = (attachments = []) =>
  normalizeAttachments(attachments).map((attachment) => ({
    filename: attachment.filename,
    content: attachment.content.toString("base64"),
    content_type: attachment.contentType,
  }));

const normalizeBrevoAttachments = (attachments = []) =>
  normalizeAttachments(attachments).map((attachment) => ({
    name: attachment.filename,
    content: attachment.content.toString("base64"),
  }));

const toBrevoRecipients = (to) =>
  (Array.isArray(to) ? to : [to]).filter(Boolean).map((email) => ({ email }));

const sendWithBrevoApi = async ({ to, subject, text, html, replyTo, attachments = [] }) => {
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": config.BREVO_API_KEY?.trim(),
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        email: getSanitizedEmailFrom(),
        name: "Zepto Admin",
      },
      to: toBrevoRecipients(to),
      replyTo: replyTo ? { email: replyTo } : undefined,
      subject,
      textContent: text,
      htmlContent: html,
      attachment: attachments.length ? normalizeBrevoAttachments(attachments) : undefined,
    }),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const apiError = body?.message || body?.error || `Brevo API error ${response.status}`;
    const error = new Error(apiError);
    error.code = "EBREVO";
    throw error;
  }

  return {
    messageId: body?.messageId || body?.messageId || body?.message_id,
    provider: "brevo-api",
  };
};

const sendWithResend = async ({ to, subject, text, html, replyTo, attachments = [] }) => {
  const payload = {
    from: formatFromAddress(),
    to: Array.isArray(to) ? to : [to],
    subject,
    text,
    html,
    reply_to: replyTo || getSanitizedEmailFrom(),
  };

  if (attachments.length) {
    payload.attachments = normalizeResendAttachments(attachments);
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.RESEND_API_KEY?.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const apiError = body?.message || body?.error || `Resend API error ${response.status}`;
    const error = new Error(apiError);
    error.code = "ERESEND";
    throw error;
  }

  return {
    messageId: body?.id,
    provider: "resend",
  };
};

export const sendMail = async ({ to, subject, text, html, replyTo, attachments = [] }) => {
  const mailConfigError = getMailConfigError();

  if (mailConfigError) {
    if (!isProduction) {
      console.warn("Email disabled in development:", mailConfigError);
      return { success: true, devMode: true };
    }

    return { success: false, message: mailConfigError };
  }

  try {
    const useBrevoApi = hasBrevoApiConfig();
    const useResend = hasResendConfig();
    let info;

    if (useBrevoApi) {
      info = await sendWithBrevoApi({ to, subject, text, html, replyTo, attachments });
    } else if (useResend) {
      info = await sendWithResend({ to, subject, text, html, replyTo, attachments });
    } else {
      info = await sendWithSmtpFallback({ to, subject, text, html, replyTo, attachments });
    }

    console.log(`Email sent to [${to}]. Provider: ${info.provider || "smtp"}. MessageId: ${info.messageId}`);
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
      console.warn("Email send failed in development (auth error or network issue):", error.message);
      return { success: true, devMode: true, message: error.message };
    }

    return { success: false, message: getMailSendErrorMessage(error) };
  }
};

export const sendOtpEmail = async (email, otp) => {
  const result = await sendMail({
    to: email,
    subject: `${otp} is your Zepto verification code`,
    text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #3e0075; text-align: center;">Zepto Verification</h2>
        <p>Hello,</p>
        <p>Your One-Time Password (OTP) for logging into your Zepto account is:</p>
        <div style="background-color: #f3f3f3; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ff3366; border-radius: 5px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This code will expire in <strong>5 minutes</strong>.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
          If you did not request this code, please ignore this email.
        </p>
      </div>
    `,
    replyTo: getSanitizedEmailFrom(),
  });

  if (result.success) {
    return result;
  }

  return result;
};
