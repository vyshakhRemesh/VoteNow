const express = require("express");
const router = express.Router();
const {
  getCandidatesByCategory,
} = require("../controllers/candidateController");

router.get("/:category", getCandidatesByCategory);

module.exports = router;
