const mongoose = require('mongoose'); // Import mongoose to handle interactions with MongoDB

// Define the schema for the 'recipe' collection
const recipeSchema = new mongoose.Schema({
    title: { type: String, required: true }, // 'title' is a string and it's required
    imageUrl: { type: String, required: true }, // 'imageUrl' is a string and it's required, stores the URL of the recipe image
    cuisine: { type: String, required: true }, // 'cuisine' is a string and it's required, stores the type of cuisine (e.g., Italian, Chinese)
    category: { type: String, required: true }, // 'category' is a string and it's required, stores the category of the recipe (e.g., Main Course, Dessert)
    ingredients: { type: [String], required: true }, // 'ingredients' is an array of strings and it's required, stores the list of ingredients
    instructions: { type: String, required: true }, // 'instructions' is a string and it's required, stores the step-by-step cooking instructions
    servings: { type: Number, required: true }, // 'servings' is a number and it's required, stores the number of servings the recipe makes
    prepTime: { type: String, required: true }, // 'prepTime' is a string and it's required, stores the preparation time (e.g., "20 minutes")
    cookTime: { type: String, required: true }, // 'cookTime' is a string and it's required, stores the cooking time (e.g., "30 minutes")
    totalTime: { type: String, required: true }, // 'totalTime' is a string and it's required, stores the total time (prepTime + cookTime)
});

// Create a model called 'Recipe' based on the schema defined above
const Recipe = mongoose.model('recipe', recipeSchema, 'recipe');

// Export the 'Recipe' model so it can be used in other files
module.exports = Recipe;
