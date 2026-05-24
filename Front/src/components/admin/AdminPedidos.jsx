import { useState, useEffect } from 'react'
import { adminService } from '../../services/Admin/adminService'
import './Admin.css'

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarPedidos()
  }, [])

  const cargarPedidos = async () => {
    try {
      setCargando(true)
      const data = await adminService.getPedidos()
      setPedidos(data.pedidos)
    } catch {
      setError('No se han podido cargar los pedidos')
    } finally {
      setCargando(false)
    }
  }

  const handleCambiarEstado = async (id, estadoActual) => {
    const estados = ['Pendiente', 'Procesando', 'Enviado', 'Entregado', 'Cancelado']
    const nuevoEstado = prompt(
      `Estado actual: ${estadoActual}\nEstados válidos: ${estados.join(', ')}\n\nNuevo estado:`,
      estadoActual
    )

    if (!nuevoEstado || nuevoEstado === estadoActual) return
    if (!estados.includes(nuevoEstado)) {
      alert(`Estado no válido. Usa uno de: ${estados.join(', ')}`)
      return
    }

    try {
      await adminService.actualizarEstadoPedido(id, nuevoEstado)
      cargarPedidos()
    } catch {
      alert('Error al cambiar el estado')
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer')) return

    try {
      await adminService.eliminarPedido(id)
      cargarPedidos()
    } catch {
      alert('Error al eliminar el pedido')
    }
  }

  if (cargando) return <p>Cargando pedidos...</p>
  if (error)    return <p className="errorAdmin">{error}</p>

  return (
    <div>
      <h2 className="tituloSeccionAdmin">Pedidos</h2>

      {pedidos.length === 0 ? (
        <p>No hay pedidos todavía.</p>
      ) : (
        <table className="tablaAdmin">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Email</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>#{pedido.id}</td>
                <td>{pedido.cliente.nombre}</td>
                <td>{pedido.cliente.email}</td>
                <td>{pedido.total}€</td>
                <td>
                  <span className={`badgeEstado ${pedido.estado.toLowerCase()}`}>
                    {pedido.estado}
                  </span>
                </td>
                <td>{new Date(pedido.fecha).toLocaleDateString()}</td>
                <td>
                  {pedido.lineas_pedido.map((linea) => (
                    <div key={linea.id} className="lineaProductoPedido">
                      {linea.producto.nombre} x{linea.cantidad}
                    </div>
                  ))}
                </td>
                <td className="accionesAdmin">
                  <button
                    className="botonSecundarioAdmin"
                    onClick={() => handleCambiarEstado(pedido.id, pedido.estado)}
                  >
                    Cambiar estado
                  </button>
                  <button
                    className="botonPeligroAdmin"
                    onClick={() => handleEliminar(pedido.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminPedidos