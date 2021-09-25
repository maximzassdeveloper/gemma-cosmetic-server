import { Router } from 'express'
import { adminRequired } from '../middlewares/authMiddleware'
import * as controllers from '../controllers/commentController'
const router = Router()

router.get('/', controllers.getComments)
router.post('/create', adminRequired, controllers.createComment)
router.put('/update/:id', adminRequired, controllers.updateComment)
router.delete('/delete/:id', adminRequired, controllers.deleteComment)

export default router