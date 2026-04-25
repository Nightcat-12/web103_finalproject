 import express from 'express'
 import rateLimit from 'express-rate-limit'
 import UsersController from '../controllers/users.js'
 import verifyFirebaseToken from '../middleware/verifyFirebaseToken.js'
 const router = express.Router()
 const updateUserLimiter = rateLimit({
   windowMs: 15 * 60 * 1000, // 15 minutes
   max: 100, // limit each IP to 100 update attempts per window
 })
 // == Users ==
 router.get('/:uid', UsersController.getUser)
 router.post('/', (req, res, next) => {
   const traceId = req.traceId || req.get('x-trace-id') || 'missing-trace-id'
   console.log(`[UsersRoute:${traceId}] POST /api/users reached`)
   next()
 }, UsersController.signInUser)
 router.patch('/:uid', updateUserLimiter, UsersController.updateUser)
 router.delete('/:uid', verifyFirebaseToken, UsersController.deleteUser)
 export default router