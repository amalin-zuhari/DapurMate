import React from "react";
import {
  AppWrapper,
  Container,
  Form,
  Title,
  Paragraph,
  Button,
} from "./FPStyles"; // Ensure this import path matches your project structure
import { useNavigate } from "react-router-dom";

function VerificationSuccess() {
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate("/inventory", { replace: true }); // Redirect to the inventory page after successful verification
  };

  return (
    <AppWrapper>
      <Container>
        <Form>
          <Title>Email Verified Successfully!</Title>
          <Paragraph>
            Thank you for verifying your email address. Your account is now
            active.
          </Paragraph>
          <Button onClick={handleProceed}>OK</Button>
        </Form>
      </Container>
    </AppWrapper>
  );
}

export default VerificationSuccess;
