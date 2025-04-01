// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );

//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ msg: "Server Error" });
//   }
// };

// controllers/authController.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer"); // Import nodemailer for sending emails
const crypto = require("crypto"); // Import crypto for generating OTP

let otps = {}; // Temporary storage for OTPs

// Function to send OTP to user's email
const sendOtp = async (email) => {
  const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
  otps[email] = otp; // Store OTP temporarily
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions); // Send the email
};

// Function to verify OTP
const verifyOtp = (email, otp) => {
  return otps[email] === otp; // Check if the OTP matches
};

const loginUser = async (req, res) => {
  const { email, password, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    if (!otp) {
      await sendOtp(email); // Send OTP if not provided
      return res.status(200).json({ message: "OTP sent to your email" });
    }

    if (!verifyOtp(email, otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Don't send password back to frontend!
    const studentData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      votes: user.votes || {},
    };

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      student: studentData, // Sending student data here
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};


// Removed duplicate declaration of loginUser

module.exports = { loginUser };

//need to change this code to incorporate hashed passwords in the database
//currently using plain text as password in the db
//for testing purpose
