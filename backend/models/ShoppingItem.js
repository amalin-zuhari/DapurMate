const mongoose = require('mongoose');

// Define a schema
const ShoppingListSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: String, required: true },
  unit: { type: String, required: true },
  completed: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false },
});

// Compile model from schema
// Export the model for use in other parts of the application
module.exports = mongoose.model('ShoppingList', ShoppingListSchema, 'shoppinglist');
