// Importing required modules
const express = require('express'); // Import Express for routing
const router = express.Router(); // Create a new router instance

// Import controller functions to handle requests
const {
  getShoppingItems,     // Function to handle GET requests to fetch all shopping items
  addShoppingItem,      // Function to handle POST requests to add a new shopping item
  updateShoppingItem,   // Function to handle PUT requests to update an existing shopping item
  deleteShoppingItem,   // Function to handle DELETE requests to remove a shopping item
} = require('../controllers/shoppingListController');

// Define route to get all shopping items
router.get('/', getShoppingItems); // Handles GET requests to '/' and invokes the getShoppingItems function

// Define route to add a new shopping item
router.post('/', addShoppingItem); // Handles POST requests to '/' and invokes the addShoppingItem function

// Define route to update an existing shopping item by its ID
router.put('/:id', updateShoppingItem); // Handles PUT requests to '/:id' and invokes the updateShoppingItem function

// Define route to delete a shopping item by its ID
router.delete('/:id', deleteShoppingItem); // Handles DELETE requests to '/:id' and invokes the deleteShoppingItem function

// Export the router so it can be used in other parts of the application
module.exports = router;
