import dotenv from "dotenv";
dotenv.config();

const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    
    EMAIL_USER: process.env.EMAIL_USER || process.env.SMTP_USER || "",
    EMAIL_PASS: process.env.EMAIL_PASS || process.env.SMTP_PASS || "",
    SMTP_HOST: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    SMTP_PORT: Number(process.env.SMTP_PORT || 587),
    SMTP_SECURE: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    BREVO_API_KEY: process.env.BREVO_API_KEY || "",
    RESEND_API_KEY: process.env.RESEND_API_KEY || "",
    
    EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER || "zeptoecommerce@gmail.com",
    
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    NODE_ENV: process.env.NODE_ENV || "production",
};

export default config;
