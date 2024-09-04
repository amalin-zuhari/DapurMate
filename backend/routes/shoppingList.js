// routes/shoppingList.js
const express = require('express');
const router = express.Router();

const {
  getShoppingItems,
  addShoppingItem,
  updateShoppingItem,
  deleteShoppingItem,
} = require('../controllers/shoppingListController');

router.get('/', getShoppingItems);
router.post('/', addShoppingItem);
router.put('/:id', updateShoppingItem);
router.delete('/:id', deleteShoppingItem);

module.exports = router;
