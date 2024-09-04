import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Container, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const RecipePreview = () => {
  // State to hold the list of recipes fetched from the API
  const [recipes, setRecipes] = useState([]);
  // State to manage the search input value
  const [searchTerm, setSearchTerm] = useState("");
  // State to manage the selected cuisine filter
  const [selectedCuisine, setSelectedCuisine] = useState("");
  // State to manage the selected category filter
  const [selectedCategory, setSelectedCategory] = useState("");
  // Hook to navigate programmatically
  const navigate = useNavigate();

  // Fetch recipes from the API on component mount
  useEffect(() => {
    fetch("http://localhost:5000/api/recipe")
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  // Filter recipes based on search term, selected cuisine, and selected category
  const filteredRecipes = recipes
    .filter((recipe) => {
      return (
        // Check if the recipe title or ingredients match the search term
        (recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchTerm.toLowerCase())
          )) &&
        // Check if the selected cuisine matches the recipe's cuisine or if no cuisine is selected
        (selectedCuisine === "" || recipe.cuisine === selectedCuisine) &&
        // Check if the selected category matches the recipe's category or if no category is selected
        (selectedCategory === "" || recipe.category === selectedCategory)
      );
    })
    .slice(0, 3); // Limit the results to 3 recipes

  // Get unique cuisines from the list of recipes for filter options
  const cuisines = [...new Set(recipes.map((recipe) => recipe.cuisine))];
  // Get unique categories from the list of recipes for filter options
  const categories = [...new Set(recipes.map((recipe) => recipe.category))];

  // Function to handle clicking on a recipe card
  const handleClick = (id) => {
    navigate(`/recipe/${id}`);
  };

  // Function to navigate to the "Add Recipe" page
  const handleAddRecipe = () => {
    navigate("/add-recipe");
  };

  return (
    <Container className="mt-4">
      {/* Search and Filter Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search by title or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={selectedCuisine}
            onChange={(e) => setSelectedCuisine(e.target.value)}
          >
            <option value="">All Cuisines</option>
            {cuisines.map((cuisine, index) => (
              <option key={index} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* Display filtered recipes or a "No recipes found" message */}
      {filteredRecipes.length > 0 ? (
        <Row>
          {filteredRecipes.map((recipe) => (
            <Col key={recipe._id} md={4} className="mb-4">
              <Card
                onClick={() => handleClick(recipe._id)}
                style={{ cursor: "pointer" }}
                className="recipe-card"
              >
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Body>
                  <Card.Img
                    variant="top"
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="recipe-image"
                  />
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center">
          <p>No recipes found. Try adjusting your search or filter criteria.</p>
          <Button onClick={handleAddRecipe}>Add Your Own Recipe</Button>
        </div>
      )}
    </Container>
  );
};

export default RecipePreview;
