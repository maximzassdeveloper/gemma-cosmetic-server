import { Router } from 'express'
import { adminRequired } from '../middlewares/authMiddleware'
import * as controllers from '../controllers/categoryController'
const router = Router()

router.get('/', controllers.getCategories)
router.post('/create', adminRequired, controllers.createCategory)
router.delete('/delete/:id', adminRequired, controllers.deleteCategory)
router.put('/update/:id', adminRequired, controllers.updateCategory)


export default router