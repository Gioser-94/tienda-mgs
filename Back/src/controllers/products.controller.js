import prisma from '../config/prisma.js'
import { supabase } from '../config/supabase.js'

const SUPABASE_STORAGE_URL = `${process.env.SUPABASE_URL}/storage/v1/object/public/Imagenes`

// GET /api/productos
export const getProductos = async (req, res) => {
  try {
    const productos = await prisma.productos.findMany({
      where: { activo: true },
      include: { categoria: true },
      orderBy: { nombre: 'asc' }
    })

    const productosConUrl = productos.map(p => ({
      ...p,
      imagen: `${SUPABASE_STORAGE_URL}/${p.imagen}`
    }))

    return res.json({ productos: productosConUrl })
  } catch (error) {
    console.error('Error en getProductos:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// GET /api/productos/:id
export const getProducto = async (req, res) => {
  try {
    const { id } = req.params
    const producto = await prisma.productos.findUnique({
      where: { id: BigInt(id) },
      include: { categoria: true }
    })

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    return res.json({
      producto: {
        ...producto,
        imagen: `${SUPABASE_STORAGE_URL}/${producto.imagen}`
      }
    })
  } catch (error) {
    console.error('Error en getProducto:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// GET /api/productos/categoria/:id
export const getProductosPorCategoria = async (req, res) => {
  try {
    const { id } = req.params
    const productos = await prisma.productos.findMany({
      where: {
        categoria_id: BigInt(id),
        activo: true
      },
      include: { categoria: true }
    })

    const productosConUrl = productos.map(p => ({
      ...p,
      imagen: `${SUPABASE_STORAGE_URL}/${p.imagen}`
    }))

    return res.json({ productos: productosConUrl })
  } catch (error) {
    console.error('Error en getProductosPorCategoria:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// POST /api/productos  (admin)
export const crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, imagen, precio, categoria_id, especificaciones, descuento, stock } = req.body

    if (!nombre || !imagen || !precio || !categoria_id || !especificaciones) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
    }

    const producto = await prisma.productos.create({
      data: {
        nombre,
        descripcion,
        imagen,
        precio,
        categoria_id: BigInt(categoria_id),
        especificaciones,
        descuento,
        stock:  stock  ?? 0,
        activo: true
      }
    })

    return res.status(201).json({ producto })
  } catch (error) {
    console.error('Error en crearProducto:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// PUT /api/productos/:id  (admin)
export const actualizarProducto = async (req, res) => {
  try {
    const { id } = req.params
    const data = req.body

    if (data.categoria_id) data.categoria_id = BigInt(data.categoria_id)

    const producto = await prisma.productos.update({
      where: { id: BigInt(id) },
      data
    })

    return res.json({ producto })
  } catch (error) {
    console.error('Error en actualizarProducto:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// DELETE /api/productos/:id  (admin)
export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.productos.update({
      where: { id: BigInt(id) },
      data: { activo: false }
    })

    return res.json({ message: 'Producto desactivado correctamente' })
  } catch (error) {
    console.error('Error en eliminarProducto:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

export const buscarProductos = async (req, res) => {
    try {
        const { q } = req.query;

        const productos = await prisma.productos.findMany({
            where: {
                OR: [
                    {
                        nombre: {
                            contains: q,
                            mode: 'insensitive'
                        }
                    },
                    {
                        descripcion: {
                            contains: q,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        });

        res.json({
            productos
        });

    } catch (error){
        console.error(error);
        res.status(500).json({
            error: 'Error buscando productos'
        });
    }
};