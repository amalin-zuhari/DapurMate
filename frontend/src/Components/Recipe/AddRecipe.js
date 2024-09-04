import React, { useState, useEffect } from 'react';
// Importing React and necessary hooks: useState to manage component state, and useEffect for side effects.

import { useNavigate } from 'react-router-dom';
// Importing useNavigate from react-router-dom to programmatically navigate to different routes.

import '../../Styles/AddRecipe.css';

const AddRecipe = () => {
    // Component function that defines the AddRecipe component

    // State hooks to manage the form fields and other data
    const [title, setTitle] = useState('');
    // State for the recipe title

    const [imageUrl, setImageUrl] = useState('');
    // State for the recipe image URL

    const [cuisine, setCuisine] = useState('');
    // State for the type of cuisine

    const [category, setCategory] = useState('');
    // State for the recipe category

    const [servings, setServings] = useState('');
    // State for the number of servings

    const [prepTime, setPrepTime] = useState('');
    // State for the preparation time

    const [cookTime, setCookTime] = useState('');
    // State for the cooking time

    const [totalTime, setTotalTime] = useState(0);
    // State for the total time, calculated as prepTime + cookTime

    const [ingredients, setIngredients] = useState(['']);
    // State for the ingredients, initialized as an array with one empty string

    const [instructions, setInstructions] = useState('');
    // State for the cooking instructions

    const navigate = useNavigate();
    // useNavigate hook for navigating to different routes

    useEffect(() => {
        setTotalTime(Number(prepTime) + Number(cookTime));
        // Update totalTime whenever prepTime or cookTime changes
    }, [prepTime, cookTime]);
    // useEffect dependency array to run the effect whenever prepTime or cookTime changes

    const handleIngredientChange = (index, value) => {
        const newIngredients = [...ingredients];
        // Copy the existing ingredients array

        newIngredients[index] = value;
        // Update the ingredient at the specified index with the new value

        setIngredients(newIngredients);
        // Update the ingredients state with the modified array
    };

    const handleAddIngredient = () => {
        setIngredients([...ingredients, '']);
        // Add a new empty string to the ingredients array to allow for a new ingredient input
    };

    const handleRemoveIngredient = (index) => {
        const newIngredients = [...ingredients];
        // Copy the existing ingredients array

        newIngredients.splice(index, 1);
        // Remove the ingredient at the specified index from the array

        setIngredients(newIngredients);
        // Update the ingredients state with the modified array
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prevent the default form submission behavior

        // Validation to ensure all fields are filled
        if (
            !title ||
            // Check if the title field is empty

            !imageUrl ||
            // Check if the image URL field is empty

            !cuisine ||
            // Check if the cuisine field is empty

            !category ||
            // Check if the category field is empty

            !servings ||
            // Check if the servings field is empty

            !prepTime ||
            // Check if the prepTime field is empty

            !cookTime ||
            // Check if the cookTime field is empty

            !instructions ||
            // Check if the instructions field is empty

            ingredients.some(ingredient => ingredient.trim() === '')
            // Check if any ingredient in the ingredients array is empty
        ) {
            alert('Please fill in all fields and ensure ingredients are not empty.');
            // Alert the user if any required field is empty

            return;
            // Exit the function to prevent the form from being submitted
        }

        const newRecipe = {
            title,
            imageUrl,
            cuisine,
            category,
            servings,
            prepTime,
            cookTime,
            totalTime,
            ingredients: ingredients.filter(ingredient => ingredient.trim() !== ''),
            // Filter out any empty ingredients from the array

            instructions,
        };
        // Create a new recipe object with the form data

        console.log('Data to be sent:', newRecipe);
        // Log the recipe data to the console for debugging

        fetch('http://localhost:5000/api/recipe', {
            method: 'POST',
            // Specify the HTTP method as POST

            headers: {
                'Content-Type': 'application/json',
                // Set the Content-Type header to JSON
            },
            body: JSON.stringify(newRecipe),
            // Convert the newRecipe object to a JSON string and set it as the request body
        })
            .then(response => response.json())
            // Parse the JSON response from the server

            .then(data => {
                console.log('Recipe added:', data);
                // Log the response data to the console for debugging

                navigate(`/recipe/${data._id}`);
                // Navigate to the newly created recipe's detail page
            })
            .catch((error) => console.error('Error adding recipe:', error));
        // Log any errors that occur during the fetch operation
    };

    // Options for the cuisine dropdown menu
    const cuisineOptions = [
        "Italian", "Indian", "Russian", "American", "Thai",
        "Italian-American", "Japanese", "Mexican", "French",
        "Middle Eastern", "Chinese", "Malaysia"
    ];

    // Options for the category dropdown menu
    const categoryOptions = [
        "Main Course", "Breakfast", "Salad", "Soup", "Dip",
        "Dessert", "Appetizer", "Beverage", "Side Dish"
    ];

    return (
        <div className="add-recipe">
            {/* Component wrapper div with a class name */}
            <h1>Add Your Own Recipe</h1>
            {/* Page title */}

            <form onSubmit={handleSubmit}>
                {/* Form element that calls handleSubmit on submission */}

                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                {/* Input field for the recipe title */}

                <input
                    type="text"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                />
                {/* Input field for the recipe image URL */}

                <select
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    required
                >
                    <option value="">Select Cuisine</option>
                    {cuisineOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                {/* Dropdown menu for selecting the cuisine */}

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                >
                    <option value="">Select Category</option>
                    {categoryOptions.map((option, index) => (
                        <option key={index} value={option}>{option}</option>
                    ))}
                </select>
                {/* Dropdown menu for selecting the recipe category */}

                <input
                    type="number"
                    placeholder="Servings"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                    required
                />
                {/* Input field for the number of servings */}

                <input
                    type="number"
                    placeholder="Prep Time (minutes)"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    required
                />
                {/* Input field for the preparation time */}

                <input
                    type="number"
                    placeholder="Cook Time (minutes)"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                    required
                />
                {/* Input field for the cooking time */}

                <input
                    type="number"
                    placeholder="Total Time (minutes)"
                    value={totalTime}
                    readOnly
                    required
                />
                {/* Input field for the total time, read-only as it is auto-calculated */}

                <label>Ingredients:</label>
                {/* Label for the ingredients section */}

                {ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-input">
                        <input
                            type="text"
                            placeholder={`Ingredient ${index + 1}`}
                            value={ingredient}
                            onChange={(e) => handleIngredientChange(index, e.target.value)}
                            required
                        />
                        <button type="button" onClick={() => handleRemoveIngredient(index)}>Remove</button>
                    </div>
                ))}
                {/* Dynamically generated input fields for ingredients with remove buttons */}

                <button type="button" onClick={handleAddIngredient}>Add Ingredient</button>
                {/* Button to add a new ingredient input field */}

                <textarea
                    placeholder="Instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    required
                ></textarea>
                {/* Textarea for the cooking instructions */}

                <button type="submit">Add Recipe</button>
                {/* Submit button to add the recipe */}
            </form>
        </div>
    );
};

export default AddRecipe;
// Exporting the AddRecipe component as the default export
