import User from "../models/User.js";
import { sendOtpEmail } from "../utils/mailer.js";
import config from "../config/config.js";

const OTP_TTL_MS = 5 * 60 * 1000;

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

export const sendOtpHandler = async (req, res) => {
  let email = "";
  let otp = "";

  try {
    email = req.body.email?.trim().toLowerCase() || "";

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    otp = generateOtp();

    const emailResult = await sendOtpEmail(email, otp);

    if (!emailResult.success && config.NODE_ENV === "production") {
      console.error("OTP Email Error (Production):", emailResult.message);
      console.log(`CRITICAL: Check Render logs for this OTP if mail failed. OTP for ${email}: ${otp}`);
      
      // We still save the OTP to DB so the user isn't blocked if they can check logs
      await User.findOneAndUpdate(
        { email },
        { $set: { email, otp, otpExpires: new Date(Date.now() + OTP_TTL_MS) } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Return a message that suggests checking the log if they are the admin
      return res.json({ 
        message: "OTP generated. If email is not received, please check server logs (Admin only).",
        status: "logged_only"
      });
    }

    await User.findOneAndUpdate(
      { email },
      {
        $set: {
          email,
          otp,
          otpExpires: new Date(Date.now() + OTP_TTL_MS),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    if (emailResult.devMode) {
      return res.json({
        message: "OTP generated for development mode (email not sent)",
        devOtp: otp,
      });
    }

    return res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);

    if (config.NODE_ENV !== "production" && email && otp) {
      console.warn("Falling back to dev OTP response due to send OTP error.");
      console.log(`DEV OTP for ${email}: ${otp}`);

      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            email,
            otp,
            otpExpires: new Date(Date.now() + OTP_TTL_MS),
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      return res.json({
        message: "OTP generated for development mode (email not sent)",
        devOtp: otp,
      });
    }

    res.status(500).json({ message: "Server error while sending OTP" });
  }
};

export const verifyOtpHandler = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = req.body.otp?.trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otpExpires || user.otpExpires.getTime() < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await User.updateOne(
      { _id: user._id },
      {
        $unset: {
          otp: 1,
          otpExpires: 1,
        },
      }
    );

    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Server error while verifying OTP" });
  }
};
