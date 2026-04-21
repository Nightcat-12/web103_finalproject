import express from 'express'
import TasksController from '../controllers/tasks.js'

const router = express.Router()

// == Tasks ==
router.get('/:uid', TasksController.getAllTasks)
router.post('/', TasksController.get)

export default router