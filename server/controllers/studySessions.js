import { pool } from '../config/database.js'

const getAllSessionsFromUser = async(req, res) => {
    try {
        const uid = req.params.uid

        const sessionsQuery = `
            SELECT *
            FROM study_sessions
            WHERE userId = $1
            ORDER BY startTime DESC
        `

        const completedCountQuery = `
            SELECT COUNT(*)::int AS totalCompletedSessions
            FROM study_sessions
            WHERE userId = $1
              AND endTime IS NOT NULL
        `

        const [sessionsResult, completedCountResult] = await Promise.all([
            pool.query(sessionsQuery, [uid]),
            pool.query(completedCountQuery, [uid]),
        ])

        const totalCompletedSessions = completedCountResult.rows[0]?.totalcompletedsessions ?? 0

        if (req.query.summary === 'true') {
            return res.status(200).json({ totalCompletedSessions })
        }

        res.status(200).json({
            sessions: sessionsResult.rows,
            totalCompletedSessions,
        })
    } catch (err) {
        res.status(409).json({ error: err.message })
    }
}

const addSession = async(req, res) => {
    try {
        const {
            userId,
            profileId = null,
            startTime,
            endTime = null,
            coinsEarned = 0,
        } = req.body

        if (!userId || !startTime) {
            return res.status(400).json({ error: 'userId and startTime are required' })
        }

        const safeCoinsEarned = Number.isFinite(Number(coinsEarned))
            ? Math.max(0, Number(coinsEarned))
            : 0

        const createQuery = `
            INSERT INTO study_sessions (userId, profileId, startTime, endTime, coinsEarned)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `

        const sessionResults = await pool.query(createQuery, [
            userId,
            profileId,
            startTime,
            endTime,
            safeCoinsEarned,
        ])

        res.status(200).json(sessionResults.rows[0])
    } catch (err) {
        res.status(409).json({ error: err.message })
    }
}

export default {
    getAllSessionsFromUser,
    addSession
}