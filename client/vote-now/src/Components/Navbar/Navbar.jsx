import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import AnimatedGrid from "../AnimatedGrid/AnimatedGrid";
import { useStudent } from "../../context/StudentContext";

function ColorSchemesExample() {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, setStudent } = useStudent();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setStudent(null);
    localStorage.removeItem("student");
    navigate("/login");
  };

  return (
    <>
      <AnimatedGrid />
      <Navbar bg="dark" variant="dark" expand="lg" className="custom-navbar">
        <div className="navbar-inner">
          {/* Left: Logo */}
          <div className="navbar-left">
            <Navbar.Brand as={Link} to="/" className="brand-text">
              VoteNow
            </Navbar.Brand>
          </div>

          {/* Right: Links + Logout */}
          <div className="navbar-right">
            <Nav className="nav-links">
              <Nav.Link
                as={Link}
                to={`/${student?.role}-dashboard`}
                className={
                  location.pathname === `/${student?.role}-dashboard`
                    ? "active"
                    : ""
                }
              >
                Dashboard
              </Nav.Link>

              {student?.role === "student" && (
                <Nav.Link
                  as={Link}
                  to="/vote/Chairman"
                  disabled
                  className={
                    location.pathname.startsWith("/vote") ? "active" : ""
                  }
                >
                  Vote
                </Nav.Link>
              )}

              {/* Show Candidates tab only for Admin */}
              {student?.role === "admin" && (
                <Nav.Link
                  as={Link}
                  to="/admin/candidates"
                  className={
                    location.pathname.startsWith("/admin/candidates")
                      ? "active"
                      : ""
                  }
                >
                  Candidates
                </Nav.Link>
              )}
              {student?.role === "admin" && (
                <Nav.Link
                  as={Link}
                  to="/result"
                  className={
                    location.pathname.startsWith("/result") ? "active" : ""
                  }
                >
                  Result
                </Nav.Link>
              )}

              <Nav.Link
                as={Link}
                to="/notification"
                disabled
                className={
                  location.pathname.startsWith("/notification") ? "active" : ""
                }
              >
                Notifications
              </Nav.Link>
            </Nav>

            <Button
              variant="outline-light"
              onClick={handleLogout}
              className="logout-btn"
            >
              Logout
            </Button>
          </div>
        </div>
      </Navbar>

      {/* Content area */}
      <Container className="mt-4" style={{ position: "relative", zIndex: "1" }}>
        <Outlet />
      </Container>
    </>
  );
}

export default ColorSchemesExample;
