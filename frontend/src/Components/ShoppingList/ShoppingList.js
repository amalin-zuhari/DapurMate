import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

export const ShoppingList = ({ item, deleteItem, editItem, toggleComplete }) => {
  return (
    <div className="ShoppingList">
      <div
        className={`${item.completed ? 'completed' : ''}`}
        onClick={() => toggleComplete(item._id)} // Use _id here
      >
        {item.itemName} - {item.quantity} {item.unit}
      </div>
      <div>
        <FontAwesomeIcon
          className="edit-icon"
          icon={faPenToSquare}
          onClick={() => editItem(item._id)} // Use _id here
        />
        <FontAwesomeIcon
          className="delete-icon"
          icon={faTrash}
          onClick={() => deleteItem(item._id)} // Use _id here
        />
      </div>
    </div>
  );
};
