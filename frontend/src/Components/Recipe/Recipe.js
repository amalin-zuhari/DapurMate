import React, { useEffect, useState } from 'react';
// Importing React and necessary hooks: useState to manage component state, and useEffect to handle side effects.

import { useNavigate } from 'react-router-dom';
// Importing useNavigate from react-router-dom to programmatically navigate between routes.
import '../../Styles/Recipe.css';

const Recipe = () => {
    // Recipe component definition.

    const [recipes, setRecipes] = useState([]);
    // State to hold the list of recipes fetched from the backend.

    const [searchTerm, setSearchTerm] = useState('');
    // State to hold the current search term entered by the user.

    const [selectedCuisine, setSelectedCuisine] = useState('');
    // State to hold the currently selected cuisine filter.

    const [selectedCategory, setSelectedCategory] = useState('');
    // State to hold the currently selected category filter.

    const navigate = useNavigate();
    // useNavigate hook to navigate programmatically to different routes.

    useEffect(() => {
        fetch('http://localhost:5000/recipe')
            // Fetching the list of recipes from the backend API.

            .then((response) => response.json())
            // Converting the response to JSON format.

            .then((data) => setRecipes(data))
            // Setting the fetched recipes into the state.

            .catch((error) => console.error('Error fetching recipes:', error));
        // Logging any errors that occur during the fetch process.
    }, []);
    // Empty dependency array means this effect runs only once, when the component mounts.

    // Function to filter recipes based on search term, selected cuisine, selected category, and ingredients
    const filteredRecipes = recipes.filter((recipe) => {
        return (
            (recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                // Check if the recipe title matches the search term (case-insensitive).

                recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm.toLowerCase()))) &&
            // Check if any ingredient in the recipe matches the search term (case-insensitive).

            (selectedCuisine === '' || recipe.cuisine === selectedCuisine) &&
            // Check if the selected cuisine matches the recipe's cuisine or if no cuisine is selected.

            (selectedCategory === '' || recipe.category === selectedCategory)
            // Check if the selected category matches the recipe's category or if no category is selected.
        );
    });

    // Extracting unique cuisines and categories from the recipes for filtering options
    const cuisines = [...new Set(recipes.map(recipe => recipe.cuisine))];
    // Get unique cuisines from the list of recipes using Set to avoid duplicates.

    const categories = [...new Set(recipes.map(recipe => recipe.category))];
    // Get unique categories from the list of recipes using Set to avoid duplicates.

    // Function to handle clicking on a recipe, which navigates to the recipe's detail page
    const handleClick = (id) => {
        navigate(`/recipe/${id}`);
        // Navigate to the recipe detail page using the recipe's ID.
    };

    // Function to navigate to the page for adding a new recipe
    const handleAddRecipe = () => {
        navigate('/add-recipe');
        // Navigate to the Add Recipe page.
    };

    return (
        <div className="recipe-container">
            {/* Container div for the Recipe component with a class name */}

            <h1>Our Delicious Recipes</h1>
            {/* Header for the recipes page */}

            {/* Search, Filter, and Add Recipe Section */}
            <div className="filter-section">
                {/* Container for the search and filter inputs and the add recipe button */}

                <input
                    type="text"
                    placeholder="Search by title or ingredients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                // Input field for the search term. Updates the searchTerm state on change.
                />

                <select value={selectedCuisine} onChange={(e) => setSelectedCuisine(e.target.value)}>
                    <option value="">All Cuisines</option>
                    {/* Default option for selecting all cuisines */}
                    {cuisines.map((cuisine, index) => (
                        <option key={index} value={cuisine}>{cuisine}</option>
                        // Generating options for each unique cuisine.
                    ))}
                </select>
                {/* Dropdown for selecting a cuisine filter. Updates the selectedCuisine state on change. */}

                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    <option value="">All Categories</option>
                    {/* Default option for selecting all categories */}
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                        // Generating options for each unique category.
                    ))}
                </select>
                {/* Dropdown for selecting a category filter. Updates the selectedCategory state on change. */}

                <button className="add-recipe-btn" onClick={handleAddRecipe}>Add Recipe</button>
                {/* Button for navigating to the Add Recipe page */}
            </div>

            {/* Display filtered recipes or a "No recipes found" message */}
            {filteredRecipes.length > 0 ? (
                <div className="recipe-grid">
                    {/* Container for displaying the list of filtered recipes in a grid format */}
                    {filteredRecipes.map((recipe) => (
                        <div
                            key={recipe._id}
                            className="recipe-card"
                            onClick={() => handleClick(recipe._id)}
                            style={{ cursor: 'pointer' }}
                        // Individual recipe card. Navigates to the recipe's detail page when clicked.
                        >
                            <h2>{recipe.title}</h2>
                            {/* Displaying the title of the recipe */}

                            <img src={recipe.imageUrl} alt={recipe.title} className="recipe-image" />
                            {/* Displaying the image of the recipe */}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-recipes-found">
                    {/* Message displayed when no recipes match the search/filter criteria */}
                    <p>No recipes found. Try adjusting your search or filter criteria.</p>
                    <button className='add-recipe-btn' onClick={handleAddRecipe}>Add Your Own Recipe</button>
                    {/* Button for navigating to the Add Recipe page if no recipes are found */}
                </div>
            )}
        </div>
    );
};

export default Recipe;
// Exporting the Recipe component as the default export.
