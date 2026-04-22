import express from 'express'
import UsersController from '../controllers/users.js'

const router = express.Router()

// == Users ==
router.get('/:uid', UsersController.getUser)
router.post('/', UsersController.signInUser)
router.patch('/:uid', UsersController.updateUser)
router.delete('/:uid', UsersController.deleteUser)

export default router

