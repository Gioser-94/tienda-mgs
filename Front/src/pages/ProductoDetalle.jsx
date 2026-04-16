import { useParams, useNavigate} from "react-router-dom"
import { useState, useEffect } from "react"
import { productos } from "../data/productos"
import './ProductoDetalle.css'

function ProductoDetalle() {
  let params = useParams()
  const [producto, setProducto] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    setProducto(productos.find(p => p.id === Number.parseInt(params.id)))
  }, [])

  /*
    Primera renderización (producto = null):

    1. producto = null
    2. Lee el if (!producto) → TRUE
    3. Ejecuta return <p>Cargando...</p>
    4. TERMINA AHÍ, no sigue leyendo más código
    5. Muestra "Cargando..." en pantalla
    6. DESPUÉS se ejecuta useEffect
    7. useEffect hace setProducto(...)

    Segunda renderización (producto = objeto):

    1. producto = { id: 1, nombre: "Ryzen", ... }
    2. Lee el if (!producto) → FALSE
    3. NO entra al if, sigue ejecutando
    4. Ejecuta: const precioFinal = producto.aplicarDescuento(...)
    5. Ejecuta el return final con toda la info del producto
    6. Muestra el detalle completo en pantalla
  */

  if (!producto) {
    return <p>Cargando...</p>
  }

  // Tenemos acceso a los metodos de la clase Producto (aplicarDescuento)
  // porque se ha importado productos.js, pero necesitamos declararlo despues
  // de hacer la validación de que si existe producto o no, porque en un principio
  // el producto es null y hasta que no lo encuentra no se tiene acceso a los
  // métodos de la clase
  const precioFinal = producto.aplicarDescuento(producto.descuento)

  return (
    <div className="detalle-container">
      <div className="detalle-producto">
        <div className="detalle-imagen">
          <img src={`/img/${producto.imagen}`} alt={producto.nombre} />
        </div>

        <div className="detalle-info">
          <h2>{producto.nombre}</h2>
          <p className="detalle-descripcion">{producto.descripcion}</p>
          {producto.descuento > 0 ? (
            <p className="detalle-precio">
              <span className="precio-original"><s>{producto.precio.toFixed(2)} €</s></span>
              <span className="precio-final">{precioFinal.toFixed(2)} €</span>
              <span className="descuento">(-{producto.descuento}%)</span>
            </p>
          ) : (
            <p className="detalle-precio">{producto.precio.toFixed(2)} €</p>
          )}

          <h3>Especificaciones</h3>
          <ul className="detalle-especificaciones">
            {Object.entries(producto.especificaciones)
              .map(([clave, valor]) => 
                <li key={clave}><strong>{clave}:</strong> {valor}</li>)
            }
          </ul>

          <button className="btn-carrito">🛒 Añadir al carrito</button>
          <button className="btn-volver" onClick={() => navigate(-1)}>⬅ Volver</button>
          {/* navigate(-1) al pulsar el boton vuelve a la ultima pagina vista */}
        </div>
      </div>
    </div>
  )
}

export default ProductoDetalle