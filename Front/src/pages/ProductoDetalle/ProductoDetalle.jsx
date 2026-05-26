import { useParams, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import './ProductoDetalle.css';
import { productoService } from "../../services/Productos/productoService";
import { API_ERRORS } from "../../constants/apiErrors";
import { obtenerErrorApi } from "../../utils/apiErrorHandler";
import Spinner from "../../components/ui/spinner/Spinner";
import {
  formatearPrecio,
  formatearDescuento,
  calcularPrecioConDescuento
} from "../../utils/formatters";
import { useCart } from "../../context/CartContext";
import { useToast } from '../../context/ToastContext';

function ProductoDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mostrarToast } = useToast();
  const { t: traducir, i18n } = useTranslation();
  const { addProductoCarrito } = useCart();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState("");

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setCargando(true);
        setErrorServidor("");
        
        const data = await productoService.obtenerProductoPorId(id);

        setProducto(data);

      } catch (error) {
        const codigoError = obtenerErrorApi(
          error,
          API_ERRORS.PRODUCT_LOAD_FAILED
        );

        setErrorServidor(
          traducir(`API_ERRORS.${codigoError}`)
        );

      } finally {
        setCargando(false);
      }
    };
    cargarProducto();
  }, [id]);

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

  if (cargando) {
    return <Spinner />;
  }

  if (errorServidor) {
    return (
      <div className="error-container">
        <h3>{traducir("PRODUCT.ERROR_LOADING_DETAIL")}</h3>

        <p className="error-message">
          {errorServidor}
        </p>

        <button onClick={() => navigate(-1)}>
          {traducir("COMMON.BACK")}
        </button>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="error-container">
        <h3>{traducir("PRODUCT.NOT_FOUND")}</h3>

        <button onClick={() => navigate(-1)}>
          {traducir("COMMON.BACK")}
        </button>
      </div>
    );
  }

  // Tenemos acceso a los metodos de la clase Producto (aplicarDescuento)
  // porque se ha importado productos.js, pero necesitamos declararlo despues
  // de hacer la validación de que si existe producto o no, porque en un principio
  // el producto es null y hasta que no lo encuentra no se tiene acceso a los
  // métodos de la clase
  const precioFinal = calcularPrecioConDescuento(
    producto.precio,
    producto.descuento
  );

  const handleAddCarrito = async () => {
      await addProductoCarrito(producto.id, 1);
      mostrarToast(traducir('TOAST.ADDED_TO_CART'));
  };

  return (
    <div className="detalle-container">
      <div className="detalle-producto">
        <div className="detalle-imagen">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        <div className="detalle-info">
          <h2>{producto.nombre}</h2>
          <p className="detalle-descripcion">{producto.descripcion}</p>
          {producto.descuento > 0 ? (
            <p className="detalle-precio">
              <span className="precio-original"><s>{formatearPrecio(producto.precio, i18n.language)}</s></span>
              <span className="precio-final">{formatearPrecio(precioFinal, i18n.language)}</span>
              <span className="descuento">({formatearDescuento(producto.descuento)})</span>
            </p>
          ) : (
            <p className="detalle-precio">{formatearPrecio(producto.precio, i18n.language)}</p>
          )}

          <h3>{traducir("PRODUCT.SPECIFICATIONS")}</h3>
          <ul className="detalle-especificaciones">
            {Object.entries(producto.especificaciones)
    .map(([clave, valor]) => {
        const claveTraducida = traducir(`SPECS.${clave}`, { defaultValue: clave })
        const valorFormateado = typeof valor === 'boolean'
            ? (valor ? '✓' : '✗')
            : valor
        return (
            <li key={clave}>
                <strong>{claveTraducida}:</strong> {valorFormateado}
            </li>
        )
    })
}
          </ul>

          <button className="btn-carrito" onClick={handleAddCarrito}>🛒 {traducir("PRODUCT.ADD_TO_CART")}</button>
          <button className="btn-volver" onClick={() => navigate(-1)}>⬅ {traducir("COMMON.BACK")}</button>
          {/* navigate(-1) al pulsar el boton vuelve a la ultima pagina vista */}
        </div>
      </div>
    </div>
  )
}

export default ProductoDetalle