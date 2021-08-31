import { Router } from 'express'
import * as controllers from '../controllers/orderController'
import { authRequired } from '../middlewares/authMiddleware'
const router = Router()

router.get('/', controllers.getOrders)
router.post('/create', authRequired, controllers.createOrder)
router.delete('/delete/:id', authRequired, controllers.deleteOrder)
router.put('/update/:id', authRequired, controllers.updateOrder)

export default router