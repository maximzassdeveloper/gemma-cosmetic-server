import { Router } from 'express'
import * as controllers from '../controllers/attributeController'
import { adminRequired } from '../middlewares/authMiddleware'
const router = Router()

router.get('/', controllers.getAttrs)
router.post('/create', adminRequired, controllers.createAttr)
router.put('/update/:id')
router.delete('/delete/:id', adminRequired, controllers.deleteAttr)

router.delete('/values/delete/:id', controllers.deleteAttrValue)

export default router