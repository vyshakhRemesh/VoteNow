import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStudent } from "../../context/StudentContext";
import CategoryCard from "../../Components/Card/CategoryCard";
import axios from "../../api/axios";
import ConfirmVoteModal from "../../Components/Modal/ConfirmVoteModal";

export default function VotePage() {
  const { category } = useParams();
  const { student, setStudent } = useStudent();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch candidates from DB
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await axios.get(`/candidates/${category}`);
        setCandidates(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCandidates();
  }, [category]);

  const alreadyVotedFor = student?.votes?.[category];

  const handleCardClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleVote = async () => {
    try {
      await axios.post("/vote", {
        email: student.email,
        category,
        candidate: selectedCandidate.name,
      });

      setStudent((prev) => ({
        ...prev,
        votes: { ...prev.votes, [category]: selectedCandidate.name },
      }));

      alert(`Vote submitted for ${selectedCandidate.name} in ${category}`);
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Error voting");
      setShowModal(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-5">Candidates for {category}</h2>

      {alreadyVotedFor ? (
        <p className="text-success">
          You have already voted for <strong>{alreadyVotedFor}</strong> in{" "}
          <strong>{category}</strong>.
        </p>
      ) : candidates.length > 0 ? (
        <div className="row g-4 mt-5">
          {candidates.map((candidate) => (
            <div key={candidate._id} className="col-12 col-md-4">
              <CategoryCard
                title={candidate.name}
                onClick={() => handleCardClick(candidate)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No candidates available.</p>
      )}

      {/* Modal */}
      <ConfirmVoteModal
        show={showModal}
        candidate={selectedCandidate?.name}
        category={category}
        onConfirm={handleVote}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
