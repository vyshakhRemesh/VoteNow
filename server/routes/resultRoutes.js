const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");

// Route to get results for each category
router.get("/results", async (req, res) => {
  try {
    // Aggregate the results by category and get the vote counts
    const results = await Candidate.aggregate([
      {
        $group: {
          _id: "$category", // Group by category
          candidates: {
            $push: {
              name: "$name",
              votesReceived: "$votes",
            },
          },
        },
      },
      { $sort: { _id: 1 } }, // Sort categories alphabetically
    ]);

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving results" });
  }
});

module.exports = router;
