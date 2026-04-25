import { pool } from '../config/database.js'
import { getFirebaseAdminAuth } from '../config/firebaseAdmin.js'

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
        const traceId = req.traceId || req.get('x-trace-id') || 'missing-trace-id'

        console.log(`[UsersController:${traceId}] signInUser payload received`, {
            uid,
            hasName: Boolean(name),
            hasProfilePicture: Boolean(profilePicture),
        })

        if (!uid) {
            console.error(`[UsersController:${traceId}] Missing uid in request body`)
            return res.status(400).json({ error: 'uid is required' })
        }

        const postQuery = `
            INSERT INTO users (uid, name, profilePicture, coins, createdAt)
            VALUES ($1, $2, $3, 0, NOW())
            ON CONFLICT (uid) DO NOTHING
            RETURNING *
        `

        console.log(`[UsersController:${traceId}] Attempting users insert for uid ${uid}`)
        const results = await pool.query(postQuery, [uid, name, profilePicture])
        console.log(`[UsersController:${traceId}] Insert result`, {
            insertedRowCount: results.rows.length,
        })

        if (results.rows.length > 0) {
            console.log(`[UsersController:${traceId}] New user seeded`, {
                uid: results.rows[0].uid,
            })
            return res.json({
                newUser: true,
                user: results.rows[0]
            })
        } else {
            console.log(`[UsersController:${traceId}] User already exists, selecting existing row`, { uid })
            const existingUser = await pool.query(
                `SELECT * FROM users WHERE uid=$1`,
                [uid]
            )

            console.log(`[UsersController:${traceId}] Existing user query result`, {
                rowCount: existingUser.rows.length,
            })

            return res.json({
                newUser: false,
                user: existingUser.rows[0]
            })
        }

    } catch (err) {
        const traceId = req.traceId || req.get('x-trace-id') || 'missing-trace-id'
        console.error(`[UsersController:${traceId}] signInUser failed`, {
            message: err.message,
        })
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

        if (!req.authUid || req.authUid !== uid) {
            return res.status(403).json({ error: 'Forbidden: cannot delete another user' })
        }

        const adminAuth = getFirebaseAdminAuth()

        try {
            await adminAuth.deleteUser(uid)
        } catch (err) {
            if (err.code !== 'auth/user-not-found') {
                throw err
            }
        }

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