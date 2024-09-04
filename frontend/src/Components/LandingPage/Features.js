import React from "react";
import "../../Styles/Features.css";

function Features() {
  return (
    <div className="container" id="features">
      <div className="row mt-5">
        <div className="col-md-12 text-center mb-4">
          <h3 className="lead">Our Features</h3>
        </div>
      </div>
      <div className="row justify-content-center mb-4">
        {/* Card 1: Inventory Tracking */}
        <div className="col-md-3">
          <div className="card mb-4">
            <img
              className="card-img-top"
              src="/inventory.png"
              alt="Inventory Tracking"
            />
            <div className="card-body">
              <p className="card-text pb-4">
                Keep an organized list of all your groceries. Set quantities,
                expiration dates, and categories for each item. Get notified
                when items are low in stock or nearing expiration.
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: Shopping List Generation */}
        <div className="col-md-3">
          <div className="card mb-4">
            <img
              className="card-img-top"
              src="shopping.png"
              alt="Shopping List Generation"
            />
            <div className="card-body">
              <p className="card-text pb-4">
                Automatically create a shopping list based on missing
                ingredients for your favorite recipes. Add items manually for
                custom needs.
              </p>
            </div>
          </div>
        </div>

        {/* Card 3: Recipe Database */}
        <div className="col-md-3">
          <div className="card mb-4">
            <img
              className="card-img-top"
              src="recipe.png"
              alt="Recipe Database"
            />
            <div className="card-body">
              <p className="card-text pb-4">
                Explore a vast database of recipes tailored to your inventory.
                Filter recipes based on available ingredients and find new
                cooking ideas.
              </p>
            </div>
          </div>
        </div>

        {/* Card 5: Price Comparison */}
        <div className="col-md-3">
          <div className="card mb-4">
            <img
              className="card-img-top"
              src="price-tracker.jpg"
              alt="Price Comparison"
            />
            <div className="card-body">
              <p className="card-text pb-4">
                Compare prices across multiple stores to ensure you always get
                the best deal. Save money while ensuring your pantry is stocked
                with quality ingredients.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Features;
