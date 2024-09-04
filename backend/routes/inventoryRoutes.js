const express = require("express");
const router = express.Router();
const {
  getAllItems,
  addItem,
  editItem,
  deleteItem,
  checkLowStock,
  checkNearingExpiration,
  checkExpiredItems,
} = require("../controllers/inventoryController");

// Define routes and use controller functions
router.get("/", getAllItems);
router.post("/", addItem);
router.put("/:id", editItem);
router.delete("/:id", deleteItem);
router.get("/notifications", async (req, res) => {
  try {
    const lowStockItems = await checkLowStock();
    const nearingExpirationItems = await checkNearingExpiration();
    const expiredItems = await checkExpiredItems();

    res.json({
      lowStockItems,
      nearingExpirationItems,
      expiredItems,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
