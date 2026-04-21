import express from 'express'
import UsersController from '../controllers/users'

const router = express.Router()

// == Users ==
router.get('/:uid', UsersController.getUser)
router.post('/', UsersController.createUser)
router.put('/:uid', UsersController.updateUser)
router.delete('/:uid', UsersController.deleteUser)

export default router