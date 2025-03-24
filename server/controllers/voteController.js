const User = require("../models/User");
const Candidate = require("../models/Candidate");

const voteCandidate = async (req, res) => {
  const { email, category, candidate } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent double voting in the same category
    if (user.votes[category]) {
      return res
        .status(400)
        .json({ message: "Already voted in this category" });
    }

    // user.votes[category] = candidate;
    user.votes.set(category, candidate); // ✅ proper for Map

    await user.save();

    // Increment candidate's vote count
    const candidateDoc = await Candidate.findOne({
      name: candidate,
      category: category,
    });

    if (!candidateDoc) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidateDoc.votes += 1;
    await candidateDoc.save();

    console.log("vote successfull ", user);

    res.json({ message: "Vote recorded successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { voteCandidate };
