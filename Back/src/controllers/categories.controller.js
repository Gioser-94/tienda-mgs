import prisma from '../config/prisma.js'

// GET /api/categorias
export const getCategorias = async (req, res) => {
  try {
    const categorias = await prisma.categorias.findMany({
      orderBy: { nombre: 'asc' }
    })
    return res.json({ categorias })
  } catch (error) {
    console.error('Error en getCategorias:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// GET /api/categorias/:id
export const getCategoria = async (req, res) => {
  try {
    const { id } = req.params
    const categoria = await prisma.categorias.findUnique({
      where: { id: BigInt(id) }
    })
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }
    return res.json({ categoria })
  } catch (error) {
    console.error('Error en getCategoria:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}