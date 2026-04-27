 import express from 'express'
 import rateLimit from 'express-rate-limit'
 import UsersController from '../controllers/users.js'
 import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js'
 const router = express.Router()
 const signInUserLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // limit each IP to 100 sign-in attempts per window
 })
const updateUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 update attempts per window
})
const deleteUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // limit each IP to 500 delete attempts per window
})
 // == Users ==
 router.get('/:uid', UsersController.getUser)
 router.post('/', (req, res, next) => {
   const traceId = req.traceId || req.get('x-trace-id') || 'missing-trace-id'
   console.log(`[UsersRoute:${traceId}] POST /api/users reached`)
   next()
 }, signInUserLimiter, UsersController.signInUser)
 router.patch('/:uid', updateUserLimiter, UsersController.updateUser)
router.delete('/:uid', deleteUserLimiter, verifyFirebaseToken, UsersController.deleteUser)
 export default router