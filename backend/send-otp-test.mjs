import dotenv from "dotenv";
dotenv.config();

import config from "./config/config.js";
import { sendOtpEmail } from "./utils/mailer.js";

const recipient = process.env.TEST_RECIPIENT || config.EMAIL_USER;
const otp = String(Math.floor(100000 + Math.random() * 900000));

(async () => {
  console.log("Sending OTP to:", recipient);
  try {
    const res = await sendOtpEmail(recipient, otp);
    console.log("Result:", res);
  } catch (err) {
    console.error("Error sending OTP:", err);
    process.exitCode = 1;
  }
})();
