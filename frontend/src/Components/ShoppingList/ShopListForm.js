import React, { useState } from 'react';

// Form component to add a new item to the shopping list
export const ShopListForm = ({ addItem }) => {
  // State hooks to manage the input values for item name, quantity, and unit
  const [itemName, setItemName] = useState(''); // Initializes state for item name with an empty string
  const [quantity, setQuantity] = useState(''); // Initializes state for quantity with an empty string
  const [unit, setUnit] = useState(''); // Initializes state for unit with an empty string

  // Handle form submission to add a new item
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the default form submission behavior (page reload)
    // Check if all fields are filled before adding the item
    if (itemName && quantity && unit) { // Ensures that all fields have values
      addItem(itemName, quantity, unit); // Calls the addItem function passed as a prop with the current values
      setItemName(''); // Resets the itemName field to an empty string after submission
      setQuantity(''); // Resets the quantity field to an empty string after submission
      setUnit(''); // Resets the unit field to an empty string after submission
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ShopListForm"> {/* The form element with an onSubmit event handler */}
      <input
        type="text" // Specifies that the input is a text field for the item name
        value={itemName} // Sets the value of the input to the current state of itemName
        onChange={(e) => setItemName(e.target.value)} // Updates itemName state with the input value when changed
        className="shopping-input" // Applies a CSS class for styling the input field
        placeholder="Enter an item" // Placeholder text displayed when the input is empty
      />
      <input
        type="number" // Specifies that the input is a number field for quantity
        value={quantity} // Sets the value of the input to the current state of quantity
        onChange={(e) => setQuantity(e.target.value)} // Updates quantity state with the input value when changed
        className="shopping-input quantity-input" // Applies CSS classes for styling, including a specific class for quantity input
        placeholder="Qty" // Placeholder text displayed when the input is empty
      />
      <select 
        value={unit} // Sets the value of the select element to the current state of unit
        onChange={(e) => setUnit(e.target.value)} // Updates unit state with the selected value when changed
        className="shopping-input unit-input" // Applies CSS classes for styling, including a specific class for unit selection
      >
        <option value="">Unit</option> {/* Default option displayed when no unit is selected */}
        <option value="units">unit</option> {/* Option for unit(s) */}
        <option value="g">g</option> {/* Option for grams */}
        <option value="kg">kg</option> {/* Option for kilograms */}
        <option value="ml">ml</option> {/* Option for milliliters */}
        <option value="l">l</option> {/* Option for liters */}
        <option value="piece">pieces</option> {/* Option for pieces */}
        <option value="pack">packs</option> {/* Option for packs */}
      </select>
      <button type="submit" className="shopping-btn"> {/* Submit button to submit the form */}
        Add Item {/* Button text */}
      </button>
    </form>
  );
};
