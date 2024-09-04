import React, { useState } from 'react';

export const ShopListForm = ({ addItem }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (itemName && quantity && unit) {
      addItem(itemName, quantity, unit);
      setItemName('');
      setQuantity('');
      setUnit('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="ShopListForm">
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className="shopping-input"
        placeholder="Enter an item"
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="shopping-input quantity-input"
        placeholder="Qty"
      />
      <select value={unit} onChange={(e) => setUnit(e.target.value)} className="shopping-input unit-input">
        <option value="">Unit</option>
        <option value="unit">unit(s)</option>
        <option value="g">g</option>
        <option value="kg">kg</option>
        <option value="piece">pieces</option>
        <option value="pack">packs</option>
      </select>
      <button type="submit" className="shopping-btn">
        Add Item
      </button>
    </form>
  );
};
