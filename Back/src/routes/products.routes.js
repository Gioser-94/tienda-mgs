import { Router } from 'express'
import {
  getProductos,
  getProducto,
  getProductosPorCategoria,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  buscarProductos,
  getTodosProductos
} from '../controllers/products.controller.js'
import { requireAuth } from '../middlewares/authMiddleware.js'
import { isAdmin }     from '../middlewares/adminMiddleware.js'

const router = Router()

// Rutas públicas
router.get('/',              getProductos)
router.get('/search',        buscarProductos)
router.get('/all',           requireAuth, isAdmin, getTodosProductos)  // ← antes de /:id
router.get('/category/:id',  getProductosPorCategoria)
router.get('/:id',           getProducto)

// Rutas solo admin
router.post('/',       requireAuth, isAdmin, crearProducto)
router.put('/:id',     requireAuth, isAdmin, actualizarProducto)
router.delete('/:id',  requireAuth, isAdmin, eliminarProducto)

export default router