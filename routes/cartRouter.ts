import { Router } from 'express'
import { authRequired } from '../middlewares/authMiddleware'
import * as controllers from '../controllers/cartController'
const router = Router()

router.get('/', authRequired, controllers.getCart)
router.post('/add', authRequired, controllers.addProduct)
router.delete('/delete/:id', authRequired, controllers.deleteProduct)
router.put('/update/:id', authRequired, controllers.updateProduct)

export default router