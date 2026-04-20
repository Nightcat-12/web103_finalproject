import express from 'express'
import CustomItemsController from '../controllers/CustomItems.js'
 
const router = express.Router()
 
// GET all custom items
router.get('/', CustomItemsController.getCustomItems)
 
// GET a single custom item by ID
router.get('/:id', CustomItemsController.getCustomItem)
 
// CREATE a new custom item
router.post('/', CustomItemsController.createCustomItem)
 
// UPDATE an existing custom item
router.patch('/:id', CustomItemsController.updateCustomItem)
 
// DELETE a custom item
router.delete('/:id', CustomItemsController.deleteCustomItem)
 
export default router