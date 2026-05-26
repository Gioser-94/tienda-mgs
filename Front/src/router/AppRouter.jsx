import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from '../components/auth/PrivateRoute';
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Registro from "../pages/Registro/Registro";
import Perfil from "../pages/Perfil/Perfil";
import Carrito from "../pages/Carrito/Carrito";
import ProductoDetalle from "../pages/ProductoDetalle/ProductoDetalle";
import Contacto from "../pages/Contacto/Contacto";
import Acerca from "../pages/Acerca/Acerca";
import AdminRoute from '../components/auth/AdminRoute';
import Admin from '../pages/Admin/Admin';
import Checkout from '../pages/Checkout/Checkout';
import PedidoConfirmado from '../pages/PedidoConfirmado/PedidoConfirmado';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>

        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route
            path="/perfil"
            element={
                <PrivateRoute>
                    <Perfil />
                </PrivateRoute>
            }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />
        <Route path="carrito" element={<Carrito />} />
        <Route
            path="checkout"
            element={
                <PrivateRoute>
                    <Checkout />
                </PrivateRoute>
            }
        />
        <Route path="pedido-confirmado" element={<PedidoConfirmado />} />
        <Route path="producto/:id" element={<ProductoDetalle />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="acerca" element={<Acerca />} />

      </Route>
    </Routes>
  );
}

export default AppRouter;