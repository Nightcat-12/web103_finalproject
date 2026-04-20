import { pool } from '../config/database.js'

// GET all custom items
const getCustomItems = async (req, res) => {
  try {
    const results = await pool.query('SELECT * FROM custom_items ORDER BY created_at DESC')
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// GET a single custom item by ID
const getCustomItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const results = await pool.query('SELECT * FROM custom_items WHERE id = $1', [id])

    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Custom item not found' })
    }

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// CREATE a new custom item
const createCustomItem = async (req, res) => {
  try {
    const { name,  } = req.body

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Please give your sneaker a name.' })
    }

    // Check incompatible feature combos
    const incompatError = checkIncompatible()
    if (incompatError) {
      return res.status(400).json({ error: incompatError })
    }

    const results = await pool.query(
      `INSERT INTO custom_items ()
       VALUES ()
       RETURNING *`,
      [name.trim(), ]
    )

    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// UPDATE an existing custom item
const updateCustomItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const {  } = req.body

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Please give your sneaker a name.' })
    }

    // Check incompatible feature combos
    const incompatError = checkIncompatible(base_color, sole_type, lace_style, accent_detail, upper_material)
    if (incompatError) {
      return res.status(400).json({ error: incompatError })
    }

    const results = await pool.query(
      `UPDATE custom_items
       SET name = $1, base_color = $2, sole_type = $3, lace_style = $4,
           accent_detail = $5, upper_material = $6, total_price = $7
       WHERE id = $8
       RETURNING *`,
      [name.trim(), base_color, sole_type, lace_style, accent_detail, upper_material, total_price, id]
    )

    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Custom item not found' })
    }

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// DELETE a custom item
const deleteCustomItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const results = await pool.query('DELETE FROM custom_items WHERE id = $1 RETURNING *', [id])

    if (results.rows.length === 0) {
      return res.status(404).json({ error: 'Custom item not found' })
    }

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// Helper: check for incompatible feature combinations
function checkIncompatible(base_color, sole_type, lace_style, accent_detail, upper_material) {
  if (upper_material === 'suede' && sole_type === 'air') {
    return 'Suede uppers are not compatible with Air Cushion soles — the adhesive won\'t bond properly.'
  }
  if (lace_style === 'nolace' && upper_material === 'mesh') {
    return 'Laceless design requires a structured upper — Mesh is too flexible.'
  }
  if (accent_detail === 'neon' && base_color === 'white') {
    return 'Neon Glow accents are not available on Arctic White — the glow effect needs a darker base.'
  }
  if (upper_material === 'leather' && accent_detail === 'neon') {
    return 'Neon Glow accents cannot be applied to Premium Leather.'
  }
  return null
}

export default {
  getCustomItems,
  getCustomItem,
  createCustomItem,
  updateCustomItem,
  deleteCustomItem
}