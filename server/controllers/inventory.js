import { pool } from "../config/database.js";

const getInventoryByUser = async (req, res) => {
	// This one might be tricky. We want to join the inventory and shop_items tables here and return that.
	// For each item, we need its name, image, and category from the shop_items table as well
	/*
    SELECT
  i.id AS inventoryId,
  i.userId,
  i.shopItemId,
  i.quantity,
  i.equipped,
  i.acquiredAt,
  s.name,
  s.image,
  s.category,
  s.price
FROM INVENTORY i
JOIN SHOP_ITEMS s ON s.id = i.shopItemId
WHERE i.userId = ?;
  */
};

const addItemToInventory = async (req, res) => {};

const updateItem = async (req, res) => {};

const deleteItem = async (req, res) => {};

export default {
	getInventoryByUser,
  addItemToInventory,
  updateItem,
  deleteItem
};
