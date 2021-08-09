import { Router } from 'express'
import { authRequired } from '../middlewares/authMiddleware'
import * as controllers from '../controllers/commentController'
const router = Router()

router.post('/create', authRequired, controllers.createComment)
router.put('/update/:id', authRequired, controllers.updateComment)

export default router