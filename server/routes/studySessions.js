import express from 'express'
import SessionsController from '../controllers/studySessions.js'

const router = express.Router()

// == Study Sessions ==
router.get('/:uid', SessionsController.getAllSessionsFromUser)
router.post('/', SessionsController.addSession)

export default router