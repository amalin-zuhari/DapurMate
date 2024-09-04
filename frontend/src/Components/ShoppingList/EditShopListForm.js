import React, { useState } from 'react';

// Form component to edit an existing shopping list item
export const EditShopListForm = ({ editItem, item }) => {
  // State hooks to manage the input values for item name, quantity, and unit
  const [itemName, setItemName] = useState(item.itemName); // Initializes state for item name with the current value from props
  const [quantity, setQuantity] = useState(item.quantity); // Initializes state for quantity with the current value from props
  const [unit, setUnit] = useState(item.unit); // Initializes state for unit with the current value from props

  // Handle form submission to update the item details
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior (page reload)
    editItem(itemName, quantity, unit, item._id); // Calls the editItem function passed as a prop with the updated item details and the item's ID
  };

  return (
    <form onSubmit={handleSubmit} className="ShopListForm"> {/* The form element with an onSubmit event handler */}
      <input
        type="text" // Specifies that the input is a text field
        value={itemName} // Sets the value of the input to the current state of itemName
        onChange={(e) => setItemName(e.target.value)} // Updates itemName state when the input value changes
        className="shopping-input" // Applies a CSS class for styling
        placeholder="Update item" // Placeholder text for the input field
      />
      <input
        type="text" // Specifies that the input is a text field
        value={quantity} // Sets the value of the input to the current state of quantity
        onChange={(e) => setQuantity(e.target.value)} // Updates quantity state when the input value changes
        className="shopping-input quantity-input" // Applies CSS classes for styling, including a specific class for quantity input
        placeholder="Quantity" // Placeholder text for the input field
      />
      <select
        value={unit} // Sets the value of the select element to the current state of unit
        onChange={(e) => setUnit(e.target.value)} // Updates unit state when the selected value changes
        className="shopping-input unit-input" // Applies CSS classes for styling, including a specific class for unit selection
      >
        <option value="kg">kg</option> {/* Option for kilogram */}
        <option value="pieces">pieces</option> {/* Option for pieces */}
        <option value="unit">unit(s)</option> {/* Option for unit(s) */}
      </select>
      <button type="submit" className="shopping-btn"> {/* Submit button to submit the form */}
        Update Item {/* Button text */}
      </button>
    </form>
  );
};
