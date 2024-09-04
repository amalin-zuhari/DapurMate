import React from 'react'; // Import React
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon component for icons
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons'; // Import specific icons for editing and deleting

// Component to render an individual shopping list item
export const ShoppingList = ({ item, deleteItem, editItem, toggleComplete }) => {
  return (
    <div className="ShoppingList"> {/* Container for individual shopping list item */}
      <div
        className={`${item.completed ? 'completed' : ''}`} // Apply 'completed' class if the item is marked as completed
        onClick={() => toggleComplete(item._id)} // Toggles the completion status of the item when clicked
      >
        {item.itemName} - {item.quantity} {item.unit} {/* Display item details */}
      </div> 
      <div>
        {/* FontAwesome icon for editing the item */}
        <FontAwesomeIcon
          className="edit-icon" // CSS class for styling the edit icon
          icon={faPenToSquare} // Set the icon to 'faPenToSquare'
          onClick={() => editItem(item._id)} // Calls editItem function with item ID to switch to edit mode
        />
        {/* FontAwesome icon for deleting the item */}
        <FontAwesomeIcon
          className="delete-icon" // CSS class for styling the delete icon
          icon={faTrash} // Set the icon to 'faTrash'
          onClick={() => deleteItem(item._id)} // Calls deleteItem function with item ID to remove the item
        />
      </div>
    </div>
  );
};
