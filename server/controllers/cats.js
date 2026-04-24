import { pool } from "../config/database.js";

const getCatByUser = async (req, res) => {
	try {
		const uid = req.params.uid;

		const getQuery = `
      SELECT * FROM cats WHERE userId=$1
    `;

		const results = await pool.query(getQuery, [uid]);
		res.status(200).json(results.rows);
	} catch (err) {
		res.status(409).json({ error: err.message });
	}
};

const createCat = async (req, res) => {
	try {
		const { userId, name, image } = req.body;

		const createQuery = `
      INSERT INTO cats (userId, name, image, energy)
      VALUES($1, $2, $3, 100)
      RETURNING *
    `;

		const results = await pool.query(createQuery, [userId, name, image]);
		res.status(200).json(results.rows[0]);
	} catch (err) {
		res.status(409).json({ error: err.message });
	}
};

const updateCat = async (req, res) => {
	try {
		const uid = req.params.uid;
		const { name, image, energy } = req.body;

		const updateQuery = `
      UPDATE cats
      SET
        name = COALESCE($1, name),
        image = COALESCE($2, image),
        energy = COALESCE($3, energy)
      WHERE userId = $4
      RETURNING *
    `;

		const results = await pool.query(updateQuery, [name, image, energy, uid]);
		res.status(200).json(results.rows[0]);
	} catch (err) {
		res.status(409).json({ error: err.message });
	}
};

const deleteCat = async (req, res) => {
	try {
		const uid = req.params.uid;

		const deleteQuery = `
      DELETE FROM cats
      WHERE userId = $1
      RETURNING *
    `;

		const results = await pool.query(deleteQuery, [uid]);
		res.status(200).json(results.rows[0]);
	} catch (err) {
		res.status(409).json({ error: err.message });
	}
};

export default {
	getCatByUser,
	createCat,
	updateCat,
	deleteCat,
};
