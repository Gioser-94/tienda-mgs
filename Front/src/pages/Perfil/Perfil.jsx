import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/Orders/orderService';
import Spinner from '../../components/ui/spinner/Spinner';
import './Perfil.css';
import { Link } from 'react-router-dom';
import { obtenerErrorApi } from '../../utils/apiErrorHandler';
import { API_ERRORS } from '../../constants/apiErrors';
import { formatearPrecio } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';

function Perfil() {
  const { t: traducir, i18n } = useTranslation()
  const { usuario } = useAuth()
  const { mostrarToast } = useToast()
  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setCargando(true)
        const data = await orderService.getMisPedidos()
        setPedidos(data.pedidos)
      } catch (error) {
        const codigoError = obtenerErrorApi(error, API_ERRORS.ORDERS_LOAD_FAILED)
        mostrarToast(traducir(`API_ERRORS.${codigoError}`), 'error')
      } finally {
        setCargando(false)
      }
    }
    cargarPedidos()
  }, [])

  if (cargando) return <Spinner />

  return (
    <div className="contenedorPerfil">

      {/* DATOS DEL USUARIO */}
      <section className="seccionPerfil">

        <div className="cabeceraUsuario">
          <div className="avatarUsuario">
            {usuario.nombre_completo?.charAt(0).toUpperCase()}
          </div>
          <div className="infoUsuario">
            <h1 className="tituloPerfil">{usuario.nombre_completo}</h1>
            <span className={`badgeRolPerfil ${usuario.rol}`}>
              {usuario.rol}
            </span>
          </div>
        </div>

        <div className="tarjetaPerfil">
          <div className="grupoDatoPerfil">
            <span className="etiquetaPerfil">{traducir("PROFILE.NAME")}</span>
            <span className="valorPerfil">{usuario.nombre_completo}</span>
          </div>
          <div className="grupoDatoPerfil">
            <span className="etiquetaPerfil">{traducir("PROFILE.PHONE")}</span>
            <span className="valorPerfil">{usuario.telefono}</span>
          </div>
          <div className="grupoDatoPerfil">
            <span className="etiquetaPerfil">{traducir("PROFILE.EMAIL")}</span>
            <span className="valorPerfil">{usuario.email}</span>
          </div>
          <div className="grupoDatoPerfil">
            <span className="etiquetaPerfil">{traducir("PROFILE.ROLE")}</span>
            <span className="valorPerfil">{usuario.rol}</span>
          </div>
        </div>

        {usuario.rol === 'admin' && (
          <Link to="/admin" className="botonAdmin">
            {traducir("PROFILE.ADMIN_PANEL")}
          </Link>
        )}

      </section>

      {/* HISTORIAL DE PEDIDOS */}
      <section className="seccionPerfil">
        <h2 className="subtituloPerfil">{traducir("PROFILE.MY_ORDERS")}</h2>

        {pedidos.length === 0 ? (
          <p className="sinPedidosPerfil">{traducir("PROFILE.NO_ORDERS")}.</p>
        ) : (
          <div className="listaPedidosPerfil">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="tarjetaPedidoPerfil">
                <div className="cabeceraPedidoPerfil">
                  <span className="idPedidoPerfil">{traducir("PROFILE.ORDER_NUMBER")}{pedido.id}</span>
                  <span className={`estadoPedidoPerfil estado-${pedido.estado.toLowerCase()}`}>
                    {pedido.estado}
                  </span>
                </div>
                <div className="cuerposPedidoPerfil">
                  {pedido.lineas_pedido.map((linea) => (
                    <div key={linea.id} className="lineaPedidoPerfil">
                      <span>{linea.producto.nombre}</span>
                      <span>x{linea.cantidad}</span>
                      <span>{formatearPrecio(linea.subtotal, i18n.language)}</span>
                    </div>
                  ))}
                </div>
                <div className="piePedidoPerfil">
                  <span className="fechaPedidoPerfil">
                    {new Date(pedido.fecha).toLocaleDateString()}
                  </span>
                  <span className="totalPedidoPerfil">
                    Total: {formatearPrecio(pedido.total, i18n.language)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

export default Perfil