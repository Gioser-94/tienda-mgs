import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { adminService } from '../../services/Admin/adminService';
import { API_ERRORS } from '../../constants/apiErrors';
import { obtenerErrorApi } from '../../utils/apiErrorHandler';
import { formatearPrecio } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import Spinner from '../ui/spinner/Spinner';
import './Admin.css';

const ESTADOS = [
    { valor: 'Pendiente',  clave: 'ADMIN.STATUS_PENDING' },
    { valor: 'Procesando', clave: 'ADMIN.STATUS_PROCESSING' },
    { valor: 'Enviado',    clave: 'ADMIN.STATUS_SHIPPED' },
    { valor: 'Entregado',  clave: 'ADMIN.STATUS_DELIVERED' },
    { valor: 'Cancelado',  clave: 'ADMIN.STATUS_CANCELLED' },
];

function AdminPedidos() {
  const { t: traducir, i18n } = useTranslation();
  const { mostrarToast } = useToast();
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState('');
  const [pedidoEditando, setPedidoEditando] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');

  useEffect(() => {
    cargarPedidos()
  }, []);

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      setErrorServidor('');
      const data = await adminService.getPedidos();
      setPedidos(data.pedidos);
    } catch (error) {
      const codigoError = obtenerErrorApi(error, API_ERRORS.ORDERS_LOAD_FAILED);
      setErrorServidor(traducir(`API_ERRORS.${codigoError}`));
    } finally {
      setCargando(false);
    }
  };

  const handleIniciarEdicion = (pedido) => {
    setPedidoEditando(pedido.id);
    setEstadoSeleccionado(pedido.estado);
  };

  const handleCancelarEdicion = () => {
    setPedidoEditando(null);
    setEstadoSeleccionado('');
  }

  const handleGuardarEstado = async (id) => {
    try {
      await adminService.actualizarEstadoPedido(id, estadoSeleccionado);
      mostrarToast(traducir('ADMIN.TOAST_ORDER_UPDATED'));
      setPedidoEditando(null);
      setEstadoSeleccionado('');
      cargarPedidos();
    } catch (error) {
      const codigoError = obtenerErrorApi(error, API_ERRORS.ORDER_UPDATE_FAILED);
      mostrarToast(traducir(`API_ERRORS.${codigoError}`), 'error');
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm(traducir('ADMIN.CONFIRM_DELETE_ORDER'))) return

    try {
      await adminService.eliminarPedido(id);
      mostrarToast(traducir('ADMIN.TOAST_ORDER_DELETED'));
      cargarPedidos();
    } catch (error) {
      const codigoError = obtenerErrorApi(error, API_ERRORS.ORDER_DELETE_FAILED)
      mostrarToast(traducir(`API_ERRORS.${codigoError}`), 'error')
    }
  }

  if (cargando) return <Spinner />
  if (errorServidor)    return <p className="errorAdmin">{errorServidor}</p>

  return (
    <div>
      <h2 className="tituloSeccionAdmin">{traducir('ADMIN.ORDERS_TITLE')}</h2>

      {pedidos.length === 0 ? (
        <p>{traducir('ADMIN.NO_ORDERS')}</p>
      ) : (
        <table className="tablaAdmin">
          <thead>
            <tr>
              <th>{traducir('ADMIN.COL_ID')}</th>
              <th>{traducir('ADMIN.COL_CLIENT')}</th>
              <th>{traducir('ADMIN.COL_EMAIL')}</th>
              <th>{traducir('ADMIN.COL_TOTAL')}</th>
              <th>{traducir('ADMIN.COL_STATUS')}</th>
              <th>{traducir('ADMIN.COL_DATE')}</th>
              <th>{traducir('ADMIN.COL_PRODUCTS')}</th>
              <th>{traducir('ADMIN.COL_ACTIONS')}</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>#{pedido.id}</td>
                <td>{pedido.cliente.nombre}</td>
                <td>{pedido.cliente.email}</td>
                <td className="celda-precio">{formatearPrecio(pedido.total, i18n.language)}</td>
                <td>
                  {pedidoEditando === pedido.id ? (
                    <select
                      className={`selectEstadoAdmin selectEstado--${estadoSeleccionado.toLowerCase()}`}
                      value={estadoSeleccionado}
                      onChange={(e) => setEstadoSeleccionado(e.target.value)}
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado.valor} value={estado.valor}>
                            {traducir(estado.clave)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`badgeEstado ${pedido.estado.toLowerCase()}`}>
                      {traducir(ESTADOS.find(e => e.valor === pedido.estado)?.clave ?? pedido.estado)}
                    </span>
                  )}
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
                  {pedidoEditando === pedido.id ? (
                    <>
                      <button
                        className="botonExitoAdmin"
                        onClick={() => handleGuardarEstado(pedido.id)}
                      >
                        {traducir('ADMIN.SAVE')}
                      </button>
                      <button
                        className="botonPeligroAdmin"
                        onClick={handleCancelarEdicion}
                      >
                        {traducir('ADMIN.CANCEL')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="botonSecundarioAdmin"
                        onClick={() => handleIniciarEdicion(pedido)}
                      >
                        {traducir('ADMIN.CHANGE_STATUS')}
                      </button>
                      <button
                        className="botonPeligroAdmin"
                        onClick={() => handleEliminar(pedido.id)}
                      >
                        {traducir('ADMIN.DELETE')}
                      </button>
                    </>
                  )}
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