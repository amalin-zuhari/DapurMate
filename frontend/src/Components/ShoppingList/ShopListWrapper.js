import React, { useState, useEffect } from 'react';
import { ShoppingList } from './ShoppingList';
import { ShopListForm } from './ShopListForm';
import { EditShopListForm } from './EditShopListForm';
import axios from 'axios';
import '../../Styles/ShoppingList.css';

export const ShopListWrapper = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/shoppinglist/')
      .then(result => {
        console.log("Fetched items:", result.data); // Log fetched items
        setItems(result.data);
      })
      .catch(err => console.error('Error fetching items:', err.message));
  }, []);

  const addItem = async (itemName, quantity, unit) => {
    try {
      const res = await axios.post('http://localhost:5000/shoppinglist/', { itemName, quantity, unit });
      setItems([...items, res.data]);
    } catch (err) {
      console.error('Error adding item:', err.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/shoppinglist/${id}`);
      setItems(items.filter(item => item._id !== id)); // Filter out the deleted item
    } catch (err) {
      console.error('Error deleting item:', err.message);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const item = items.find((item) => item._id === id);
      const updatedItem = { ...item, completed: !item.completed };
      const res = await axios.put(`http://localhost:5000/shoppinglist/${id}`, updatedItem);

      // Update the state with the updated item
      setItems(items.map((item) => (item._id === id ? res.data : item)));
    } catch (err) {
      console.error('Error toggling completion:', err.message);
    }
  };

  const editItem = (id) => {
    setItems(items.map(item => item._id === id ? { ...item, isEditing: !item.isEditing } : item));
  };

  const editTask = async (itemName, quantity, unit, id) => {
    try {
      const res = await axios.put(`http://localhost:5000/shoppinglist/${id}`, { itemName, quantity, unit });
      setItems(items.map(item => item._id === id ? res.data : item));
    } catch (err) {
      console.error('Error editing item:', err.message);
    }
  };

  return (
    <div className="ShopListWrapper">
      <h1>Shopping List</h1>
      <ShopListForm addItem={addItem} />
      {items.map(item =>
        item.isEditing ? (
          <EditShopListForm editItem={editTask} item={item} key={item._id} />
        ) : (
          <ShoppingList
            key={item._id}
            item={item}
            deleteItem={deleteItem}
            editItem={editItem}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
