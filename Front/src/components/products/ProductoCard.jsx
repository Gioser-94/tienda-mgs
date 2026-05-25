import { Link } from "react-router-dom";
import './ProductoCard.css'
import {
    formatearPrecio,
    formatearDescuento,
    calcularPrecioConDescuento
} from '../../utils/formatters';
import { useTranslation } from "react-i18next";

/* eslint-disable react/prop-types */

/*
    Componente hijo que recibe un producto individual como prop desde el componente padre (Home)
    Las props son la forma de pasar datos de padre a hijo en React
    La desestructuración { producto } extrae directamente la prop 'producto' del objeto props
    Equivalente a: function ProductoCard(props) { const producto = props.producto }
*/


function ProductoCard({ producto }) {
    const { i18n } = useTranslation();
    const precioFinal = calcularPrecioConDescuento(producto.precio, producto.descuento)

    return (
        <div className="producto-card">
            <Link
                to={`/producto/${producto.id}`}
                className="enlace-producto"
            >
                <img src={producto.imagen} alt={producto.nombre} className="producto-img"/>
                <div className="producto-resumen">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    {producto.descuento > 0 ? (
                        <>
                            <p className="producto-precio-original"><s>{formatearPrecio(producto.precio, i18n.language)}</s></p>
                            <p className="producto-precio-descuento">{formatearPrecio(precioFinal, i18n.language)} ({formatearDescuento(producto.descuento)})</p>
                        </>
                    ) : (
                        <p className="producto-precio">{formatearPrecio(producto.precio, i18n.language)}</p>
                    )}
                </div>
            </Link>
        </div>
    )
}

export default ProductoCard