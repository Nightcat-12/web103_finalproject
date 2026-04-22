import { pool } from '../config/database.js'

const getUser = async(req, res) => {

    console.log('getUser called')

    return res.json({
        status: "success"
    })
}

const createUser = async(req, res) => {

    try {
        const {uid, name, profilePicture} = req.body

        console.log('Request body: ', req.body)

        const postQuery = `
            INSERT INTO users (uid, name, profilePicture, coins, createdAt)
            VALUES ($1, $2, $3, 0, NOW())
            ON CONFLICT (uid) DO NOTHING
            RETURNING *
        `

        const results = await pool.query(postQuery, [uid, name, profilePicture])

        if (results.rows.length > 0) {
            return res.json({
                newUser: true,
                user: results.rows[0]
            })
        } else {
            const existingUser = await pool.query(
                `SELECT * FROM users WHERE uid=$1`,
                [uid]
            )

            return res.json({
                newUser: false,
                user: existingUser.rows[0]
            })
        }

    } catch (err) {
        res.status(409).json({error: err.message})
    }

}

const updateUser = async(req, res) => {
  
}

const deleteUser = async(req, res) => {
  
}

export default {
    getUser,
    createUser,
    updateUser,
    deleteUser
}