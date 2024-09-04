import React from "react";

import "../../Styles/Home.css";


function Home() {
  //call the user name
  
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Welcome to Dapurmate</h1>
        <h2>Your Smart Kitchen Companion</h2>
        <p>
          Effortlessly manage your kitchen with our smart tools. Track your
          grocery inventory, generate shopping lists, find recipes, and compare
          prices—all in one place.
        </p>
        <div className="hero-buttons">
          <a href="#about" className="btn btn-primary">
            Learn More
          </a>
        </div>
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

export default Home;
