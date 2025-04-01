const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/authController");

router.post("/login", loginUser);
router.post("/login/otp", async (req, res) => {
  const { email } = req.body;
  await sendOtp(email);
  res.status(200).json({ message: "OTP sent to your email" });
});

router.post("/login/verify", async (req, res) => {
  const { email, otp } = req.body;
  const isValid = verifyOtp(email, otp);
  if (isValid) {
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
});


module.exports = router;
