import express from 'express'
import InventoryController from '../controllers/inventory.js'

const router = express.Router()

// == Inventories ==
router.get('/:uid', InventoryController.getInventoryByUser)
router.post('/:shop_id', InventoryController.addItemToInventory)
router.patch('/:id', InventoryController.updateItem)
router.delete('/:id', InventoryController.deleteItem)

export default router