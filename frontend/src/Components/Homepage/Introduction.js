import React from "react";
import '../../Styles/Dashboard.css'


function Introduction() {

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="text-align-left">Welcome to <span className="dapurmate">DapurMate</span>!</h1>
        <h2>Your Smart Kitchen Companion</h2>
        <p>
          Effortlessly manage your kitchen with our smart tools. Track your
          grocery inventory, generate shopping lists, find recipes, and
          compare prices—all in one place.
        </p>
      </div>
      <div className="hero-image-container">
        <img
          src="/grocery-img.jpg"
          alt="Hero"
          className="hero-image animate-fade-in"
        />
      </div>
    </section>
  );
}

export default Introduction;
