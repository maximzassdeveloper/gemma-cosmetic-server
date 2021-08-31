import { Router } from 'express'
import * as controllers from '../controllers/userController'
import { authRequired, adminRequired } from '../middlewares/authMiddleware'
const router = Router()

// Auth
router.post('/register', controllers.register)
router.post('/login', controllers.login)
router.get('/logout', controllers.logout)
router.get('/refresh', controllers.refresh)

// User
router.get('/', controllers.getUsers)
router.get('/user/:id', authRequired, controllers.getUser)
router.delete('/delete', adminRequired, controllers.deleteUser)
router.put('/update', authRequired, controllers.updateUser)

export default router