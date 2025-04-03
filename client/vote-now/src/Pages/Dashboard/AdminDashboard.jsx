import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CategoryCard from "../../Components/Card/CategoryCard";
import { useEffect, useState } from "react";
import axios from "axios";
import "./dashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    fetchTotalVotes();
  }, []);

  const fetchTotalVotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/votes/total");
      setTotalVotes(res.data.totalVotes);
    } catch (err) {
      console.error("Error fetching total votes:", err);
    }
  };

  const adminActions = [
    {
      title: "Manage Candidates",
      onClick: () => navigate("/admin/candidates"),
    },
    // { title: "Manage Voting", onClick: () => navigate("") },
    { title: "Live Voting Results", onClick: () => navigate("/result") },
    // { title: `Total Polls: ${totalVotes}`, onClick: () => {} },
  ];

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-white">Admin Dashboard</h2>
      </div>

      <p className="text-light">Select an action:</p>

      <div className="row g-4">
        {adminActions.map((action) => (
          <div key={action.title} className="col-12 col-md-4">
            <CategoryCard title={action.title} onClick={action.onClick} />
          </div>
        ))}
      </div>
    </div>
  );
}
