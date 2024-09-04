import React, { useState } from 'react';

export const EditShopListForm = ({ editItem, item }) => {
  const [itemName, setItemName] = useState(item.itemName);
  const [quantity, setQuantity] = useState(item.quantity);
  const [unit, setUnit] = useState(item.unit);

  const handleSubmit = (e) => {
    e.preventDefault();
    editItem(itemName, quantity, unit, item._id); // Use _id instead of id
  };

  return (
    <form onSubmit={handleSubmit} className="ShopListForm">
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className="shopping-input"
        placeholder="Update item"
      />
      <input
        type="text"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="shopping-input quantity-input"
        placeholder="Quantity"
      />
      <select value={unit} onChange={(e) => setUnit(e.target.value)} className="shopping-input unit-input">
        <option value="kg">kg</option>
        <option value="pieces">pieces</option>
        <option value="unit">unit(s)</option>
      </select>
      <button type="submit" className="shopping-btn">
        Update Item
      </button>
    </form>
  );
};
