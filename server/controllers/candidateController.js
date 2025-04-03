const Candidate = require("../models/Candidate");

// Get candidates by category (Already implemented)
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

// Get all candidates
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find(); // Fetch all candidates
    res.json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new candidate
const createCandidate = async (req, res) => {
  const { name, category, description } = req.body;

  try {
    if (!name || !category) {
      return res
        .status(400)
        .json({ message: "Name and category are required." });
    }

    const newCandidate = new Candidate({ name, category, description });
    await newCandidate.save();

    res.status(201).json(newCandidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create candidate" });
  }
};

// Update candidate
const updateCandidate = async (req, res) => {
  const { id } = req.params;
  const { name, category, description } = req.body;

  try {
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.name = name || candidate.name;
    candidate.category = category || candidate.category;
    candidate.description = description || candidate.description;
    await candidate.save();

    res.json(candidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update candidate" });
  }
};

// Delete candidate
const deleteCandidate = async (req, res) => {
  const { id } = req.params;

  try {
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await candidate.deleteOne();
    res.json({ message: "Candidate deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete candidate" });
  }
};

module.exports = {
  getCandidatesByCategory,
  getAllCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
};
