import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import CategoryCard from "../../Components/Card/CategoryCard";
import { useStudent } from "../../context/StudentContext";

export default function StudentDashboard() {
  const { student } = useStudent();
  console.log("the student name is ", student?.name);

  const [categories, setCategories] = useState([
    "Chairman",
    "Counselor",
    "Arts Secretary",
    "Sports Captain",
    "Cultural Coordinator",
    "Technical Lead",
  ]);

  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/vote/${category}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* <h2>Welcome to the Student Dashboard </h2> */}
        <h2>Welcome {student?.name || "Student"}</h2> {/* 👈 dynamic name */}
        {/* <button className="btn btn-danger">Logout</button> */}
      </div>

      <p>Select a category to vote:</p>

      <div className="row g-4">
        {categories.map((category) => (
          <div key={category} className="col-12 col-md-4">
            <CategoryCard
              title={category}
              onClick={() => handleCategoryClick(category)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
