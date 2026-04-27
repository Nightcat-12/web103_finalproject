import express, { Router } from 'express'
import ProfilesController from '../controllers/pomodoroProfiles.js'

const router = express.Router()

// == Pomodoro Profiles ==

router.get('/:uid', ProfilesController.getAllProfiles)
router.post('/', ProfilesController.addProfile)
router.patch('/:id', ProfilesController.updateProfile)
router.delete('/:id', ProfilesController.deleteProfile)

export default router