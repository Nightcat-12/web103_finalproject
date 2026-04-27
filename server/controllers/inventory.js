import { pool } from "../config/database.js";

// GET /api/inventory/:uid
// Returns all inventory rows for a given user, joined with shop_items so the
// client gets the item's name, image, category, and price in one trip.


const getInventoryByUser = async (req, res) => {
	try {
		const uid = req.params.uid;

		const getQuery = `
			SELECT
				i.id            AS id,
				i.userId        AS userid,
				i.shopItemId    AS shopitemid,
				i.quantity      AS quantity,
				i.equipped      AS equipped,
				i.acquiredAt    AS acquiredat,
				s.name          AS name,
				s.image         AS image,
				s.category      AS category,
				s.price         AS price
			FROM inventory i
			JOIN shop_items s ON s.id = i.shopItemId
			WHERE i.userId = $1
			ORDER BY i.acquiredAt DESC
		`;

		const results = await pool.query(getQuery, [uid]);
		res.status(200).json(results.rows);
	} catch (err) {
		res.status(409).json({ error: err.message });
	}
};

// POST /api/inventory/:shop_id
// Adds an item to a user's inventory. The user's uid comes from the request
// body (along with an optional starting quantity). Because the inventory
// table has a UNIQUE (userId, shopItemId) constraint, we upsert: if the user
// already owns this item, bump the quantity instead of failing.
const addItemToInventory = async (req, res) => {
	try {
		const shopItemId = req.params.shop_id;
		const { userId, quantity = 1 } = req.body;

		if (!userId) {
			return res.status(400).json({ error: "userId is required" });
		}

		const insertQuery = `
			INSERT INTO inventory (userId, shopItemId, quantity)
			VALUES ($1, $2, $3)
			ON CONFLICT (userId, shopItemId)
			DO UPDATE SET quantity = inventory.quantity + EXCLUDED.quantity
			RETURNING *
		`;

		const results = await pool.query(insertQuery, [
			userId,
			shopItemId,
			quantity,
		]);
		res.status(200).json(results.rows[0]);
	} catch (err) {
		res.status(409).json({ error: err.message });
	}
};

// PATCH /api/inventory/:id
// Updates a single inventory row. Accepts any subset of { quantity, equipped }
// and uses COALESCE so unspecified fields keep their existing value.
const updateItem = async (req, res) => {
	try {
		const id = req.params.id;
		const { quantity, equipped } = req.body;

		const updateQuery = `
			UPDATE inventory
			SET
				quantity = COALESCE($1, quantity),
				equipped = COALESCE($2, equipped)
			WHERE id = $3
			RETURNING *
		`;

		const results = await pool.query(updateQuery, [quantity, equipped, id]);

		if (results.rows.length === 0) {
			return res.status(404).json({ error: "Inventory item not found" });
		}

		res.status(200).json(results.rows[0]);
	} catch (err) {
		res.status(409).json({ error: err.message });
	}
};

// DELETE /api/inventory/:id
// Removes a single inventory row by its id.
const deleteItem = async (req, res) => {
	try {
		const id = req.params.id;

		const deleteQuery = `
			DELETE FROM inventory
			WHERE id = $1
			RETURNING *
		`;

		const results = await pool.query(deleteQuery, [id]);

		if (results.rows.length === 0) {
			return res.status(404).json({ error: "Inventory item not found" });
		}

		res.status(200).json(results.rows[0]);
	} catch (err) {
		res.status(409).json({ error: err.message });
	}
};

export default {
	getInventoryByUser,
	addItemToInventory,
	updateItem,
	deleteItem,
};