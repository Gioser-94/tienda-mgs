import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminProductos from '../components/admin/AdminProductos';
import AdminPedidos from '../components/admin/AdminPedidos';
import AdminUsuarios from '../components/admin/AdminUsuarios';
import './Admin.css';

function Admin() {
  const { t: traducir } = useTranslation();
  const [pestanaActiva, setPestanaActiva] = useState('productos');

  return (
    <div className="contenedorAdmin">
      <h1 className="tituloAdmin">{traducir('ADMIN.PANEL_TITLE')}</h1>

      {/* PESTAÑAS */}
      <div className="pestanasAdmin">
        <button
          className={`pestanaAdmin ${pestanaActiva === 'productos' ? 'activa' : ''}`}
          onClick={() => setPestanaActiva('productos')}
        >
          {traducir('ADMIN.TAB_PRODUCTS')}
        </button>
        <button
          className={`pestanaAdmin ${pestanaActiva === 'pedidos' ? 'activa' : ''}`}
          onClick={() => setPestanaActiva('pedidos')}
        >
          {traducir('ADMIN.TAB_ORDERS')}
        </button>
        <button
          className={`pestanaAdmin ${pestanaActiva === 'usuarios' ? 'activa' : ''}`}
          onClick={() => setPestanaActiva('usuarios')}
        >
          {traducir('ADMIN.TAB_USERS')}
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