import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Spinner from '../components/ui/spinner/Spinner';
import { formatearPrecio } from '../utils/formatters';

import './Carrito.css';

function Carrito() {
    const { t: traducir, i18n } = useTranslation();
    const navigate = useNavigate();

    const {
        carrito,
        cargandoCarrito,
        updateProductoCarrito,
        deleteProductoCarrito
    } = useCart();

    if (cargandoCarrito) {
        return <Spinner />;
    }

    if (!carrito || carrito.items.length === 0) {
        return (
            <div className="carrito-container">
                <h1>{traducir('CART.TITLE')}</h1>
                <p>{traducir('CART.EMPTY')}</p>
            </div>
        );
    }

    const calcularTotal = () => {
        return carrito.items.reduce((total, item) => {
            return (
                total +
                Number(item.producto.precio) * Number(item.cantidad)
            );
        }, 0);
    };

    return (
        <div className="carrito-container">
            <h1>{traducir('CART.TITLE')}</h1>

            <div className="carrito-lista">
                {carrito.items.map((item) => (
                    <div className="carrito-item" key={item.id}>
                        <img
                            src={item.producto.imagen}
                            alt={item.producto.nombre}
                            className="carrito-img"
                        />

                        <div className="carrito-info">
                            <h3>{item.producto.nombre}</h3>

                            <p>
                                {traducir('CART.PRICE')}:{' '}
                                {formatearPrecio(item.producto.precio, i18n.language)}
                            </p>

                            <p>
                                {traducir('CART.QUANTITY')}:{' '}
                                {Number(item.cantidad)}
                            </p>

                            <p>
                                {traducir('CART.SUBTOTAL')}:{' '}
                                {formatearPrecio(
                                    Number(item.producto.precio) * Number(item.cantidad), i18n.language
                                )}
                            </p>

                            <div className="carrito-acciones">
                                <button
                                    className="btn-carrito-dementar"
                                    onClick={() =>
                                        updateProductoCarrito(
                                            item.producto.id,
                                            Number(item.cantidad) - 1
                                        )
                                    }
                                    disabled={Number(item.cantidad) <= 1}
                                >
                                    -
                                </button>

                                <button
                                    className="btn-carrito-incrementar"
                                    onClick={() =>
                                        updateProductoCarrito(
                                            item.producto.id,
                                            Number(item.cantidad) + 1
                                        )
                                    }
                                >
                                    +
                                </button>

                                <button
                                    className="btn-carrito-eliminar"
                                    onClick={() =>
                                        deleteProductoCarrito(
                                            item.producto.id
                                        )
                                    }
                                >
                                    {traducir('CART.DELETE')}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="carrito-total">
                {traducir('CART.TOTAL')}: {formatearPrecio(calcularTotal(), i18n.language)}
            </h2>

            <button className="btn-checkout" onClick={() => navigate('/checkout')}>
                {traducir('CHECKOUT.TITLE')}
            </button>
        </div>
    );
}

export default Carrito;