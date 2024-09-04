import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  AppWrapper,
  Container,
  Form,
  Title,
  Input,
  Button,
  Paragraph,
} from "./FPStyles";
import "../../Styles/ResetPassword.css";

function ResetPassword() {
  const { token } = useParams(); // Extract the token from URL params
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState(""); // For success or error messages
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages

    if (passwords.password !== passwords.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/reset/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: passwords.password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        setMessage("Failed to reset password.");
        return;
      }

      setMessage("Your password has been reset successfully!");
      setSuccessModalVisible(true);
    } catch (error) {
      console.error("Error:", error);
      setMessage("Error resetting password.");
    }
  };

  return (
    <AppWrapper>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Title>Reset Your Password</Title>
          <Paragraph>Please enter your new password.</Paragraph>
          <Input
            type="password"
            name="password"
            placeholder="New Password"
            value={passwords.password}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={passwords.confirmPassword}
            onChange={handleChange}
            required
          />
          {message && <Paragraph>{message}</Paragraph>}
          <Button type="submit">Reset Password</Button>
        </Form>
        {successModalVisible && (
          <div className="modal">
            <div className="modal-content">
              <p>✔️ Your password has been reset successfully!</p>
              <Button onClick={() => navigate("/login")}>OK</Button>
            </div>
          </div>
        )}
      </Container>
    </AppWrapper>
  );
}

export default ResetPassword;
