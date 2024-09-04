import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import ShoppingListPreview from "./ShoppingListPreview";
import InventoryPreview from "./InventoryPreview";
import RecipePreview from "./RecipePreview";
import Introduction from "./Introduction";
import "../../Styles/Dashboard.css";

const Dashboard = () => {
  // Inventory state
  const [allItems, setAllItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);

  const navigate = useNavigate();

  // Handle inventory data fetching
  const handleFetchComplete = (items) => {
    setAllItems(items);
    setLowStockItems(
      items.filter((item) => item.quantity < item.optimalStockLevel)
    );
    setExpiredItems(
      items.filter((item) => new Date(item.expirationDate) < new Date())
    );
  };

  return (
    <Container className="my-4">
      {/* Introduction Section */}
      <Row className="mb-4">
        <Col>
        <Introduction />
        </Col>
      </Row>

      {/* Inventory Section */}
      <Row className="mb-4">
        <Col md={12}>
          <h4 className="section-title">Inventory Overview</h4>
        </Col>
        <Col md={4}>
          <InventoryPreview onFetchComplete={handleFetchComplete} />
          <Card className="mb-4">
            <Card.Header
              className="card-header"
              data-bs-toggle="tooltip"
              title="View all items in your pantry."
            >
              Total Inventory
            </Card.Header>
            <Card.Body className="inventory-card totalinv">
              <p>{allItems.length} items</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header
              className="card-header"
              data-bs-toggle="tooltip"
              title="Track items that are running low in your pantry."
            >
              Low Stock Alerts
            </Card.Header>
            <Card.Body className="inventory-card danger">
              <p>{lowStockItems.length} items</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Header
              className="card-header"
              data-bs-toggle="tooltip"
              title="Stay informed about items that are expiring soon."
            >
              Expiration Alerts
            </Card.Header>
            <Card.Body className="inventory-card warning">
              <p>{expiredItems.length} items</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={12} className="text-center">
          <Button
            className="view-details-button"
            variant="primary"
            size="lg"
            onClick={() => navigate("/inventory")}
          >
            View Inventory Details
          </Button>
        </Col>
      </Row>

      {/* Shopping List Section */}
      <Row className="mb-4">
        <Col md={12}>
          <h4 className="section-title">Current Shopping List</h4>
        </Col>
        <Col md={8}>
          <Card className="mb-2">
            <Card.Header
              className="card-header"
              data-bs-toggle="tooltip"
              title="Keep track of what you need to buy."
            >
              Your Shopping List
            </Card.Header>
            <Card.Body>
              <ShoppingListPreview />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4 d-flex align-items-center justify-content-center">
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <Button
                variant="success"
                size="md"
                onClick={() => navigate("/shoppinglist")}
                className="mb-2 w-100"
              >
                Add Items to Shopping List
              </Button>
              <Button
                variant="success"
                size="md"
                onClick={() => navigate("/shoppinglist")}
                className="w-100"
              >
                Edit Shopping List
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recipe Section */}
      <Row className="mb-4">
        <Col md={12}>
          <h4 className="section-title">Recipe Quick Search</h4>
        </Col>
        <Col md={12}>
          <Card className="mb-4">
            <Card.Header
              className="text-center card-header"
              data-bs-toggle="tooltip"
              title="Search for recipes based on your ingredients."
            >
              Find Your Favorite Recipes
            </Card.Header>
            <Card.Body>
              <RecipePreview />
            </Card.Body>
            <Col md={12} className="text-center">
          <Button
            className="view-details-button "
            variant="primary"
            size="lg"
            onClick={() => navigate("/recipe")}
          >
            Show All Recipes
          </Button>
        </Col>
          </Card>
        </Col>
        
      </Row>

      {/* Price Comparison Section */}
      <Row className="mb-4">
        <Col md={12}>
          <h4 className="section-title">Price Comparison</h4>
        </Col>
        <Col md={12}>
          <Card className="text-center">
            <Card.Header
              className="text-center card-header"
              data-bs-toggle="tooltip"
              title="Find the best deals for your groceries across different stores."
            >
              Compare Prices
            </Card.Header>
            <Card.Body className="d-flex flex-column align-items-center justify-content-center">
              <p>
                Easily compare prices across different stores to ensure you get
                the best deals for your groceries. Save money and shop smart!
              </p>
              <Button
                variant="primary"
                className="mt-2"
                onClick={() => navigate("/price-comparison")}
              >
                Compare Prices
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
