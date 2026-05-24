import { useState, useEffect } from 'react'
import { adminService } from '../../services/Admin/adminService'
import './Admin.css'

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const cargarUsuarios = async () => {
    try {
      setCargando(true)
      const data = await adminService.getUsuarios()
      setUsuarios(data.usuarios)
    } catch {
      setError('No se han podido cargar los usuarios')
    } finally {
      setCargando(false)
    }
  }

  const handleCambiarRol = async (id, rolActual) => {
    const nuevoRol = rolActual === 'admin' ? 'cliente' : 'admin'
    if (!confirm(`¿Cambiar rol a ${nuevoRol}?`)) return

    try {
      await adminService.cambiarRol(id, nuevoRol)
      cargarUsuarios()
    } catch {
      alert('Error al cambiar el rol')
    }
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este usuario? Esta acción no se puede deshacer')) return

    try {
      await adminService.eliminarUsuario(id)
      cargarUsuarios()
    } catch {
      alert('Error al eliminar el usuario')
    }
  }

  if (cargando) return <p>Cargando usuarios...</p>
  if (error)    return <p className="errorAdmin">{error}</p>

  return (
    <div>
      <h2 className="tituloSeccionAdmin">Usuarios</h2>

      <table className="tablaAdmin">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Fecha registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.email}</td>
              <td>
                <span className={`badgeRol ${usuario.rol}`}>
                  {usuario.rol}
                </span>
              </td>
              <td>{new Date(usuario.created_at).toLocaleDateString()}</td>
              <td className="accionesAdmin">
                <button
                  className="botonSecundarioAdmin"
                  onClick={() => handleCambiarRol(usuario.id, usuario.rol)}
                >
                  {usuario.rol === 'admin' ? 'Hacer cliente' : 'Hacer admin'}
                </button>
                <button
                  className="botonPeligroAdmin"
                  onClick={() => handleEliminar(usuario.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUsuarios