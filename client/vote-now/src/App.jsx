import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Pages/Login/Login";
import Vote from "./Pages/VotePage/Vote";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import ResultsPage from "./Pages/Result/Result";

function App() {
  return (
    <>
      <Routes>
        {/* No navbar on login */}
        <Route path="/login" element={<Login />} />

        {/* Navbar for protected routes */}
        <Route path="/" element={<Navbar />}>
          {/* Redirect / to /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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
        </Route>
      </Routes>
    </>
  );
}

export default App;
