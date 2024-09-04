import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

// InventoryPreview component for fetching and processing inventory data
const InventoryPreview = ({ onFetchComplete }) => {
  // State hooks to manage inventory data
  const [allItems, setAllItems] = useState([]); // Stores all fetched inventory items
  const [lowStockItems, setLowStockItems] = useState([]); // Stores items that are low in stock
  const [expiredItems, setExpiredItems] = useState([]); // Stores items that are expired

  // Function to check if an item is low in stock
  const isLowStock = (quantity, optimalStockLevel) => {
    return quantity < optimalStockLevel;
  };

  // Function to check if an item is expired
  const isExpired = (expirationDate) => {
    const now = new Date(); // Get the current date
    return new Date(expirationDate) < now; // Compare expiration date with the current date
  };

  // Function to fetch items from the server
  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/inventory"); // API call to fetch inventory items
      const items = res.data;

      // Update state with fetched items
      setAllItems(items);
      setLowStockItems(
        items.filter((item) =>
          isLowStock(item.quantity, item.optimalStockLevel) // Filter and store low stock items
        )
      );
      setExpiredItems(
        items.filter((item) => isExpired(item.expirationDate)) // Filter and store expired items
      );

      // Optionally, pass the data back to the parent component
      if (onFetchComplete) {
        onFetchComplete(items);
      }
    } catch (err) {
      console.error("Error fetching items:", err); // Log errors if the API call fails
    }
  }, [onFetchComplete]); // Dependencies to refetch items if onFetchComplete changes

  // useEffect hook to fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, [fetchItems]); // Dependencies to refetch items if fetchItems changes

  return (
    <div>
      {/* Render nothing or placeholders here, as this component is primarily for data fetching */}
    </div>
  );
};

export default InventoryPreview;
