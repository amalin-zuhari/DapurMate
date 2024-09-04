import React from "react";
import "../../Styles/CallToAction.css";

const CallToAction = () => {
  return (
    <div className="cta-section text-center py-5">
      <h2>Ready to Make Your Grocery Shopping Easier?</h2>
      <p>Sign up today and get started with Dapurmate!</p>
      <a href="/login" className="btn btn-lg">
        Get Started
      </a>
    </div>
  );
};

export default CallToAction;
