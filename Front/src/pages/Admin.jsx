import { useState } from 'react'
import AdminProductos from '../components/admin/AdminProductos'
import AdminPedidos from '../components/admin/AdminPedidos'
import AdminUsuarios from '../components/admin/AdminUsuarios'
import './Admin.css'

function Admin() {
  const [pestanaActiva, setPestanaActiva] = useState('productos')

  return (
    <div className="contenedorAdmin">
      <h1 className="tituloAdmin">Panel de Administración</h1>

      {/* PESTAÑAS */}
      <div className="pestanasAdmin">
        <button
          className={`pestanaAdmin ${pestanaActiva === 'productos' ? 'activa' : ''}`}
          onClick={() => setPestanaActiva('productos')}
        >
          Productos
        </button>
        <button
          className={`pestanaAdmin ${pestanaActiva === 'pedidos' ? 'activa' : ''}`}
          onClick={() => setPestanaActiva('pedidos')}
        >
          Pedidos
        </button>
        <button
          className={`pestanaAdmin ${pestanaActiva === 'usuarios' ? 'activa' : ''}`}
          onClick={() => setPestanaActiva('usuarios')}
        >
          Usuarios
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="contenidoAdmin">
        {pestanaActiva === 'productos' && <AdminProductos />}
        {pestanaActiva === 'pedidos'   && <AdminPedidos />}
        {pestanaActiva === 'usuarios'  && <AdminUsuarios />}
      </div>
    </div>
  )
}

export default Admin