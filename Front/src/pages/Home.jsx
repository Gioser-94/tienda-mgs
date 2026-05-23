import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import "./Home.css";
import ProductoCard from "../components/products/ProductoCard";
import Carousel from "../components/carousel/Carousel";
import Spinner from "../components/ui/spinner/Spinner";
import { productoService } from "../services/Productos/productoService";
import { API_ERRORS } from "../constants/apiErrors";
import { obtenerErrorApi } from "../utils/apiErrorHandler";

function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState("");
  const { t: traducir } = useTranslation();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        setErrorServidor("");

        const data = await productoService.obtenerProductos();

        setProductos(data);

      } catch (error) {
        const codigoError = obtenerErrorApi(
          error,
          API_ERRORS.PRODUCTS_LOAD_FAILED
        );

        setErrorServidor(
          traducir(`API_ERRORS.${codigoError}`)
        );

      } finally {
        setCargando(false);
      }
    };
    cargarProductos();
  }, []);

  if (cargando) {
    return <Spinner />;
  }

  if (errorServidor) {
    return (
      <div className="error-container">
        <h3>{traducir("PRODUCT.ERROR_LOADING")}</h3>

        <p className="error-message">
          {errorServidor}
        </p>

        <button onClick={() => globalThis.location.reload()}>
          {traducir("COMMON.RETRY")}
        </button>
      </div>
    );
  }

  return (
    <>
      <Carousel productos={productos}/>
      <div className="home">
        <h2 className="productos-destacados">
          {traducir("NAVBAR.PRODUCTS")}
        </h2>
        <div className="grid-productos">
          {/* 
              .map() recorre el array 'productos' y por cada producto 'p' crea un componente <ProductoCard>
              pasándole el producto completo como prop a través de producto={p}
              key={p.id} es necesario para que React identifique cada elemento de la lista de forma única
          */}
          {productos.map((p) => (
            <ProductoCard key={p.id} producto={p} />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
