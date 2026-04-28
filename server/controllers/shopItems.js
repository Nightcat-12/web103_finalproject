import { pool } from '../config/database.js'

const getAllShopItems = async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM shop_items ORDER BY id ASC')
        res.status(200).json(result.rows)
    }catch(error) {
        res.status(409).json( { error: error.message } )
    }

}

const getShopItemById = async (req, res) => {
    try {
        const selectQuery = `SELECT id, name, category, price, image FROM shop_items WHERE id = $1`
        const shopItemId = req.params.shopItemId

        const result = await pool.query(selectQuery, [shopItemId])
        res.status(200).json(result.rows[0])

    } catch(err) {
        res.status(409).json( { error: err.message} )
    }
}

export default {
    getAllShopItems,
    getShopItemById
}