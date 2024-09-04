const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitOfMeasurement: { type: String, required: true },
  optimalStockLevel: { type: Number, required: true }, // New field for user-defined optimal stock level
  expirationDate: { type: Date, required: true },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Inventory", inventorySchema);
