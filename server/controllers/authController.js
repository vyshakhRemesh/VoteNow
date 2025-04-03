const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

let otps = {}; // Temporary storage for OTPs

// Function to send OTP to user's email (for students only)
const sendOtp = async (email) => {
  try {
    const otp = crypto.randomInt(100000, 999999).toString();
    otps[email] = otp; // Store OTP temporarily
    console.log(`Generated OTP for ${email}:`, otp); // Debugging log

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Voting System" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent successfully!"); // Debugging log
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

// Function to verify OTP (for students)
const verifyOtp = (email, otp) => {
  return otps[email] === otp; // Check if the OTP matches
};

// Updated Login Function for Admin & Student
const loginUser = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // **Admin Login (No OTP Required)**
    if (user.role === "admin") {
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // **Student Login (Requires OTP Verification)**
    if (!otp) {
      await sendOtp(email);
      return res.status(200).json({ message: "OTP sent to your email" });
    }

    // Verify OTP
    if (!verifyOtp(email, otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Generate token after OTP verification
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        votes: user.votes || {},
      },
    });

    // Remove OTP after successful login
    delete otps[email];
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { loginUser, sendOtp, verifyOtp };
