import { pool } from '../config/database.js'

const getBaseColors = async (req, res) => {
  try {
    
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getSoleTypes = async (req, res) => {
  try {
    
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getLaceStyles = async (req, res) => {
  try {
    
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getAccentDetails = async (req, res) => {
  try {
    
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

const getUpperMaterials = async (req, res) => {
  try {
    
    res.status(200).json(results.rows)
  } catch (error) {
    res.status(409).json({ error: error.message })
  }
}

export default {
  getBaseColors,
  getSoleTypes,
  getLaceStyles,
  getAccentDetails,
  getUpperMaterials
}