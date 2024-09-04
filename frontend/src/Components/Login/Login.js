import React, { useState } from "react";
import * as Components from "./LoginStyles";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import "../../Styles/Login.css";

function Login() {
  const [signIn, setSignIn] = useState(true);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState(""); // State for login error message
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear the specific error for this field on change
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!signIn) {
      // Sign-up form validation
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
      } else if (
        !/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}/.test(formData.password)
      ) {
        newErrors.password =
          "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.";
      }
    } else {
      // Login form validation
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.password.trim()) {
        newErrors.password = "Password is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    if (!validateForm()) return;

    const url = signIn
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Display error message under the password input for login errors
        if (signIn) {
          setLoginError("Invalid email or password.");
        }
        if (
          data.errors &&
          data.errors.some((error) => error.msg === "Email already in use")
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: "Email already registered. Please use a different email.",
          }));
        }
        console.error("Error response:", data);
        throw new Error("Network response was not ok");
      }

      console.log(signIn ? "Logged in:" : "Registered:", data);

      // If it's a sign-up, redirect to Verify Your Email page
      if (!signIn) {
        navigate("/verify-email");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFormSwitch = (isSignIn) => {
    setSignIn(isSignIn);
    setErrors({}); // Clear errors when switching forms
    setFormData({ name: "", email: "", password: "" }); // Optionally reset form data
    setLoginError(""); // Clear login error when switching forms
  };

  return (
    <Components.AppWrapper>
      <Components.Container className="container">
        {!signIn && (
          <Components.SignUpContainer signinIn={signIn}>
            <Components.Form onSubmit={handleSubmit}>
              <Components.Title>Create Account</Components.Title>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                <Components.Input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-field ${
                    !signIn && errors.name ? "error" : ""
                  }`}
                  style={{ marginBottom: "5px" }}
                />
                {!signIn && errors.name && (
                  <div className="error-message">{errors.name}</div>
                )}
              </div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  textAlign: "left",
                  marginTop: "10px",
                }}
              >
                <Components.Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${
                    !signIn && errors.email ? "error" : ""
                  }`}
                  style={{ marginBottom: "5px" }}
                />
                {!signIn && errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  textAlign: "left",
                  marginTop: "10px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ position: "relative", width: "100%" }}>
                  <Components.Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field ${
                      !signIn && errors.password ? "error" : ""
                    }`}
                    style={{ paddingRight: "40px", marginBottom: "5px" }}
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={handleTogglePassword}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#949494",
                      pointerEvents: "auto",
                    }}
                  />
                </div>
                {!signIn && errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
              </div>
              <Components.Button>Sign Up</Components.Button>
            </Components.Form>
          </Components.SignUpContainer>
        )}
        {signIn && (
          <Components.SignInContainer signinIn={signIn}>
            <Components.Form onSubmit={handleSubmit}>
              <Components.Title>Sign in</Components.Title>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "10px",
                }}
              >
                <Components.Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`input-field ${
                    signIn && errors.email ? "error" : ""
                  }`}
                  style={{ marginBottom: "5px" }}
                />
                {signIn && errors.email && (
                  <div className="error-message">{errors.email}</div>
                )}
              </div>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "10px",
                }}
              >
                <div style={{ position: "relative", width: "100%" }}>
                  <Components.Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field ${
                      signIn && errors.password ? "error" : ""
                    }`}
                    style={{ paddingRight: "40px", marginBottom: "5px" }}
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={handleTogglePassword}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#949494",
                      pointerEvents: "auto",
                    }}
                  />
                </div>
                {signIn && errors.password && (
                  <div className="error-message">{errors.password}</div>
                )}
                {/* Display the login error below the password input */}
                {signIn && loginError && (
                  <div className="error-message">{loginError}</div>
                )}
              </div>
              <Components.Anchor as={Link} to="/forgot-password">
                Forgot your password?
              </Components.Anchor>
              <Components.Button>Sign In</Components.Button>
            </Components.Form>
          </Components.SignInContainer>
        )}
        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title>Welcome Back!</Components.Title>
              <Components.Paragraph>
                To keep connected with us please login with your personal info
              </Components.Paragraph>
              <Components.GhostButton onClick={() => handleFormSwitch(true)}>
                Sign In
              </Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title>Hello, Friend!</Components.Title>
              <Components.Paragraph>
                Enter Your personal details and start journey <br /> with us
              </Components.Paragraph>
              <Components.GhostButton onClick={() => handleFormSwitch(false)}>
                Sign Up
              </Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>
    </Components.AppWrapper>
  );
}

export default Login;
