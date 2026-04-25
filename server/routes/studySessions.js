import express from 'express'
import rateLimit from 'express-rate-limit'
import SessionsController from '../controllers/studySessions.js'

const router = express.Router()

const studySessionsLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 200, // limit each IP to 200 study session requests per window
})

// == Study Sessions ==
router.get('/:uid', studySessionsLimiter, SessionsController.getAllSessionsFromUser)
router.post('/', studySessionsLimiter, SessionsController.addSession)

export default router