import { Router } from 'express'
import { getClienteMe } from '../controllers/clients.controller.js'
import { requireAuth } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/me', requireAuth, getClienteMe)

export default router