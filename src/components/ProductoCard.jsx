import { Link } from "react-router-dom";
import './ProductoCard.css'

/* eslint-disable react/prop-types */

/*
    Componente hijo que recibe un producto individual como prop desde el componente padre (Home)
    Las props son la forma de pasar datos de padre a hijo en React
    La desestructuración { producto } extrae directamente la prop 'producto' del objeto props
    Equivalente a: function ProductoCard(props) { const producto = props.producto }
*/
function ProductoCard({ producto }) {
    const precioFinal = producto.aplicarDescuento(producto.descuento)

    return (
        <div className="producto-card">
            <Link
                to={`/producto/${producto.id}`}
                className="enlace-producto"
            >
                {/* 
                  Las imágenes en public/ se acceden directamente desde la raíz del servidor con /
                  Vite sirve toodo lo de public/ como si estuviera en la raíz: public/img/ryzen.jpg → /img/ryzen.jpg
                  NO se usa ../../public/ porque esa carpeta no existe en la URL del servidor, solo en el disco
                */}
                <img src={`/img/${producto.imagen}`} alt={producto.nombre} className="producto-img"/>
                <div className="producto-resumen">
                    <h3 className="producto-nombre">{producto.nombre}</h3>
                    {producto.descuento > 0 ? (
                        <>
                            <p className="producto-precio-original"><s>{producto.precio.toFixed(2)} €</s></p>
                            <p className="producto-precio-descuento"><s>{precioFinal.toFixed(2)} € (-{producto.descuento}%)</s></p>
                        </>
                    ) : (
                        <p className="producto-precio">{producto.precio.toFixed(2)} €</p>
                    )}
                </div>
            </Link>
        </div>
    )
}

export default ProductoCard