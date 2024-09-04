const Recipe = require('../models/Recipe'); // Import the Recipe model from the models directory

// Create a new recipe
exports.createRecipe = async (req, res) => {
    try {
        const newRecipe = new Recipe(req.body); // Create a new Recipe instance with the data from the request body
        const savedRecipe = await newRecipe.save(); // Save the new recipe to the database
        res.status(201).json(savedRecipe); // Send a 201 Created status with the saved recipe as JSON
    } catch (error) {
        res.status(400).json({ message: error.message }); // If there's an error, send a 400 Bad Request status with the error message
    }
};

// Get all recipes
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find(); // Retrieve all recipes from the database
        res.status(200).json(recipes); // Send a 200 OK status with all the recipes as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // If there's an error, send a 500 Internal Server Error status with the error message
    }
};

// Get a single recipe by ID
exports.getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id); // Retrieve a recipe from the database by its ID
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' }); // If the recipe is not found, send a 404 Not Found status
        res.status(200).json(recipe); // Send a 200 OK status with the found recipe as JSON
    } catch (error) {
        res.status(500).json({ message: error.message }); // If there's an error, send a 500 Internal Server Error status with the error message
    }
};

// Update a recipe by ID
exports.updateRecipeById = async (req, res) => {
    try {
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true }); // Find the recipe by its ID and update it with the new data, returning the updated document
        if (!updatedRecipe) return res.status(404).json({ message: 'Recipe not found' }); // If the recipe is not found, send a 404 Not Found status
        res.status(200).json(updatedRecipe); // Send a 200 OK status with the updated recipe as JSON
    } catch (error) {
        res.status(400).json({ message: error.message }); // If there's an error, send a 400 Bad Request status with the error message
    }
};

// Delete a recipe by ID
exports.deleteRecipeById = async (req, res) => {
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(req.params.id); // Find the recipe by its ID and delete it from the database
        if (!deletedRecipe) return res.status(404).json({ message: 'Recipe not found' }); // If the recipe is not found, send a 404 Not Found status
        res.status(200).json({ message: 'Recipe deleted successfully' }); // Send a 200 OK status with a success message
    } catch (error) {
        res.status(500).json({ message: error.message }); // If there's an error, send a 500 Internal Server Error status with the error message
    }
};
