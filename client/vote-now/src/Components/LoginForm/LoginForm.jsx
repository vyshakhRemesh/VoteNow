import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const baseUrl = 'http://localhost:5173/api/auth';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // First, send the login request
      const response = await axios.post(`${baseUrl}/login`, { email, password, otp });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleOtpRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${baseUrl}/login/otp`, { email });
      setMessage('OTP sent to your email');
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/login/verify`, { email, otp });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="button" onClick={handleOtpRequest}>
        Send OTP
      </button>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button type="button" onClick={handleOtpVerify}>
        Verify OTP
      </button>
      <button type="submit">Login</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default LoginForm;
