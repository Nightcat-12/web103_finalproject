import express from 'express'
import rateLimit from 'express-rate-limit'
import InventoryController from '../controllers/inventory.js'

const router = express.Router()

// rate limiters for inventory operations
const getInventoryLimiter = rateLimit({
    windowMs: 15 * 60 * 100, // 15 minutes
    max: 300, // a limit of 300 reads for each API
})

const addItemLimiter = rateLimit({
    windowMs: 15 * 60 * 100, // 15 minutes
    max: 100, // a limit of 100 reads for each API
})

const updateItemLimiter = rateLimit({
    windowMs: 15 * 60 * 100, // 15 minutes
    max: 150, // a limit of 150 reads for each API
})

const deleteItemLimiter = rateLimit({
    windowMs: 15 * 60 * 100, // 15 minutes
    max: 50, // a limit of 50 reads for each API
})


// == Inventories ==
router.get('/:uid', getInventoryLimiter, InventoryController.getInventoryByUser)
router.post('/:shop_id', addItemLimiter, InventoryController.addItemToInventory)
router.patch('/:id', updateItemLimiter, InventoryController.updateItem)
router.delete('/:id', deleteItemLimiter, InventoryController.deleteItem)

export default router