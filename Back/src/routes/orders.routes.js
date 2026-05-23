import { Router } from 'express'
import {crearPedido, getPedidosByEmail, getPedido, getPedidos, actualizarEstadoPedido, eliminarPedido} from '../controllers/orders.controller.js'
import { requireAuth } from '../middlewares/authMiddleware.js'
import { isAdmin } from '../middlewares/adminMiddleware.js'

const router = Router()

// Rutas públicas
router.post('/', crearPedido)         // crear pedido (logueado o invitado)
router.get('/email/:email', getPedidosByEmail)   // ver pedidos por email

// Rutas autenticado
router.get('/me', requireAuth, getPedidosByEmail)  // mis pedidos si logueado

// Rutas admin
router.get('/', requireAuth, isAdmin, getPedidos)           // todos los pedidos
router.get('/:id', requireAuth, isAdmin, getPedido)            // detalle pedido
router.put('/:id/estado', requireAuth, isAdmin, actualizarEstadoPedido) // cambiar estado
router.delete('/:id', requireAuth, isAdmin, eliminarPedido) // eliminar pedido

export default router