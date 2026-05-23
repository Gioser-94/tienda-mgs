import { Router } from 'express'
import { getCategorias, getCategoria } from '../controllers/categories.controller.js'

const router = Router()

router.get('/', getCategorias)
router.get('/:id', getCategoria)

export default router