const ShoppingListModel = require('../models/ShoppingItem');

// Handler to get all shopping items
exports.getShoppingItems = async (req, res) => {
  try {
    // Fetch all items from the database
    const items = await ShoppingListModel.find();
    // Respond with the list of items in JSON format
    res.json(items);
  } catch (err) {
    // Handle errors and send a server error response
    res.status(500).send('Server Error');
  }
};

// Handler to add a new shopping item
exports.addShoppingItem = async (req, res) => {
  console.log('Adding item:', req.body); // Log the request body

  // Destructure fields from the request body with a default value for 'completed'
  const { itemName, quantity, unit, completed = false } = req.body;

  try {
    // Create a new shopping item instance
    const newItem = new ShoppingListModel({ itemName, quantity, unit, completed });
    // Save the new item to the database
    const item = await newItem.save();
    console.log('Item added:', item); // Log the added item
    // Respond with the added item in JSON format
    res.json(item);
  } catch (err) {
    // Handle errors and send a server error response
    console.error('Error adding item:', err.message); // Log the error message
    res.status(500).send('Server Error');
  }
};

// Handler to update an existing shopping item
exports.updateShoppingItem = async (req, res) => {
  // Destructure fields from the request body
  const { itemName, quantity, unit, completed } = req.body;

  try {
    // Find the item by ID
    let item = await ShoppingListModel.findById(req.params.id);

    // If item not found, respond with a 404 error
    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Update the item with new values
    item = await ShoppingListModel.findByIdAndUpdate(
      req.params.id,
      { itemName, quantity, unit, completed }, // Fields to update
      { new: true } // Return the updated item
    );

    // Respond with the updated item in JSON format
    res.json(item);
  } catch (err) {
    // Handle errors and send a server error response
    console.error('Error updating item:', err.message); // Log the error message
    res.status(500).send('Server Error');
  }
};

// Handler to delete a shopping item
exports.deleteShoppingItem = async (req, res) => {
  try {
    // Find the item by ID
    const item = await ShoppingListModel.findById(req.params.id);

    // If item not found, respond with a 404 error
    if (!item) return res.status(404).json({ msg: 'Item not found' });

    // Delete the item from the database
    await item.deleteOne(); // Use deleteOne method

    // Respond with a confirmation message and the deleted item
    res.json({ msg: 'Item removed', item });
  } catch (err) {
    // Handle errors and send a server error response
    console.error('Error deleting item:', err.message); // Log the error message
    res.status(500).send('Server Error');
  }
};
