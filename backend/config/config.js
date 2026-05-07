import dotenv from "dotenv";
dotenv.config();

const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM,
    
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
};

export default config;
