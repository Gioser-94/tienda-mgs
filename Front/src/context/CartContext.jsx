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
const CARRITO_LOCAL_KEY = 'carrito_invitado'

export const useCart = () => useContext(CartContext)

// ── HELPERS LOCALSTORAGE ──────────────────────────────
const getCarritoLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(CARRITO_LOCAL_KEY)) || []
  } catch {
    return []
  }
}

const setCarritoLocal = (items) => {
  localStorage.setItem(CARRITO_LOCAL_KEY, JSON.stringify(items))
}

const clearCarritoLocal = () => {
  localStorage.removeItem(CARRITO_LOCAL_KEY)
}

export const CartProvider = ({ children }) => {
  const { usuario } = useAuth()
  const [carrito, setCarrito] = useState(null)
  const [carritoLocal, setCarritoLocalState] = useState(getCarritoLocal())
  const [cargandoCarrito, setCargandoCarrito] = useState(false)

  // ── CARGAR CARRITO BACK (logueado) ──────────────────
  const cargarCarrito = async () => {
    try {
      setCargandoCarrito(true)
      const data = await getCarrito()
      setCarrito(data.carrito)
    } catch {
      setCarrito(null)
    } finally {
      setCargandoCarrito(false)
    }
  }

  // ── ADD ─────────────────────────────────────────────
  const addProductoCarrito = async (productoId, cantidad = 1, producto = null) => {
    if (usuario) {
      await addItemCarrito(productoId, cantidad)
      await cargarCarrito()
    } else {
      const items = getCarritoLocal()
      const existe = items.find(i => String(i.productoId) === String(productoId))
      if (existe) {
        existe.cantidad += cantidad
      } else {
        items.push({ productoId, cantidad, producto })
      }
      setCarritoLocal(items)
      setCarritoLocalState([...items])
    }
  }

  // ── UPDATE ───────────────────────────────────────────
  const updateProductoCarrito = async (productoId, cantidad) => {
    if (usuario) {
      await updateItemCarrito(productoId, cantidad)
      await cargarCarrito()
    } else {
      const items = getCarritoLocal().map(i =>
        String(i.productoId) === String(productoId) ? { ...i, cantidad } : i
      )
      setCarritoLocal(items)
      setCarritoLocalState([...items])
    }
  }

  // ── DELETE ───────────────────────────────────────────
  const deleteProductoCarrito = async (productoId) => {
    if (usuario) {
      await deleteItemCarrito(productoId)
      await cargarCarrito()
    } else {
      const items = getCarritoLocal().filter(i =>
        String(i.productoId) !== String(productoId)
      )
      setCarritoLocal(items)
      setCarritoLocalState([...items])
    }
  }

  // ── VACIAR ───────────────────────────────────────────
  const vaciarCarrito = async () => {
    if (usuario) {
      await clearCarrito()
      setCarrito(null)
    } else {
      clearCarritoLocal()
      setCarritoLocalState([])
    }
  }

  // ── CONTAR ───────────────────────────────────────────
  const contarProductosCarrito = () => {
    if (usuario) {
      return carrito?.items?.reduce((t, i) => t + Number(i.cantidad), 0) || 0
    }
    return carritoLocal.reduce((t, i) => t + Number(i.cantidad), 0)
  }

  // ── TOTAL ────────────────────────────────────────────
  const calcularTotalCarrito = () => {
    if (usuario) {
      return carrito?.items?.reduce(
        (t, i) => t + Number(i.producto.precio) * Number(i.cantidad), 0
      ) || 0
    }
    return carritoLocal.reduce(
      (t, i) => t + Number(i.producto?.precio || 0) * Number(i.cantidad), 0
    )
  }

  // ── EFECTO: cargar carrito cuando cambia el usuario ──
  useEffect(() => {
    if (usuario) {
      cargarCarrito()
    } else {
      setCarrito(null)
      setCarritoLocalState(getCarritoLocal())
    }
  }, [usuario])

  const value = {
    carrito,
    carritoLocal,
    cargandoCarrito,
    cargarCarrito,
    addProductoCarrito,
    updateProductoCarrito,
    deleteProductoCarrito,
    contarProductosCarrito,
    vaciarCarrito,
    calcularTotalCarrito,
    estaLogueado: !!usuario
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext