// FPStyles.js
import styled from "styled-components";

export const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f6f5f7; // Keeping the background consistent with the login page
`;

export const Container = styled.div`
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  position: relative;
  overflow: hidden;
  width: 500px; // Consistent width with the login form
  max-width: 100%;
  padding: 40px; // Sufficient padding for aesthetics
  box-sizing: border-box;
`;

export const Paragraph = styled.p`
  font-size: 16px; // Reasonable font size for instructions
  color: #666; // Subtle text color
  text-align: center; // Center alignment for better readability
  margin-top: 0; // Adjust margin as needed
  margin-bottom: 20px; // Space before the input field
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: 24px; // Bold and clear title
  margin-bottom: 20px;
  color: #333; // Dark color for better readability
`;

export const Input = styled.input`
  background-color: #eee;
  border: 1px solid #ddd;
  padding: 12px 15px;
  margin-bottom: 10px;
  width: 100%;
  border-radius: 10px;
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background-color: #28a745; // Use a standout color for actions
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
`;
