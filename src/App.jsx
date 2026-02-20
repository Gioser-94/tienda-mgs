import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Carrito from './pages/Carrito'
import Perfil from './pages/Perfil'
import ProductoDetalle from './pages/ProductoDetalle'
import Contacto from './pages/Contacto'
import Footer from './components/Footer'
import Acerca from './pages/Acerca'

function App() {
  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Header />
        <main>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/acerca" element={<Acerca />} />
        </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App