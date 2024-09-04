import React, { useState } from "react";
import axios from "axios";
import "../../Styles/PriceComparison.css"; // Importing the CSS file

function PriceComparison() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false); // State for loader
  const [magnifierEnabled, setMagnifierEnabled] = useState(false); // State for magnifier

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loader
    try {
      const response = await axios.post("http://localhost:5000/search", { query });
      setImages(response.data.images);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const handleMouseMove = (e, img) => {
    if (magnifierEnabled) {
      const magnifier = document.querySelector(".magnifierCP");
      const { top, left, width, height } = e.target.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const bgPosX = (x / width) * 100;
      const bgPosY = (y / height) * 100;

      magnifier.style.backgroundImage = `url(${img})`;
      magnifier.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
      magnifier.style.left = `${e.pageX + 5}px`; // Offset to position near the pointer
      magnifier.style.top = `${e.pageY + 5}px`;
      magnifier.style.display = "block";
    }
  };

  const handleMouseLeave = () => {
    const magnifier = document.querySelector(".magnifierCP");
    magnifier.style.display = "none";
  };

  return (
    <div className="containerCP">
      <button
        className="magnifier-toggleCP"
        onClick={() => setMagnifierEnabled(!magnifierEnabled)}
      >
        {magnifierEnabled ? "Disable Magnifier" : "Enable Magnifier"}
      </button>
      <h1 className="titleCP">Price Comparison</h1>
      <p className="quoteCP">“A penny saved is a penny earned.” – Benjamin Franklin</p>
      <form className="formCP" onSubmit={handleSubmit}>
        <input className="inputCP"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search query"
        />
        <button className="searchbtnCP" type= "submit">Search</button>
      </form>
      {loading ? (
        <div className="loaderCP"></div> // Loader animation
      ) : (
        <div className="image-gallery">
          {images.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:5000/images/${img}?t=${new Date().getTime()}`}
              alt={`Screenshot ${index + 1}`}
              onMouseMove={(e) => handleMouseMove(e, `http://localhost:5000/images/${img}?t=${new Date().getTime()}`)}
              onMouseLeave={handleMouseLeave}
              style={{ maxWidth: "30%", height: "auto" }}
            />
          ))}
        </div>
      )}
      <div className="magnifierCP"></div>
    </div>
  );
}

export default PriceComparison;
