import { pool } from '../config/database.js'

const getUser = async(req, res) => {

    try {
        const uid = req.params.uid

        const getQuery = `
            SELECT * FROM users
            WHERE uid = $1
        `
        
        const results = await pool.query(getQuery, [uid])
        res.status(200).json(results.rows[0])

    } catch (err) {
        res.status(409).json({error: err.message})
    }
}

const signInUser = async(req, res) => {

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
  try {
    const uid = req.params.uid
    const {name, profilePicture, coins} = req.body

    const updateQuery = `
        UPDATE users
        SET 
            name = COALESCE($1, name), 
            profilePicture = COALESCE($2, profilePicture), 
            coins = COALESCE($3, coins)
        RETURNING *
    `

    const results = await pool.query(updateQuery, [name, profilePicture, coins])
    res.status(200).json(results.rows[0])

  } catch(err) {
    res.status(409).json({error: err.message})
  }
}

const deleteUser = async(req, res) => {
  try {
    const uid = req.params.uid

    const deleteQuery = `
        DELETE FROM users WHERE uid = $1
        RETURNING *
    `

    const results = await pool.query(deleteQuery, [uid])
    res.status(200).json(results.rows[0])

  } catch(err) {
    res.status(409).json({error: err.message})
  }
}

export default {
    getUser,
    signInUser,
    updateUser,
    deleteUser
}