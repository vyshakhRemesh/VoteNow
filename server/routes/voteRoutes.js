// routes/voteRoutes.js
const express = require("express");
const router = express.Router();
const { voteCandidate } = require("../controllers/voteController");
// const authMiddleware = require("../middleware/authMiddleware");

router.post("/", voteCandidate);

module.exports = router;
