import React from "react";
import { AppWrapper, Container, Form, Title, Paragraph } from "./FPStyles"; // Ensure this import path matches your project structure

function VerifyYourEmail() {
  return (
    <AppWrapper>
      <Container>
        <Form>
          <Title>Verify Your Email</Title>
          <Paragraph>
            We've sent a verification link to your email address. Please check
            your inbox and click the link to verify your account.
          </Paragraph>
        </Form>
      </Container>
    </AppWrapper>
  );
}

export default VerifyYourEmail;
