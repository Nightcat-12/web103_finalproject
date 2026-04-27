import express from 'express'
import rateLimit from 'express-rate-limit'
import TasksController from '../controllers/tasks.js'

const router = express.Router()

const tasksLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
})

// == Tasks ==
router.get('/:uid', tasksLimiter, TasksController.getAllTasks)
router.post('/', tasksLimiter, TasksController.createTask)
router.patch('/:id', tasksLimiter, TasksController.updateTask)
router.delete('/:id', tasksLimiter, TasksController.deleteTask)

export default router
