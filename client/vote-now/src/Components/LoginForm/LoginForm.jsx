import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios"; // adjust the path based on location

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

import "../../Pages/Login/login.css";

import { useStudent } from "../../context/StudentContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", variant: "" });
  const navigate = useNavigate();

  const { setStudent } = useStudent(); // <-- from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      console.log("the response data is 1 ", res.data);
      if (res.data.success) {
        console.log("the response data is 2", res.data);

        setStudent(res.data.student); // <-- set to context here
        navigate("/dashboard");
      }

      setToast({
        show: true,
        message: "Login Successful!",
        variant: "success",
      });
      // navigate("/dashboard");
    } catch (err) {
      setToast({
        show: true,
        message: "Invalid Credentials!",
        variant: "danger",
      });
    }
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        className="login-form"
        style={{
          width: "20%",
          margin: "100px auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          style={{ width: "50%", alignSelf: "center" }}
        >
          Login
        </Button>
      </Form>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toast.variant}
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          delay={3000}
          autohide
        >
          <Toast.Header closeButton>
            <strong className="me-auto">
              {toast.variant === "success" ? "Success" : "Error"}
            </strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

export default Login;
