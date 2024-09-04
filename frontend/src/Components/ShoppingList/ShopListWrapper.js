import React, { useState, useEffect } from 'react'; // Import React and necessary hooks
import { ShoppingList } from './ShoppingList'; // Import ShoppingList component for displaying items
import { ShopListForm } from './ShopListForm'; // Import ShopListForm component for adding new items
import { EditShopListForm } from './EditShopListForm'; // Import EditShopListForm component for editing items
import axios from 'axios'; // Import axios for making HTTP requests
import '../../Styles/ShoppingList.css'; // Import CSS for styling

// Main component to manage and display the shopping list
export const ShopListWrapper = () => {
  // State hook to store the list of items
  const [items, setItems] = useState([]); // Initializes state with an empty array for storing shopping list items

  // useEffect hook to fetch the shopping list items from the server when the component mounts
  useEffect(() => {
    axios.get('http://localhost:5000/shoppinglist/') // Makes a GET request to fetch items
      .then(result => {
        console.log("Fetched items:", result.data); // Log fetched items for debugging
        setItems(result.data); // Update the state with the fetched items
      })
      .catch(err => console.error('Error fetching items:', err.message)); // Log errors if fetching fails
  }, []); // Empty dependency array means this effect runs once when the component mounts

  // Function to add a new item to the shopping list
  const addItem = async (itemName, quantity, unit) => {
    try {
      const res = await axios.post('http://localhost:5000/shoppinglist/', { itemName, quantity, unit }); // POST request to add a new item
      setItems([...items, res.data]); // Add the newly created item to the state
    } catch (err) {
      console.error('Error adding item:', err.message); // Log errors if adding fails
    }
  };

  // Function to delete an item from the shopping list
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/shoppinglist/${id}`); // DELETE request to remove the item
      setItems(items.filter(item => item._id !== id)); // Remove the deleted item from the state
    } catch (err) {
      console.error('Error deleting item:', err.message); // Log errors if deletion fails
    }
  };

  // Function to toggle the completion status of an item
  const toggleComplete = async (id) => {
    try {
      const item = items.find((item) => item._id === id); // Find the item by ID
      const updatedItem = { ...item, completed: !item.completed }; // Toggle the completed status
      const res = await axios.put(`http://localhost:5000/shoppinglist/${id}`, updatedItem); // PUT request to update the item

      // Update the state with the updated item
      setItems(items.map((item) => (item._id === id ? res.data : item)));
    } catch (err) {
      console.error('Error toggling completion:', err.message); // Log errors if toggling fails
    }
  };

  // Function to toggle the editing mode for an item
  const editItem = (id) => {
    setItems(items.map(item => item._id === id ? { ...item, isEditing: !item.isEditing } : item)); // Toggle the isEditing flag
  };

  // Function to edit the details of an existing item
  const editTask = async (itemName, quantity, unit, id) => {
    try {
      const res = await axios.put(`http://localhost:5000/shoppinglist/${id}`, { itemName, quantity, unit }); // PUT request to update the item details
      setItems(items.map(item => item._id === id ? res.data : item)); // Update the state with the edited item
    } catch (err) {
      console.error('Error editing item:', err.message); // Log errors if editing fails
    }
  };

  return (
    <div className="ShopListWrapper"> {/* Container for the shopping list components */}
      <h1 className="h1-sl">Shopping List</h1> {/* Header for the shopping list */}
      <ShopListForm addItem={addItem} /> {/* Form to add a new item */}
      {items.map(item =>
        item.isEditing ? (
          <EditShopListForm editItem={editTask} item={item} key={item._id} /> // Form to edit an existing item if isEditing is true
        ) : (
          <ShoppingList
            key={item._id}
            item={item} // Pass the item object as a prop
            deleteItem={deleteItem} // Pass the deleteItem function as a prop
            editItem={editItem} // Pass the editItem function as a prop
            toggleComplete={toggleComplete} // Pass the toggleComplete function as a prop
          /> // Display the shopping list item if isEditing is false
        )
      )}
    </div>
  );
};
