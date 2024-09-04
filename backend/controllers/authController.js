const { validationResult } = require("express-validator");
const User = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Create a transporter using SMTP for Gmail
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send an email
const sendEmail = (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // Receiver's email
    subject,
    text, // Plain text body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
};

// Register user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new User({ name, email, password });

    const verificationToken = crypto.randomBytes(20).toString("hex");
    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpires = Date.now() + 3600000; // 1 hour

    await newUser.save();

    const verificationLink = `${process.env.FRONTEND_BASE_URL}/verify/${verificationToken}`;
    const subject = "Verify Your Email";
    const text = `Please verify your email by clicking the following link: ${verificationLink}`;

    sendEmail(email, subject, text);

    res.status(201).json({
      message:
        "User registered successfully. A verification email has been sent to your email address.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Verify email endpoint
// Verify email endpoint
exports.verifyEmail = async (req, res) => {
  const { token } = req.params; // Get token from URL parameters

  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      // If no user is found or the token is expired, send an error response
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Clear verification token and expiration, mark user as verified
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    user.isVerified = true; // Mark the user as verified
    await user.save();

    // Send a response back to the user indicating success
    res.redirect("/verify-success"); // This should redirect to the frontend route you've set up
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Error verifying email", error });
  }
};

// Send password reset email
const sendPasswordResetEmail = async (user) => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetToken = resetToken;
  user.resetTokenExpires = Date.now() + 3600000; // 1 hour

  await user.save();

  const resetLink = `${process.env.FRONTEND_BASE_URL}/reset/${resetToken}`;
  const mailOptions = {
    to: user.email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset",
    text: `Please reset your password by clicking the following link: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Failed to send reset email:", err);
    } else {
      console.log("Password reset email sent!");
    }
  });
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "No account with that email address" });
    }

    await sendPasswordResetEmail(user);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Error requesting password reset", error });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password and update user record
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Error resetting password", error });
  }
};
