import prisma from '../config/prisma.js';
import Decimal from 'decimal.js';

// POST /api/orders
export const crearPedido = async (req, res) => {
  try {
    const {
      nombre, email, telefono,       // datos cliente
      direccion, ciudad, provincia,  // datos dirección
      codigo_postal, pais,
      productos                      // [{ producto_id, cantidad, precio_unitario }]
    } = req.body

    // Validaciones básicas
    if (!nombre || !email || !telefono || !direccion || !ciudad || !codigo_postal || !pais) {
      return res.status(400).json({ error: 'Faltan datos del cliente o dirección' })
    }

    if (!productos || productos.length === 0) {
      return res.status(400).json({ error: 'El pedido debe tener al menos un producto' })
    }

    // Calculamos el total
    const total = productos.reduce((acc, p) => {
      return new Decimal(acc).plus(
        new Decimal(p.precio_unitario).times(parseInt(p.cantidad))
      )
    }, new Decimal(0))

    // Creamos todo en una transacción
    const pedido = await prisma.$transaction(async (tx) => {

      // 1. Crear cliente
      const cliente = await tx.clientes.create({
        data: {
          nombre,
          email,
          telefono,
          usuario_id: req.user ? BigInt(req.user.id) : null
        }
      })

      // 2. Crear dirección
      const dir = await tx.direcciones.create({
        data: {
          cliente_id:    cliente.id,
          direccion,
          ciudad,
          provincia:     provincia ?? null,
          codigo_postal,
          pais
        }
      })

      // 3. Crear pedido
      const nuevoPedido = await tx.pedidos.create({
        data: {
          cliente_id:   cliente.id,
          direccion_id: dir.id,
          total,
          estado:       'Pendiente'
        }
      })

      // 4. Crear lineas_pedido
      await tx.lineas_pedido.createMany({
        data: productos.map(p => {
          const precio = new Decimal(p.precio_unitario)
          const cantidad = parseInt(p.cantidad)
          const subtotal = precio.times(cantidad)
          return {
              pedido_id:       nuevoPedido.id,
              producto_id:     BigInt(p.producto_id),
              cantidad:        cantidad,
              precio_unitario: precio,
              subtotal:        subtotal
          };
        })
      })

      return nuevoPedido
    })

    return res.status(201).json({
      message: 'Pedido creado correctamente',
      pedido: {
        id:     pedido.id,
        estado: pedido.estado,
        total:  pedido.total
      }
    })

  } catch (error) {
    console.error('Error en crearPedido:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// GET /api/orders/email/:email  o  GET /api/orders/me
export const getPedidosByEmail = async (req, res) => {
  try {
    // Si viene de /me usamos el email del token, si no el de la URL
    const email = req.user ? req.user.email : req.params.email

    const clientes = await prisma.clientes.findMany({
      where: { email },
      include: {
        pedidos: {
          include: {
            lineas_pedido: {
              include: { producto: true }
            },
            direccion: true
          },
          orderBy: { created_at: 'desc' }
        }
      }
    })

    // Juntamos todos los pedidos de todas las compras con ese email
    const pedidos = clientes.flatMap(c => c.pedidos)

    return res.json({ pedidos })

  } catch (error) {
    console.error('Error en getPedidosByEmail:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// GET /api/orders  (admin)
export const getPedidos = async (req, res) => {
  try {
    const pedidos = await prisma.pedidos.findMany({
      include: {
        cliente:  true,
        direccion: true,
        lineas_pedido: {
          include: { producto: true }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    return res.json({ pedidos })

  } catch (error) {
    console.error('Error en getPedidos:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// GET /api/orders/:id  (admin)
export const getPedido = async (req, res) => {
  try {
    const { id } = req.params

    const pedido = await prisma.pedidos.findUnique({
      where: { id: BigInt(id) },
      include: {
        cliente:  true,
        direccion: true,
        lineas_pedido: {
          include: { producto: true }
        }
      }
    })

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido no encontrado' })
    }

    return res.json({ pedido })

  } catch (error) {
    console.error('Error en getPedido:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// PUT /api/orders/:id/estado  (admin)
export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params
    const { estado } = req.body

    const estadosValidos = ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado']

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({
        error: `Estado no válido. Estados permitidos: ${estadosValidos.join(', ')}`
      })
    }

    const pedido = await prisma.pedidos.update({
      where: { id: BigInt(id) },
      data:  { estado }
    })

    return res.json({ message: 'Estado actualizado', pedido })

  } catch (error) {
    console.error('Error en actualizarEstadoPedido:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// DELETE /api/orders/:id  (admin)
export const eliminarPedido = async (req, res) => {
  try {
    const { id } = req.params

    // Primero borramos las lineas_pedido porque dependen del pedido
    await prisma.lineas_pedido.deleteMany({
      where: { pedido_id: BigInt(id) }
    })

    await prisma.pedidos.delete({
      where: { id: BigInt(id) }
    })

    return res.json({ message: 'Pedido eliminado correctamente' })

  } catch (error) {
    console.error('Error en eliminarPedido:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}