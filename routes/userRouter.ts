import { Router } from 'express'
import * as controllers from '../controllers/userController'
import { authRequired } from '../middlewares/authMiddleware'
const router = Router()

// Auth
router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.get('/logout', controllers.logout)
router.get('/refresh', controllers.refresh)

// User
router.get('/', )
router.delete('/delete-user', authRequired)
router.put('/update-user', authRequired)

export default router