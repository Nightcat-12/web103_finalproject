import express from 'express'
import ShopItemsController from '../controllers/shopItems.js'

const router = express.Router()

// == Shop Items ==
router.get('/', ShopItemsController.getAllShopItems)

router.get('/:shopItemId', ShopItemsController.getShopItemById)

export default router