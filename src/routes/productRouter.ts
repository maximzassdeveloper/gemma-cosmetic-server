import { Router } from 'express'
import { adminRequired } from '../middlewares/authMiddleware'
import * as controllers from '../controllers/productController'
const router = Router()

router.post('/create', adminRequired, controllers.createProduct)
router.delete('/delete/:id', adminRequired, controllers.deleteProduct)
router.put('/update/:id', adminRequired, controllers.updateProduct)
router.get('/cat/:id', controllers.getProductByCategory)
router.get('/', controllers.getProducts)
router.get('/product/:slug', controllers.getProduct)

export default router