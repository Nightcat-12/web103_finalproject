import express from 'express'
import TasksController from '../controllers/tasks.js'

const router = express.Router()

// == Tasks ==
router.get('/:uid', TasksController.getAllTasksFromUser)
router.post('/', TasksController.createTask)
router.patch('/:id', TasksController.updateTask)
router.delete('/:id', TasksController.deleteTask)

export default router