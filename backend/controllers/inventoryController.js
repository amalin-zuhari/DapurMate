const Inventory = require("../models/inventory");
const moment = require("moment");

// Get all items
const getAllItems = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add new item
const addItem = async (req, res) => {
  try {
    console.log("Received Data:", req.body);

    // Parse the date as received in YYYY-MM-DD format
    const parsedDate = moment(req.body.expirationDate, "YYYY-MM-DD", true);

    if (!parsedDate.isValid()) {
      console.log("Invalid date format:", req.body.expirationDate);
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Ensure optimalStockLevel is a non-negative number
    if (req.body.optimalStockLevel < 0) {
      return res
        .status(400)
        .json({ message: "Optimal Stock Level cannot be negative." });
    }

    // Ensure unitOfMeasurement is provided
    if (!req.body.unitOfMeasurement) {
      return res
        .status(400)
        .json({ message: "Unit of Measurement is required." });
    }

    const newItem = new Inventory({
      ...req.body,
      expirationDate: parsedDate.toDate(), // Convert to Date object
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    console.error("Error saving item:", err.message); // Enhanced logging
    res
      .status(500)
      .json({ message: "Failed to save item.", error: err.message });
  }
};

// Edit item
const editItem = async (req, res) => {
  try {
    const parsedDate = moment(req.body.expirationDate, "YYYY-MM-DD", true);

    if (!parsedDate.isValid()) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    // Ensure optimalStockLevel is a non-negative number
    if (req.body.optimalStockLevel < 0) {
      return res
        .status(400)
        .json({ message: "Optimal Stock Level cannot be negative." });
    }

    // Ensure unitOfMeasurement is provided
    if (!req.body.unitOfMeasurement) {
      return res
        .status(400)
        .json({ message: "Unit of Measurement is required." });
    }

    const updatedItems = await Inventory.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        expirationDate: parsedDate.toDate(), // Ensure expirationDate is properly formatted
      },
      { new: true }
    );

    res.json(updatedItems);
  } catch (err) {
    console.error("Error updating item:", err.message); // Enhanced logging
    res
      .status(500)
      .json({ message: "Failed to update item.", error: err.message });
  }
};

// Delete Item
const deleteItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const checkLowStock = async () => {
  const lowStockItems = await Item.find({
    quantity: { $lt: 5 },
    lowStockAlert: false,
  });
  // Mark these items as alerted to avoid repetitive alerts
  await Item.updateMany(
    { _id: { $in: lowStockItems.map((item) => item._id) } },
    { lowStockAlert: true }
  );
  return lowStockItems;
};

const checkNearingExpiration = async () => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const nearingExpirationItems = await Item.find({
    expirationDate: { $lte: nextWeek, $gte: today },
    nearingExpirationAlert: false,
  });
  // Mark these items as alerted to avoid repetitive alerts
  await Item.updateMany(
    { _id: { $in: nearingExpirationItems.map((item) => item._id) } },
    { nearingExpirationAlert: true }
  );
  return nearingExpirationItems;
};

const checkExpiredItems = async () => {
  const today = new Date();

  const expiredItems = await Item.find({
    expirationDate: { $lt: today },
    expiredAlert: false,
  });
  // Mark these items as alerted to avoid repetitive alerts
  await Item.updateMany(
    { _id: { $in: expiredItems.map((item) => item._id) } },
    { expiredAlert: true }
  );
  return expiredItems;
};

module.exports = {
  getAllItems,
  addItem,
  editItem,
  deleteItem,
  checkLowStock,
  checkNearingExpiration,
  checkExpiredItems,
};
