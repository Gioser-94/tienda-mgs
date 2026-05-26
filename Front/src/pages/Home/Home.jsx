import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "./Home.css";
import ProductoCard from "../../components/products/ProductoCard";
import Carousel from "../../components/carousel/Carousel";
import Spinner from "../../components/ui/spinner/Spinner";
import { productoService } from "../../services/Productos/productoService";
import { API_ERRORS } from "../../constants/apiErrors";
import { obtenerErrorApi } from "../../utils/apiErrorHandler";
import api from "../../services/api";

function Home() {
  const [productos, setProductos] = useState([])
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas')
  const [cargando, setCargando] = useState(true)
  const [errorServidor, setErrorServidor] = useState("")
  const { t: traducir } = useTranslation()

  const mezclar = (array) => {
    return [...array].sort(() => Math.random() - 0.5)
  }

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true)
        setErrorServidor("")

        const [dataProductos, dataCategorias] = await Promise.all([
          productoService.obtenerProductos(),
          api.get('/categories')
        ])

        const mezclados = mezclar(dataProductos)
        setProductos(mezclados)
        setProductosFiltrados(mezclados)
        setCategorias(dataCategorias.data.categorias)

      } catch (error) {
        const codigoError = obtenerErrorApi(error, API_ERRORS.PRODUCTS_LOAD_FAILED)
        setErrorServidor(traducir(`API_ERRORS.${codigoError}`))
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [])

  const handleFiltrarCategoria = (e) => {
    const valor = e.target.value
    setCategoriaSeleccionada(valor)

    if (valor === 'todas') {
      setProductosFiltrados(productos)
    } else {
      const filtrados = productos.filter(p => String(p.categoria_id) === valor)
      setProductosFiltrados(filtrados)
    }
  }

  if (cargando) return <Spinner />

  if (errorServidor) {
    return (
      <div className="error-container">
        <h3>{traducir("PRODUCT.ERROR_LOADING")}</h3>
        <p className="error-message">{errorServidor}</p>
        <button onClick={() => globalThis.location.reload()}>
          {traducir("COMMON.RETRY")}
        </button>
      </div>
    )
  }

  return (
    <>
      <Carousel productos={productos} />
      <div className="home">
        <div className="homeHeader">
          <h2 className="productos-destacados">
            {traducir("NAVBAR.PRODUCTS")}
          </h2>

          <select
            className="selectCategoria"
            value={categoriaSeleccionada}
            onChange={handleFiltrarCategoria}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map(c => (
              <option key={c.id} value={String(c.id)}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid-productos">
          {productosFiltrados.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Home