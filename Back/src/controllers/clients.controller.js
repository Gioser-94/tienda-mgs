import prisma from '../config/prisma.js'

// GET /api/clients/me
export const getClienteMe = async (req, res) => {
  try {
    // Buscamos el cliente más reciente vinculado a este usuario
    const cliente = await prisma.clientes.findFirst({
      where: { usuario_id: BigInt(req.user.id) },
      orderBy: { created_at: 'desc' },
      include: {
        direcciones: {
          orderBy: { created_at: 'desc' },
          take: 1  // solo la última dirección
        }
      }
    })

    // Si nunca ha comprado, devolvemos vacío sin error
    if (!cliente) {
      return res.json({ cliente: null, direccion: null })
    }

    const ultimaDireccion = cliente.direcciones[0] ?? null

    return res.json({
      cliente: {
        nombre:   cliente.nombre,
        email:    cliente.email,
        telefono: cliente.telefono
      },
      direccion: ultimaDireccion ? {
        direccion:     ultimaDireccion.direccion,
        ciudad:        ultimaDireccion.ciudad,
        provincia:     ultimaDireccion.provincia,
        codigo_postal: ultimaDireccion.codigo_postal,
        pais:          ultimaDireccion.pais
      } : null
    })

  } catch (error) {
    console.error('Error en getClienteMe:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}