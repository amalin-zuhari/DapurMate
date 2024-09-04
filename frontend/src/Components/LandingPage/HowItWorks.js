import React from "react";
import "../../Styles/HowItWorks.css";

const HowItWorks = () => {
  return (
    <div className="container mt-5 mb-5" id="how-it-works">
      <div className="row">
        <div className="col-md-12 text-center mb-4">
          <h3 className="lead">How It Works</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-md-4 text-center">
          <img src="/step1.png" alt="Step 1" className="step-icon" />
          <h4>Step 1</h4>
          <p>Register and create an account to get started.</p>
        </div>
        <div className="col-md-4 text-center">
          <img src="/step2.png" alt="Step 2" className="step-icon" />
          <h4>Step 2</h4>
          <p>Add your groceries and track your inventory.</p>
        </div>
        <div className="col-md-4 text-center">
          <img src="/step3.png" alt="Step 3" className="step-icon" />
          <h4>Step 3</h4>
          <p>Generate shopping lists and enjoy stress-free shopping.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
