import React from "react";
import { Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "../../Styles/Header.css";

const Header = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary custom-navbar">
      <Container>
        <Navbar.Brand to="/" className="navbar-brand d-flex align-items-center">
          <img
            src="/dapurmateLogo.png"
            alt="Dapurmate Logo"
            width="40" // Adjust the size as needed
            height="40" // Adjust the size as needed
            className="d-inline-block align-top"
          />
          <span className="ms-3">Dapurmate</span>{" "}
          {/* Added a class for margin */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link href="#about">About</Nav.Link>
            <Nav.Link href="#how-it-works">How It Works</Nav.Link>
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#testimonials">Testimonial</Nav.Link>
            <Button
              as={Link}
              to="/login"
              className="ms-3 signup-button"
              variant="success" // Use Bootstrap variant to make it green
            >
              Sign Up
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
