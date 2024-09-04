import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import axios from "axios";

const ShoppingListPreview = () => {
  // State to hold the list of shopping items
  const [shoppingList, setShoppingList] = useState([]);

  // Fetch the shopping list data from the server on component mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/shoppinglist/")
      .then((result) => {
        console.log("Fetched shopping list:", result.data);
        // Update state with fetched shopping list
        setShoppingList(result.data);
      })
      .catch((err) =>
        console.error("Error fetching shopping list:", err.message)
      );
  }, []);

  // Function to toggle the completion status of an item
  const toggleComplete = async (id) => {
    try {
      // Find the item in the shopping list by its ID
      const item = shoppingList.find((item) => item._id === id);
      // Create an updated item object with toggled completion status
      const updatedItem = { ...item, completed: !item.completed };
      // Send a PUT request to update the item on the server
      const res = await axios.put(`http://localhost:5000/shoppinglist/${id}`, updatedItem);

      // Update the state with the updated item
      setShoppingList(shoppingList.map((item) => (item._id === id ? res.data : item)));
    } catch (err) {
      console.error("Error toggling completion:", err.message);
    }
  };

  return (
    <ListGroup as="ol" numbered className="shopping-list-preview">
      {shoppingList.length > 0 ? (
        // Display up to 10 items from the shopping list
        shoppingList.slice(0, 10).map((item, index) => (
          <ListGroup.Item
            as="li"
            key={item._id}
            className={item.completed ? "completed-item" : ""}
            onClick={() => toggleComplete(item._id)}
            style={{
              cursor: "pointer", // Change cursor to pointer on hover
              textDecoration: item.completed ? "line-through" : "none", // Strike-through for completed items
              borderBottom: "1px solid #ddd", // Line between items
            }}
          >
            {item.itemName} - {item.quantity} {item.unit}
          </ListGroup.Item>
        ))
      ) : (
        <p>❗No items in your shopping list.</p>
      )}
    </ListGroup>
  );
};

export default ShoppingListPreview;
