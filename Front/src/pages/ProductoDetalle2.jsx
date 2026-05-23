import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productoService } from "../services/Productos/productoService";
import { calcularPrecioConDescuento, formatearPrecio } from "../utils/validaciones";
import './ProductoDetalle.css'

function ProductoDetalle2() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarProducto = async () => {
            try {
                setLoading(true);
                const data = await productoService.obtenerProductoPorId(id);
                setProducto(data);
                setError(null);
            } catch (err) {
                console.error("Error al cargar producto:", err);
                setError("No se pudo cargar el producto");
            } finally {
                setLoading(false);
            }
        };

        cargarProducto();
    }, [id]);

    if (loading) {
        return <p className="loading">Cargando producto...</p>;
    }

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
                <button onClick={() => navigate(-1)}>Volver</button>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="error-container">
                <p>Producto no encontrado</p>
                <button onClick={() => navigate(-1)}>Volver</button>
            </div>
        );
    }

    const precioFinal = calcularPrecioConDescuento(producto.precio, producto.descuento);

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
                            <span className="precio-original">
                                <s>{formatearPrecio(producto.precio)}</s>
                            </span>
                            <span className="precio-final">{formatearPrecio(precioFinal)}</span>
                            <span className="descuento">(-{producto.descuento}%)</span>
                        </p>
                    ) : (
                        <p className="detalle-precio">{formatearPrecio(producto.precio)}</p>
                    )}

                    <h3>Especificaciones</h3>
                    <ul className="detalle-especificaciones">
                        {producto.especificaciones && 
                            Object.entries(producto.especificaciones).map(([clave, valor]) => (
                                <li key={clave}>
                                    <strong>{clave}: </strong> {valor}
                                </li>
                            ))
                        }
                    </ul>

                    <button className="btn-carrito">🛒 Añadir al carrito</button>
                    <button className="btn-volver" onClick={() => navigate(-1)}>
                        ⬅ Volver
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle2;