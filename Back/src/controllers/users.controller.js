import prisma from '../config/prisma.js'

// GET /api/users  (admin)
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      select: {
        id:         true,
        email:      true,
        rol:        true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    })

    return res.json({ usuarios })

  } catch (error) {
    console.error('Error en getUsuarios:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// GET /api/users/:id  (admin)
export const getUsuario = async (req, res) => {
  try {
    const { id } = req.params

    const usuario = await prisma.usuarios.findUnique({
      where: { id: BigInt(id) },
      select: {
        id:         true,
        email:      true,
        rol:        true,
        created_at: true
      }
    })

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    return res.json({ usuario })

  } catch (error) {
    console.error('Error en getUsuario:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// PUT /api/users/:id/rol  (admin)
export const cambiarRol = async (req, res) => {
  try {
    const { id }  = req.params
    const { rol } = req.body

    const rolesValidos = ['cliente', 'admin']

    if (!rolesValidos.includes(rol)) {
      return res.status(400).json({
        error: `Rol no válido. Roles permitidos: ${rolesValidos.join(', ')}`
      })
    }

    // Evitar que el admin se quite el rol a sí mismo
    if (BigInt(id) === BigInt(req.user.id)) {
      return res.status(400).json({ error: 'No puedes cambiar tu propio rol' })
    }

    const usuario = await prisma.usuarios.update({
      where: { id: BigInt(id) },
      data:  { rol },
      select: {
        id:    true,
        email: true,
        rol:   true
      }
    })

    return res.json({ message: 'Rol actualizado correctamente', usuario })

  } catch (error) {
    console.error('Error en cambiarRol:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// DELETE /api/users/:id  (admin)
export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params

    // Evitar que el admin se elimine a sí mismo
    if (BigInt(id) === BigInt(req.user.id)) {
      return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' })
    }

    await prisma.usuarios.delete({
      where: { id: BigInt(id) }
    })

    return res.json({ message: 'Usuario eliminado correctamente' })

  } catch (error) {
    console.error('Error en eliminarUsuario:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}