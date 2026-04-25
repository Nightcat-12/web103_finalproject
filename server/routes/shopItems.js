import express from 'express'
import rateLimit from 'express-rate-limit'
import ShopItemsController from '../controllers/shopItems.js'

const router = express.Router()

const shopItemByIdLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

// == Shop Items ==
router.get('/', ShopItemsController.getAllShopItems)

router.get('/:shopItemId', shopItemByIdLimiter, ShopItemsController.getShopItemById)

export default router