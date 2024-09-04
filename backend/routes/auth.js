const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const authController = require("../controllers/authController");
const User = require("../models/users");

// Register route with validation
router.post(
  "/register",
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("email")
      .isEmail()
      .withMessage("Valid email is required")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error("Email already in use");
        }
        return true;
      }),
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/)
      .withMessage(
        "Password must include an uppercase letter, a number, and a special character"
      ),
  ],
  authController.register // Ensure the controller is correctly referenced
);

// Login route with validation
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

// Verify email route
router.get("/verify/:token", authController.verifyEmail);

// Verify email route
// router.get("/verify/:token", async (req, res) => {
//   console.log("Verification endpoint hit");
//   const { token } = req.params;

//   try {
//     const user = await User.findOne({
//       verificationToken: token,
//       verificationTokenExpires: { $gt: Date.now() },
//     });

//     if (!user) {
//       console.log("No user found or token expired");
//       return res.status(400).json({ message: "Invalid or expired token" });
//     }

//     // Mark the user as verified
//     // Update and save the user
//     user.verificationToken = undefined;
//     user.verificationTokenExpires = undefined;
//     user.isVerified = true;
//     console.log("User before save:", user);
//     await user.save();
//     console.log("User after save:", user);

//     // Redirect to verification success page
//     res.redirect(`${process.env.FRONTEND_BASE_URL}/verify-success`);
//   } catch (error) {
//     console.error("Error verifying email:", error);
//     res.status(500).json({ message: "Error verifying email", error });
//   }
// });

// Request password reset route
router.post(
  "/password-reset",
  [check("email").isEmail().withMessage("Valid email is required")],
  authController.requestPasswordReset
);

// Reset password route
router.post(
  "/reset/:token",
  [
    check("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/)
      .withMessage(
        "Password must include an uppercase letter, a number, and a special character"
      ),
  ],
  authController.resetPassword
);

module.exports = router;
