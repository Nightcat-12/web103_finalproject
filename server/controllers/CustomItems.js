import { pool } from '../config/database.js'

// GET all custom items
const getCustomItems = async (req, res) => {
  try {
    
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// GET a single custom item by ID
const getCustomItem = async (req, res) => {
  try {


      return res.status(404).json({ error: 'Custom item not found' })

    res.status(200).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// CREATE a new custom item
const createCustomItem = async (req, res) => {
  try {
    
      return res.status(400).json({ error: 'Please give your sneaker a name.' })
    
    // Check incompatible feature combos


    res.status(201).json(results.rows[0])
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// UPDATE an existing custom item
const updateCustomItem = async (req, res) => {
  try
      {return res.status(400).json({ error: 'Error message' })}

    // Check incompatible feature combos

   catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// DELETE a custom item
const deleteCustomItem = async (req, res) => {
  try {
    
      return res.status(404).json({ error: 'Custom item not found' })
    }
   catch (error) {
    res.status(409).json({ error: error.message })
  }
}

// Helper: check for incompatible feature combinations

export default {
  getCustomItems,
  getCustomItem,
  createCustomItem,
  updateCustomItem,
  deleteCustomItem
}