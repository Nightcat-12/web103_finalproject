/**
 * Database initialization on startup
 * This module safely initializes the database without closing the pool,
 * allowing the server to continue operating normally.
 */

import { pool } from "./database.js";
import "./dotenv.js";
import { shopItems } from "../../client/src/data/shopItems.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Ensures shop_items table is populated with startup items.
 * This runs on server startup to guarantee items exist for new user initialization.
 */
export const ensureShopItemsSeeded = async () => {
	try {
		console.log("[Initialize] Checking if shop_items table is populated...");

		// Check if shop items already exist
		const checkRes = await pool.query("SELECT COUNT(*) as count FROM shop_items");
		const itemCount = parseInt(checkRes.rows[0]?.count || 0, 10);

		if (itemCount > 0) {
			console.log(`[Initialize] ✅ shop_items table already has ${itemCount} items`);
			return true;
		}

		console.log("[Initialize] shop_items table is empty, seeding starter items...");

		// Insert each shop item
		let inserted = 0;
		for (const item of shopItems) {
			try {
				await pool.query(
					`INSERT INTO shop_items (name, image, category, price) 
					 VALUES ($1, $2, $3, $4)
					 ON CONFLICT DO NOTHING`,
					[item.name, item.img, item.category, item.price]
				);
				inserted++;
			} catch (err) {
				console.warn(`[Initialize] Failed to insert ${item.name}:`, err.message);
			}
		}

		console.log(`[Initialize] ✅ Seeded ${inserted} shop items successfully`);
		return true;
	} catch (err) {
		console.error("[Initialize] ⚠️ Error checking/seeding shop_items:", err.message);
		return false;
	}
};

/**
 * Initialize database tables and data on server startup.
 * Returns true if successful, false otherwise.
 */
export const initializeDatabase = async () => {
	try {
		console.log("[Initialize] Starting database initialization...");

		// Ensure all tables exist
		const createTablesQueries = [
			{
				name: "users",
				query: `
					CREATE TABLE IF NOT EXISTS users (
						uid TEXT PRIMARY KEY,
						name TEXT NOT NULL,
						profilePicture TEXT,
						coins INTEGER NOT NULL DEFAULT 0 CHECK (coins >= 0),
						createdAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
					)
				`,
			},
			{
				name: "cats",
				query: `
					CREATE TABLE IF NOT EXISTS cats (
						id SERIAL PRIMARY KEY,
						userId TEXT NOT NULL UNIQUE REFERENCES users(uid) ON DELETE CASCADE,
						name TEXT NOT NULL,
						image TEXT,
						energy INTEGER NOT NULL DEFAULT 100 CHECK (energy >= 0)
					)
				`,
			},
			{
				name: "pomodoro_profiles",
				query: `
					CREATE TABLE IF NOT EXISTS pomodoro_profiles (
						id SERIAL PRIMARY KEY,
						userId TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
						name TEXT NOT NULL,
						timeOn INTEGER NOT NULL CHECK (timeOn > 0),
						timeBreak INTEGER NOT NULL CHECK (timeBreak > 0),
						timeLongBreak INTEGER NOT NULL CHECK (timeLongBreak > 0),
						isDefault BOOLEAN NOT NULL DEFAULT FALSE
					);
					CREATE UNIQUE INDEX IF NOT EXISTS one_default_profile_per_user
					ON pomodoro_profiles (userId)
					WHERE isDefault = TRUE
				`,
			},
			{
				name: "study_sessions",
				query: `
					CREATE TABLE IF NOT EXISTS study_sessions (
						id SERIAL PRIMARY KEY,
						userId TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
						profileId INTEGER REFERENCES pomodoro_profiles(id) ON DELETE SET NULL,
						startTime TIMESTAMPTZ NOT NULL,
						endTime TIMESTAMPTZ,
						coinsEarned INTEGER NOT NULL DEFAULT 0 CHECK (coinsEarned >= 0)
					)
				`,
			},
			{
				name: "shop_items",
				query: `
					CREATE TABLE IF NOT EXISTS shop_items (
						id SERIAL PRIMARY KEY,
						name TEXT NOT NULL,
						image TEXT,
						category TEXT NOT NULL,
						price INTEGER NOT NULL CHECK (price >= 0)
					)
				`,
			},
			{
				name: "inventory",
				query: `
					CREATE TABLE IF NOT EXISTS inventory (
						id SERIAL PRIMARY KEY,
						userId TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
						shopItemId INTEGER NOT NULL REFERENCES shop_items(id) ON DELETE CASCADE,
						quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 0),
						equipped BOOLEAN NOT NULL DEFAULT FALSE,
						acquiredAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
						UNIQUE (userId, shopItemId)
					)
				`,
			},
			{
				name: "tasks",
				query: `
					CREATE TABLE IF NOT EXISTS tasks (
						id SERIAL PRIMARY KEY,
						userId TEXT NOT NULL REFERENCES users(uid) ON DELETE CASCADE,
						title TEXT NOT NULL,
						completed BOOLEAN NOT NULL DEFAULT FALSE,
						createdAt TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
						completedAt TIMESTAMPTZ
					);
					CREATE INDEX IF NOT EXISTS idx_tasks_user_completed
					ON tasks (userId, completed);
					CREATE INDEX IF NOT EXISTS idx_tasks_created_at
					ON tasks (createdAt DESC)
				`,
			},
		];

		// Create all tables
		for (const tableConfig of createTablesQueries) {
			try {
				await pool.query(tableConfig.query);
				console.log(`[Initialize] ✅ Table '${tableConfig.name}' ready`);
			} catch (err) {
				console.warn(`[Initialize] ⚠️ Error creating '${tableConfig.name}' table:`, err.message);
				// Continue even if a table fails - it might already exist
			}
		}

		// Seed shop items if needed
		const shopItemsSeeded = await ensureShopItemsSeeded();

		if (!shopItemsSeeded) {
			console.warn("[Initialize] ⚠️ Failed to ensure shop items are seeded");
			return false;
		}

		console.log("[Initialize] ✅ Database initialization complete");
		return true;
	} catch (err) {
		console.error("[Initialize] ⚠️ Database initialization failed:", err.message);
		return false;
	}
};
