import "../../Pages/Dashboard/dashboard.css";

export default function CategoryCard({ title, onClick }) {
  return (
    <div className="custom-card" onClick={onClick}>
      <h5>{title}</h5>
    </div>
  );
}
