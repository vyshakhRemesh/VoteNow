const Candidate = require("../models/Candidate");

const getCandidatesByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const candidates = await Candidate.find({ category });
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getCandidatesByCategory };
