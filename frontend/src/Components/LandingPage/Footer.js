import React from "react";
import "../../Styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>About Dapurmate</h5>
            <p>
              Your go-to app for efficient grocery management and meal planning.
            </p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/how-it-works">How It Works</a>
              </li>
              <li>
                <a href="/features">Features</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/">
                  <i className="fab fa-facebook"></i> Facebook
                </a>
              </li>
              <li>
                <a href="/">
                  <i className="fab fa-twitter"></i> Twitter
                </a>
              </li>
              <li>
                <a href="/">
                  <i className="fab fa-instagram"></i> Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
