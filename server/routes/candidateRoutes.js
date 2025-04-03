const express = require("express");
const router = express.Router();
const {
  getCandidatesByCategory,
  getAllCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
} = require("../controllers/candidateController");

// Fetch all candidates
router.get("/", getAllCandidates);

// Fetch candidates by category
router.get("/:category", getCandidatesByCategory);

// Create a new candidate (Admin only)
router.post("/", createCandidate);

// Update candidate (Admin only)
router.put("/:id", updateCandidate);

// Delete candidate (Admin only)
router.delete("/:id", deleteCandidate);

module.exports = router;
