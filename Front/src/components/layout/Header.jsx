import { useState, useEffect } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/img/Logo.png';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/Auth/authService';
import LanguageSelector from '../ui/language-selector/LanguageSelector';
import { productoService } from '../../services/Productos/productoService';

function Header() {
    const navigate = useNavigate();
    const { t: traducir } = useTranslation();
    const { usuario, setUsuario, estaLogueado } = useAuth();
    const [carrito, setCarrito] = useState([]);
    const [textoBusqueda, setTextoBusqueda] = useState('');
    const [resultados, setResultados] = useState([]);
    const [buscando, setBuscando] = useState(false);

    useEffect(() => {
        actualizarCarrito();

        window.addEventListener(
            'carrito-cambiado',
            actualizarCarrito
        );

        return () => {
            window.removeEventListener(
                'carrito-cambiado',
                actualizarCarrito
            );
        };
    }, []);

    useEffect(() => {
        if (!textoBusqueda.trim()) {
            setResultados([]);
            setBuscando(false);
            return;
        }

        setBuscando(true);

        const timeout = setTimeout(async () => {
            try {
                const data = await productoService.buscarProductos(
                    textoBusqueda
                );

                setResultados(data);
            } catch {
                setResultados([]);
            } finally {
                setBuscando(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [textoBusqueda]);

    const contarProductos = () => {
        return carrito.reduce(
            (acc, item) => acc + item.cantidad,
            0
        );
    };

    const cerrarSesion = async () => {
        try {
            await authService.logout();
        } finally {
            setUsuario(null);
            navigate('/');
        }
    };

    const actualizarCarrito = () => {
        try {
            const datos = localStorage.getItem('carrito');

            const carritoData = datos
                ? JSON.parse(datos)
                : [];

            setCarrito(carritoData);
        } catch {
            setCarrito([]);
        }
    };

    const buscarProductos = (texto) => {
        setTextoBusqueda(texto);
    };

    return (
        <header className="header">
            <Link to="/" className="logo">
                <img src={logo} alt="Logo Tienda" />
                <h1>MGS COMPONENTS</h1>
            </Link>

            <div className="buscador">
                <input
                    type="text"
                    id="input-busqueda"
                    placeholder={traducir('PRODUCT.SEARCH')}
                    value={textoBusqueda}
                    onChange={(e) =>
                        buscarProductos(e.target.value)
                    }
                />

                <button id="btn-buscar">🔍</button>

                {textoBusqueda.trim() !== '' && (
                    <div
                        id="resultados-busqueda"
                        className="resultados-busqueda"
                    >
                        {buscando ? (
                            <div className="resultado-item">
                                {traducir('COMMON.LOADING')}
                            </div>
                        ) : resultados.length > 0 ? (
                            resultados.map((producto) => (
                                <div
                                    className="resultado-item"
                                    key={producto.id}
                                >
                                    <Link
                                        to={`/producto/${producto.id}`}
                                        className="resultado-enlace"
                                        onClick={() => {
                                            setResultados([]);
                                            setTextoBusqueda('');
                                        }}
                                    >
                                        {producto.nombre}
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="resultado-item">
                                {traducir('PRODUCT.NO_RESULTS')}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="usuario" id="zona-usuario">
                {estaLogueado ? (
                    <>
                        <span>
                            👋 {traducir('AUTH.HELLO')},{' '}
                            {usuario.email}
                        </span>

                        {' | '}

                        <Link to="/perfil">
                            {traducir('NAVBAR.PROFILE')}
                        </Link>

                        {' | '}

                        <LanguageSelector />

                        {' | '}

                        <Link to="/carrito">
                            🛒 {traducir('NAVBAR.CART')} (
                            {contarProductos()})
                        </Link>

                        {' | '}

                        <button
                            className="cerrarSesion"
                            onClick={cerrarSesion}
                        >
                            {traducir('AUTH.LOGOUT')}
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            {traducir('AUTH.LOGIN')}
                        </Link>

                        {' | '}

                        <Link to="/registro">
                            {traducir('AUTH.REGISTER')}
                        </Link>

                        {' | '}

                        <LanguageSelector />

                        {' | '}

                        <Link to="/carrito">
                            🛒 {traducir('NAVBAR.CART')} (
                            {contarProductos()})
                        </Link>
                    </>
                )}
            </div>
        </header>
    );
}

export default Header;