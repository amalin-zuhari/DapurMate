import React from "react";
import Slider from "react-slick";
import "../../Styles/Testimonials.css";
import "slick-carousel/slick/slick.css"; // Import Slick CSS
import "slick-carousel/slick/slick-theme.css"; // Import Slick Theme CSS

const Testimonials = () => {
  const settings = {
    dots: true, // Display navigation dots
    infinite: true, // Loop through the slides
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one testimonial at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Autoplay interval
  };

  return (
    <div className="container mt-5 mb-5" id="testimonials">
      <div className="row">
        <div className="col-md-12 text-center mb-4">
          <h3 className="lead">What Our Users Say</h3>
        </div>
      </div>
      <Slider {...settings}>
        <div className="testimonial-card">
          <p>
            "Dapurmate has revolutionized the way I manage my kitchen! It's so
            easy to use and keeps me organized."
          </p>
          <h5>- Jane Doe</h5>
        </div>
        <div className="testimonial-card">
          <p>
            "I love how it suggests recipes based on what's already in my
            pantry. It's a game changer!"
          </p>
          <h5>- John Smith</h5>
        </div>
        <div className="testimonial-card">
          <p>
            "The price comparison feature has saved me so much money. Highly
            recommend it!"
          </p>
          <h5>- Sarah Lee</h5>
        </div>
      </Slider>
    </div>
  );
};

export default Testimonials;
