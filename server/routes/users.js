 import express from 'express'
 import rateLimit from 'express-rate-limit'
 import UsersController from '../controllers/users.js'
 const router = express.Router()
 const updateUserLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // limit each IP to 100 update attempts per window
 })
 // == Users ==
 router.get('/:uid', UsersController.getUser)
 router.post('/', UsersController.signInUser)
 router.patch('/:uid', UsersController.updateUser)
 router.patch('/:uid', updateUserLimiter, UsersController.updateUser)
 router.delete('/:uid', UsersController.deleteUser)
 export default router