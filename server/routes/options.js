import express from 'express'
import OptionsController from '../controllers/Options.js'

const router = express.Router()

// GET all options for each feature
router.get('/base-colors', OptionsController.getBaseColors)
router.get('/sole-types', OptionsController.getSoleTypes)
router.get('/lace-styles', OptionsController.getLaceStyles)
router.get('/accent-details', OptionsController.getAccentDetails)
router.get('/upper-materials', OptionsController.getUpperMaterials)

export default router