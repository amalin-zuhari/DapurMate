import React, { useEffect, useState } from 'react';
// Importing React and necessary hooks: useState to manage component state, and useEffect to handle side effects.

import { useParams, useNavigate } from 'react-router-dom';
// Importing useParams to access route parameters, and useNavigate to programmatically navigate between routes.

import { FaArrowLeft } from 'react-icons/fa';
// Importing the left arrow icon from the react-icons library. Ensure that react-icons is installed.

import '../../Styles/RecipeDetail.css';


const RecipeDetail = () => {
    // RecipeDetail component definition

    const { id } = useParams();
    // Extracting the recipe ID from the URL parameters using useParams.

    const navigate = useNavigate();
    // useNavigate hook to navigate programmatically to different routes.

    const [recipe, setRecipe] = useState(null);
    // State to hold the recipe data fetched from the backend. Initially set to null.

    useEffect(() => {
        // useEffect hook to fetch the recipe data when the component mounts or when the ID changes.

        fetch(`http://localhost:5000/api/recipe/${id}`)
            // Fetching the specific recipe data from the backend API using the recipe ID.

            .then((response) => response.json())
            // Converting the response to JSON format.

            .then((data) => setRecipe(data))
            // Setting the fetched recipe data into the state.

            .catch((error) => console.error('Error fetching recipe:', error));
        // Logging any errors that occur during the fetch process.
    }, [id]);
    // The effect runs whenever the recipe ID (from the URL) changes.

    if (!recipe) return <div>Loading...</div>;
    // If the recipe data has not yet been fetched, display a loading message.

    return (
        <div className="recipe-detail">
            {/* Container div for the RecipeDetail component with a class name */}

            <button className="back-button" onClick={() => navigate('/recipe')}>
                <FaArrowLeft /> Back
            </button>
            {/* Back button that navigates back to the homepage. Uses an icon from react-icons. */}

            <h1>{recipe.title}</h1>
            {/* Displaying the title of the recipe */}

            <img src={recipe.imageUrl} alt={recipe.title} />
            {/* Displaying the image of the recipe */}

            <p><strong>Cuisine:</strong> {recipe.cuisine}</p>
            {/* Displaying the cuisine type of the recipe */}

            <p><strong>Category:</strong> {recipe.category}</p>
            {/* Displaying the category of the recipe */}

            <p><strong>Servings:</strong> {recipe.servings}</p>
            {/* Displaying the number of servings the recipe makes */}

            <p><strong>Prep Time:</strong> {recipe.prepTime}</p>
            {/* Displaying the preparation time for the recipe */}

            <p><strong>Cook Time:</strong> {recipe.cookTime}</p>
            {/* Displaying the cooking time for the recipe */}

            <p><strong>Total Time:</strong> {recipe.totalTime}</p>
            {/* Displaying the total time (prep time + cook time) for the recipe */}

            <p><strong>Ingredients:</strong> {recipe.ingredients.join(', ')}</p>
            {/* Displaying the list of ingredients, joined into a single string */}

            <p><strong>Instructions:</strong> {recipe.instructions}</p>
            {/* Displaying the cooking instructions for the recipe */}
        </div>
    );
};

export default RecipeDetail;
// Exporting the RecipeDetail component as the default export.
