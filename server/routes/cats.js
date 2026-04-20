import express from 'express'
import CatsController from '../controllers/cats.js'

const router = express.Router()

// == Cats ==
router.get('/:uid', CatsController.getCatByUser)
router.post('/', CatsController.createCat)
router.patch('/:uid', CatsController.updateCat)
router.delete('/:uid', CatsController.deleteCat)

export default router