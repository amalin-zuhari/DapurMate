const express = require('express'); // Import express to create a router instance
const router = express.Router(); // Create a new router object to handle routes
const recipeController = require('../controllers/recipeController'); // Import the recipe controller that contains the logic for handling requests

// Route to create a new recipe
router.post('/', recipeController.createRecipe);
// POST request to the root URL ('/') to create a new recipe using the createRecipe function from the controller

// Route to get all recipes
router.get('/', recipeController.getAllRecipes);
// GET request to the root URL ('/') to retrieve all recipes using the getAllRecipes function from the controller

// Route to get a specific recipe by ID
router.get('/:id', recipeController.getRecipeById);
// GET request to '/:id' (where ':id' is a placeholder for a recipe's ID) to retrieve a specific recipe using the getRecipeById function from the controller

// Route to update a recipe by ID
router.put('/:id', recipeController.updateRecipeById);
// PUT request to '/:id' (where ':id' is a placeholder for a recipe's ID) to update a specific recipe using the updateRecipeById function from the controller

// Route to delete a recipe by ID
router.delete('/:id', recipeController.deleteRecipeById);
// DELETE request to '/:id' (where ':id' is a placeholder for a recipe's ID) to delete a specific recipe using the deleteRecipeById function from the controller

module.exports = router; // Export the router object so it can be used in the main application
