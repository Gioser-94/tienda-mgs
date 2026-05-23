import { Router } from 'express'
import {getUsuarios, getUsuario, cambiarRol, eliminarUsuario} from '../controllers/users.controller.js'
import { requireAuth } from '../middlewares/authMiddleware.js'
import { isAdmin }     from '../middlewares/adminMiddleware.js'

const router = Router()

router.get('/', requireAuth, isAdmin, getUsuarios)
router.get('/:id', requireAuth, isAdmin, getUsuario)
router.put('/:id/rol', requireAuth, isAdmin, cambiarRol)
router.delete('/:id', requireAuth, isAdmin, eliminarUsuario)

export default router