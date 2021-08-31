import { Router } from 'express'
import { authRequired } from '../middlewares/authMiddleware'
import * as controllers from '../controllers/categoryController'
const router = Router()

router.get('/', controllers.getCategories)
router.post('/create', authRequired, controllers.createCategory)
router.delete('/delete/:id', authRequired, controllers.deleteCategory)
router.put('/update', authRequired, controllers.updateCategory)


export default router