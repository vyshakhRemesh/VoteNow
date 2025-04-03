import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useStudent } from "../../context/StudentContext";
import CategoryCard from "../../Components/Card/CategoryCard";
import axios from "../../api/axios";
import ConfirmVoteModal from "../../Components/Modal/ConfirmVoteModal";
import { Toast } from "bootstrap"; // Import Bootstrap Toast

export default function VotePage() {
  const { category } = useParams();
  const { student, setStudent } = useStudent();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  const showToast = (message, type = "success") => {
    // Remove any existing toast
    const existingToast = document.getElementById("custom-toast");
    if (existingToast) {
      existingToast.remove();
    }

    // Create Toast Element
    const toastElement = document.createElement("div");
    toastElement.id = "custom-toast";
    toastElement.className = `toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3`;
    toastElement.role = "alert";
    toastElement.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;

    document.body.appendChild(toastElement);

    // Initialize Bootstrap Toast
    const toast = new Toast(toastElement, { autohide: true, delay: 3000 });
    toast.show();
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

      showToast(
        `Vote submitted for ${selectedCandidate.name} in ${category}`,
        "success"
      );

      setShowModal(false); // Close modal after successful vote
    } catch (error) {
      console.error(error);
      showToast(error.response?.data?.message || "Error voting", "danger");

      setShowModal(false); // Close modal even on error
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
        description={selectedCandidate?.description} // ✅ Pass the description
        onConfirm={handleVote}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
