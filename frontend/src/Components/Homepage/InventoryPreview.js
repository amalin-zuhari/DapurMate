import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const InventoryPreview = ({ onFetchComplete }) => {
  const [allItems, setAllItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [expiredItems, setExpiredItems] = useState([]);

  const isLowStock = (quantity, optimalStockLevel) => {
    return quantity < optimalStockLevel;
  };

  const isExpired = (expirationDate) => {
    const now = new Date();
    return new Date(expirationDate) < now;
  };

  const fetchItems = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/inventory");
      const items = res.data;

      setAllItems(items);
      setLowStockItems(
        items.filter((item) =>
          isLowStock(item.quantity, item.optimalStockLevel)
        )
      );
      setExpiredItems(items.filter((item) => isExpired(item.expirationDate)));

      // Optionally, pass the data back to the parent component
      if (onFetchComplete) {
        onFetchComplete(items);
      }
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  }, [onFetchComplete]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div>
      {/* Render nothing or placeholders here, as this is only for data fetching */}
    </div>
  );
};

export default InventoryPreview;
