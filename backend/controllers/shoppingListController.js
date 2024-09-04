const ShoppingListModel = require('../models/ShoppingItem');

exports.getShoppingItems = async (req, res) => {
  try {
    const items = await ShoppingListModel.find();
    res.json(items);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.addShoppingItem = async (req, res) => {
  console.log('Adding item:', req.body);
  const { itemName, quantity, unit, completed = false } = req.body; // Add completed field

  try {
    const newItem = new ShoppingListModel({ itemName, quantity, unit, completed });
    const item = await newItem.save();
    console.log('Item added:', item);
    res.json(item);
  } catch (err) {
    console.error('Error adding item:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateShoppingItem = async (req, res) => {
  const { itemName, quantity, unit, completed } = req.body; // Add completed field

  try {
    let item = await ShoppingListModel.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    item = await ShoppingListModel.findByIdAndUpdate(
      req.params.id,
      { itemName, quantity, unit, completed }, // Update completed field
      { new: true }
    );

    res.json(item);
  } catch (err) {
    console.error('Error updating item:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteShoppingItem = async (req, res) => {
  try {
    const item = await ShoppingListModel.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: 'Item not found' });

    await item.deleteOne(); // Use deleteOne instead of remove

    res.json({ msg: 'Item removed', item });
  } catch (err) {
    console.error('Error deleting item:', err.message);
    res.status(500).send('Server Error');
  }
};
