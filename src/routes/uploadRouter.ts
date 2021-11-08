import { Router } from 'express'
import * as controllers from '../controllers/uploadController'
const router = Router()

router.post('/add', controllers.add)
router.post('/remove', controllers.remove)

export default router