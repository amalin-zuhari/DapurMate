import React, { useState } from "react";
import {
  AppWrapper,
  Container,
  Form,
  Title,
  Input,
  Button,
  Paragraph,
} from "./FPStyles"; // Ensure this import path matches your project structure

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // For showing success or error messages

  const handleChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/password-reset",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Network response was not ok");

      setMessage("Password reset email sent. Please check your inbox.");
    } catch (error) {
      setMessage(
        error.message || "Failed to send reset email. Please try again later."
      );
    }
  };

  return (
    <AppWrapper>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Title>Reset Your Password</Title>
          <Paragraph>Please enter your email to reset password.</Paragraph>
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={handleChange}
            required
          />
          {message && <Paragraph>{message}</Paragraph>}
          <Button type="submit">Send Reset Link</Button>
        </Form>
      </Container>
    </AppWrapper>
  );
}

export default ForgotPassword;
