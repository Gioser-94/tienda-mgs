import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext'
import { orderService } from '../services/Orders/orderService'
import Spinner from '../components/ui/spinner/Spinner'
import './Perfil.css'
import { Link } from 'react-router-dom'

function Perfil() {
  const { t: traducir } = useTranslation()
  const { usuario } = useAuth()

  const [pedidos, setPedidos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [errorServidor, setErrorServidor] = useState('')

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setCargando(true)
        setErrorServidor('')
        const data = await orderService.getMisPedidos()
        setPedidos(data.pedidos)
      } catch {
        setErrorServidor('No se han podido cargar los pedidos')
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
        <h1 className="tituloPerfil">Mi Perfil</h1>
        <div className="tarjetaPerfil">
          <div className="grupoDatoPerfil">
            <span className="etiquetaPerfil">Email</span>
            <span className="valorPerfil">{usuario.email}</span>
          </div>
          <div className="grupoDatoPerfil">
            <span className="etiquetaPerfil">Rol</span>
            <span className="valorPerfil">{usuario.rol}</span>
          </div>
        </div>
      </section>

      {/* HISTORIAL DE PEDIDOS */}
      <section className="seccionPerfil">
        <h2 className="subtituloPerfil">Mis Pedidos</h2>

        {errorServidor && (
          <p className="errorPerfil">{errorServidor}</p>
        )}

        {pedidos.length === 0 ? (
          <p className="sinPedidosPerfil">No tienes pedidos todavía.</p>
        ) : (
          <div className="listaPedidosPerfil">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="tarjetaPedidoPerfil">
                <div className="cabeceraPedidoPerfil">
                  <span className="idPedidoPerfil">Pedido #{pedido.id}</span>
                  <span className={`estadoPedidoPerfil estado-${pedido.estado.toLowerCase()}`}>
                    {pedido.estado}
                  </span>
                </div>

                <div className="cuerposPedidoPerfil">
                  {pedido.lineas_pedido.map((linea) => (
                    <div key={linea.id} className="lineaPedidoPerfil">
                      <span>{linea.producto.nombre}</span>
                      <span>x{linea.cantidad}</span>
                      <span>{linea.subtotal}€</span>
                    </div>
                  ))}
                </div>

                <div className="piePedidoPerfil">
                  <span className="fechaPedidoPerfil">
                    {new Date(pedido.fecha).toLocaleDateString()}
                  </span>
                  <span className="totalPedidoPerfil">
                    Total: {pedido.total}€
                  </span>
                </div>
              </div>
            ))}
          </div>  
        )}
      </section>
      {usuario.rol === 'admin' && (
        <Link to="/admin" className="botonAdmin">
          Panel de Administración →
        </Link>
      )}
    </div>
  )
}

export default Perfil