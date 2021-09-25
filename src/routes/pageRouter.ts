import { Router } from 'express'
import * as controllers from '../controllers/pageController'
import { adminRequired } from '../middlewares/authMiddleware'
const router = Router()

router.get('/', controllers.getPages)
router.get('/page/:slug', controllers.getPage)
router.post('/create', adminRequired, controllers.createPage)
router.put('/update/:id', adminRequired, controllers.updatePage)
router.delete('/delete/:id', adminRequired, controllers.deletePage)

export default router