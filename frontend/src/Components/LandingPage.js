import React from "react";
import Header from "./LandingPage/Header";
import Home from "./LandingPage/Home";
import About from "./LandingPage/About";
import Features from "./LandingPage/Features";
import Testimonials from "./LandingPage/Testimonials";
import HowItWorks from "./LandingPage/HowItWorks";
import CTA from "./LandingPage/CallToAction";
import Footer from "./LandingPage/Footer";

function LandingPage() {
  return (
    <div>
      <Header />
      <Home />
      <About />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
