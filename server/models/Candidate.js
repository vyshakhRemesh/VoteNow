const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Chairman",
      "Counselor",
      "Arts Secretary",
      "Sports Captain",
      "Cultural Coordinator",
      "Technical Lead",
    ],
  },
  description: {
    type: String, // Add this field
    required: true, // Optional, can remove if not required
  },
  votes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Candidate", candidateSchema);
