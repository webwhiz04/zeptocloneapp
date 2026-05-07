import dotenv from "dotenv";
dotenv.config();

const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    // Email Config (Brevo SMTP)
    EMAIL_USER: process.env.EMAIL_USER || "",
    EMAIL_PASS: process.env.EMAIL_PASS || "",
    // Use EMAIL_FROM from env, or fall back to EMAIL_USER
    EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER || "zeptoecommerce@gmail.com",
    
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    NODE_ENV: process.env.NODE_ENV || "production",
};

export default config;
