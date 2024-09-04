import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Container, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const RecipePreview = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/recipe")
      .then((response) => response.json())
      .then((data) => setRecipes(data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  // Filter recipes based on search term, selected cuisine, selected category, and ingredients
  const filteredRecipes = recipes
    .filter((recipe) => {
      return (
        (recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(searchTerm.toLowerCase())
          )) &&
        (selectedCuisine === "" || recipe.cuisine === selectedCuisine) &&
        (selectedCategory === "" || recipe.category === selectedCategory)
      );
    })
    .slice(0, 3); // Limit to 3 recipes

  // Get unique cuisines and categories for filtering
  const cuisines = [...new Set(recipes.map((recipe) => recipe.cuisine))];
  const categories = [...new Set(recipes.map((recipe) => recipe.category))];

  const handleClick = (id) => {
    navigate(`/recipe/${id}`);
  };

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
