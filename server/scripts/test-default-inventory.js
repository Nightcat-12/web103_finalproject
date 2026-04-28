import '../config/dotenv.js'
import { pool } from '../config/database.js'
import { initializeDefaultInventory } from '../controllers/users.js'

const run = async () => {
  try {
    const testUid = `test_user_default_equip_${Date.now()}`
    console.log('Using test uid:', testUid)

    // Ensure user exists (inventory.userId references users.uid)
    const ensureUser = await pool.query(
      `INSERT INTO users (uid, name, profilePicture, coins, createdAt)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (uid) DO UPDATE SET name = EXCLUDED.name
       RETURNING *`,
      [testUid, 'Test User', null, 1000],
    )

    console.log('User ensured:', ensureUser.rows[0])

    // Initialize default inventory
    const equipped = await initializeDefaultInventory(testUid)
    console.log('initializeDefaultInventory result:', equipped)

    // Query inventory for the user
    const invRes = await pool.query(
      `SELECT s.id AS shopid, s.name, s.category, s.price, i.equipped
       FROM inventory i
       JOIN shop_items s ON i.shopItemId = s.id
       WHERE i.userId = $1
       ORDER BY s.category, s.price`,
      [testUid],
    )

    console.log('Inventory rows for user:', invRes.rows)
  } catch (err) {
    console.error('Test failed:', err)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

run()
