import React, { useState } from "react";
import {
  Toast,
  ToastContainer,
  Form,
  Button,
  Container,
  Card,
} from "react-bootstrap";
import { useStudent } from "../../context/StudentContext"; // Import context
import "bootstrap/dist/css/bootstrap.min.css";
import "../../Pages/Login/login.css";

const LoginForm = () => {
  const { setStudent } = useStudent(); // Use student context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
    setTimeout(
      () => setToast({ show: false, message: "", variant: "success" }),
      3000
    );
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data); // Debugging log

      if (response.ok) {
        if (data.message === "OTP sent to your email") {
          setShowOtpInput(true); // Show OTP input
          showToast("OTP sent to your email!");
        } else if (data.user && data.user.role === "admin") {
          // Admin login
          localStorage.setItem("token", data.token);
          showToast("Admin login successful!");
          setTimeout(() => (window.location.href = "/admin-dashboard"), 1000);
        } else {
          showToast("Unexpected response: " + JSON.stringify(data), "danger");
        }
        //  Save student details to context and localStorage
        setStudent(data.user);
        localStorage.setItem("student", JSON.stringify(data.user));
      } else {
        showToast(data.message || "Login failed!", "danger");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Something went wrong!", "danger");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast("Login successful!");

        // ✅ Store token in local storage
        localStorage.setItem("token", data.token);
        localStorage.setItem("student", JSON.stringify(data.user));

        setTimeout(() => (window.location.href = "/student-dashboard"), 1000);
      } else {
        showToast(data.message, "danger");
      }
    } catch (error) {
      console.error("Error:", error);
      showToast("Something went wrong!", "danger");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#121212" }}
    >
      <Card
        className="p-4 login-card text-white"
        style={{
          backgroundColor: "#1E1E1E",
          borderRadius: "10px",
          width: "350px",
        }}
      >
        <h2 className="text-center">Login</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                backgroundColor: "#333",
                color: "white",
                border: "none",
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: "#333",
                color: "white",
                border: "none",
              }}
            />
          </Form.Group>

          {!showOtpInput ? (
            <Button
              variant="primary"
              className="w-100"
              style={{ backgroundColor: "#6200EE", border: "none" }}
              onClick={handleLogin}
            >
              Login
            </Button>
          ) : (
            <>
              <Form.Group className="mt-3">
                <Form.Label>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{
                    backgroundColor: "#333",
                    color: "white",
                    border: "none",
                  }}
                />
              </Form.Group>
              <Button
                variant="success"
                className="w-100 mt-3"
                style={{ backgroundColor: "#03DAC6", border: "none" }}
                onClick={handleVerifyOtp}
              >
                Verify OTP
              </Button>
            </>
          )}
        </Form>
      </Card>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={toast.show}
          bg={toast.variant}
          onClose={() => setToast({ ...toast, show: false })}
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default LoginForm;
