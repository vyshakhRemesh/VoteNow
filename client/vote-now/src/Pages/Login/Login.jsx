import React from "react";
import LoginForm from "../../Components/LoginForm/LoginForm";
import "./login.css";

const Login = () => {
  return (
    <div className="formcontainer">
      <h1>VoteNow</h1>
      <p>Your Voice, Your Vote, Your Future</p>
      <LoginForm />
    </div>
  );
};

export default Login;
