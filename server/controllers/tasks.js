import { pool } from '../config/database.js'

const getAllTasks = async(req, res) => {
    const { uid } = req.params
    const { completed } = req.query

    if (!uid) {
        return res.status(400).json({ error: 'Missing required user id' })
    }

    const values = [uid]
    let query = 'SELECT * FROM tasks WHERE userId = $1'

    if (completed === 'true' || completed === 'false') {
        values.push(completed === 'true')
        query += ' AND completed = $2'
    }

    query += ' ORDER BY createdAt DESC'

    try {
        const result = await pool.query(query, values)
        return res.status(200).json(result.rows)
    } catch (err) {
        console.error('Error fetching tasks:', err)
        return res.status(500).json({ error: 'Failed to fetch tasks' })
    }
}

const createTask = async(req, res) => {
    const { userId, title } = req.body

    if (!userId || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'userId and title are required' })
    }

    const query = `
        INSERT INTO tasks (userId, title, completed, completedAt)
        VALUES ($1, $2, FALSE, NULL)
        RETURNING *
    `

    try {
        const result = await pool.query(query, [userId, title.trim()])
        return res.status(201).json(result.rows[0])
    } catch (err) {
        console.error('Error creating task:', err)
        return res.status(500).json({ error: 'Failed to create task' })
    }
}

const updateTask = async(req, res) => {
    const { id } = req.params
    const { userId, title, completed } = req.body

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' })
    }

    if (title === undefined && completed === undefined) {
        return res.status(400).json({ error: 'At least one field to update is required' })
    }

    if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
        return res.status(400).json({ error: 'title must be a non-empty string' })
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
        return res.status(400).json({ error: 'completed must be a boolean' })
    }

    const fields = []
    const values = []

    if (title !== undefined) {
        fields.push(`title = $${values.length + 1}`)
        values.push(title.trim())
    }

    if (completed !== undefined) {
        fields.push(`completed = $${values.length + 1}`)
        values.push(completed)

        fields.push(`completedAt = $${values.length + 1}`)
        values.push(completed ? new Date().toISOString() : null)
    }

    values.push(id)
    values.push(userId)

    const query = `
        UPDATE tasks
        SET ${fields.join(', ')}
        WHERE id = $${values.length - 1} AND userId = $${values.length}
        RETURNING *
    `

    try {
        const result = await pool.query(query, values)

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' })
        }

        return res.status(200).json(result.rows[0])
    } catch (err) {
        console.error('Error updating task:', err)
        return res.status(500).json({ error: 'Failed to update task' })
    }
}

const deleteTask = async(req, res) => {
    const { id } = req.params
    const { userId } = req.body

    if (!userId) {
        return res.status(400).json({ error: 'userId is required' })
    }

    const query = 'DELETE FROM tasks WHERE id = $1 AND userId = $2 RETURNING *'

    try {
        const result = await pool.query(query, [id, userId])

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Task not found' })
        }

        return res.status(200).json({ success: true, deletedTask: result.rows[0] })
    } catch (err) {
        console.error('Error deleting task:', err)
        return res.status(500).json({ error: 'Failed to delete task' })
    }
}

export default {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
}