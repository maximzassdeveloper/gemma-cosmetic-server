import { Router } from 'express'
import { authRequired } from '../middlewares/authMiddleware'
import * as controllers from '../controllers/categoryController'
const router = Router()

router.get('/', controllers.getCategories)
router.post('/create', authRequired, controllers.addCategory)
router.delete('/delete', authRequired, controllers.deleteCategory)
// router.put('/update', authRequired)


export default router