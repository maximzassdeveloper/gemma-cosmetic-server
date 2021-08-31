import { Router } from 'express'
import * as controllers from '../controllers/attributeController'
const router = Router()

router.get('/', controllers.getAttrs)
router.post('/create', controllers.createAttr)
router.put('/update/:id')
router.delete('/delete/:id', controllers.deleteAttr)

router.delete('/values/delete/:id', controllers.deleteAttrValue)

export default router