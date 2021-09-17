import { Router } from 'express'
import { authRequired } from '../middlewares/authMiddleware'
import * as controllers from '../controllers/productController'
const router = Router()

router.post('/create', controllers.createProduct)
router.delete('/delete/:id', authRequired, controllers.deleteProduct)
router.put('/update/:id', authRequired, controllers.updateProduct)
router.get('/cat/:id', controllers.getProductByCategory)
router.get('/', controllers.getProducts)
router.get('/product/:slug', controllers.getProduct)

export default router