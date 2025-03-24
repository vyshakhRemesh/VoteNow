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

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid Credentials" });
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

module.exports = { loginUser };

//need to change this code to incorporate hashed passwords in the database
//currently using plain text as password in the db
//for testing purpose
