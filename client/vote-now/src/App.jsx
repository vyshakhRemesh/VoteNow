import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import AdminDashboard from "./Pages/Dashboard/AdminDashboard";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Pages/Login/Login";
import Vote from "./Pages/VotePage/Vote";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import ResultsPage from "./Pages/Result/Result";
import CandidatesPage from "./Pages/Admin/Candidates/Candidates";

function App() {
  const storedUser = localStorage.getItem("student");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userRole = user?.role; // Extract role from user data
  return (
    <>
      <Routes>
        {/* No navbar on login */}
        <Route path="/login" element={<Login />} />

        {/* Root Route - Redirect to the correct dashboard based on role */}
        <Route
          path="/"
          element={
            userRole === "admin" ? (
              <Navigate to="/admin-dashboard" replace />
            ) : (
              <Navigate to="/student-dashboard" replace />
            )
          }
        />

        {/* Navbar for protected routes */}
        <Route path="/" element={<Navbar />}>
          {/* Redirect / to /dashboard */}
          {/* <Route index element={<Navigate to="/student-dashboard" replace />} /> */}

          <Route
            path="student-dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="vote/:category"
            element={
              <ProtectedRoute>
                <Vote />
              </ProtectedRoute>
            }
          />
          <Route
            path="result"
            element={
              <ProtectedRoute>
                <ResultsPage />
              </ProtectedRoute>
            }
          />
          {/* Admin Route for CRUD */}
          <Route
            path="admin/candidates"
            element={
              <ProtectedRoute>
                <CandidatesPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
