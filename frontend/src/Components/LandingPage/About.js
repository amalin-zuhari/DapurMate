import React from "react";
import "../../Styles/About.css";

function About() {
  return (
    <section id="about" className="about">
      <div className="about-container">
        <div className="about-image-container">
          <img
            src="/about-grocery.jpg"
            alt="About Dapurmate"
            className="about-image"
          />
        </div>
        <div className="about-content">
          <h2>About Dapurmate</h2>
          <p>
            At Dapurmate, we aim to simplify your kitchen management. Whether
            you're a busy professional, a home chef, or just someone who loves
            to cook, our platform helps you keep track of your groceries, plan
            meals, and save money. Our smart tools are designed to reduce food
            waste and make your cooking experience more enjoyable.
          </p>
          <p>Discover a new way to manage your kitchen today!</p>
        </div>
      </div>
    </section>
  );
}

export default About;
