import { createContext, useContext, useEffect, useState } from 'react';
import {
    getCarrito,
    addItemCarrito,
    updateItemCarrito,
    deleteItemCarrito,
    clearCarrito
} from '../services/Cart/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const { usuario } = useAuth();

    const [carrito, setCarrito] = useState(null);
    const [cargandoCarrito, setCargandoCarrito] = useState(false);

    const cargarCarrito = async () => {
        try {
            setCargandoCarrito(true);

            const data = await getCarrito();

            setCarrito(data.carrito);
        } catch {
            setCarrito(null);
        } finally {
            setCargandoCarrito(false);
        }
    };

    const addProductoCarrito = async (productoId, cantidad = 1) => {
        await addItemCarrito(productoId, cantidad);
        await cargarCarrito();
    };

    const updateProductoCarrito = async (productId, cantidad) => {
        await updateItemCarrito(productId, cantidad);
        await cargarCarrito();
    };

    const deleteProductoCarrito = async (productId) => {
        await deleteItemCarrito(productId);
        await cargarCarrito();
    };

    const contarProductosCarrito = () => {
        if (!carrito?.items) {
            return 0;
        }

        return carrito.items.reduce(
            (total, item) => total + Number(item.cantidad),
            0
        );
    };

    const vaciarCarrito = async () => {
        await clearCarrito();
        setCarrito(null);
    };

    useEffect(() => {
        if (usuario) {
            cargarCarrito();
        } else {
            setCarrito(null);
        }
    }, [usuario]);

    const value = {
        carrito,
        cargandoCarrito,
        cargarCarrito,
        addProductoCarrito,
        updateProductoCarrito,
        deleteProductoCarrito,
        contarProductosCarrito,
        vaciarCarrito
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;