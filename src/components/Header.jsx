import { useState, useEffect } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'
import logo from '../assets/img/Logo.png'
import { productos } from '../data/productos'

function Header() {

    // Estados
    const [usuario, setUsuario] = useState(null)
    const [carrito, setCarrito] = useState([])
    const [textoBusqueda, setTextoBusqueda] = useState('')
    const [resultados, setResultados] = useState([])

    // Efecto que se ejecuta al cargar (como onload)
    useEffect(() => {
        // Comprobar usuario logeado
        const datos = sessionStorage.getItem('usuarioLogueado')
        if (datos) {
            setUsuario(JSON.parse(datos))
        }

        // Cargar carrito inicial
        actualizarCarrito()

        // Escucha cambios del carrito
        // carrito-cambiado es un evento personalizado que nosotros creamos para
        // la comunicación entre el detalle del producto y el header cuando se 
        // acciona el boton de añadir al carrito
        window.addEventListener('carrito-cambiado', actualizarCarrito)

        // Cleanup: elilminar el listener cuando el componente se desmonte
        return () => {
            window.removeEventListener('carrito-cambiado', actualizarCarrito)
        }
    }, [])

    // Funciones auxiliares
    const contarProductos = () => {
        return carrito.reduce((acc, item) => acc + item.cantidad, 0)
    }

    const cerrarSesion = () => {
        sessionStorage.removeItem('usuarioLogueado')
        setUsuario(null)
        window.location.href = '/'
    }

    const actualizarCarrito = () => {
        try {
            const datos = localStorage.getItem('carrito')
            const carritoData = datos ? JSON.parse(datos) : []
            setCarrito(carritoData)
        } catch (error) {
            console.error('Error al cargar el carrito', error)
            setCarrito([])
        }
    }

    const buscarProductos = (texto) => {
        // Se llama de primeras a este metodo para que cada vez que el usuario
        // escriba una letra, el estado se va actualizando constantemente
        setTextoBusqueda(texto)

        if (!texto.trim()) {
            setResultados([])
            return
        }

        const filtrados = productos.filter(p =>
            p.nombre.toLowerCase().includes(texto.toLowerCase()) ||
            p.descripcion.toLowerCase().includes(texto.toLowerCase()) ||
            p.esDeCategoria(texto)
        )

        setResultados(filtrados)
    }

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
                    placeholder="Buscar productos..."
                    value={textoBusqueda}
                    // Cada vez que el valor del input cambia, se ejecuta la busqueda de nuevo,
                    // con cada letra que se escribe o se borra, gracias al evento onChange
                    onChange={(e) => buscarProductos(e.target.value)}
                />
                <button id="btn-buscar">🔍</button>
                {/* 
                        Solo muestra algo si el usuario ha escrito
                        Funcionamiento de &&: es un condicional, el cual se lee de izquierda a derecha,
                        si la primera condicion devuelve false, se para y no redenriza nada, si es true, renderiza
                        lo que va a continuación de && 
                    */}
                {textoBusqueda.trim() !== '' && (
                    resultados.length > 0 ? (
                        <div id="resultados-busqueda" className="resultados-busqueda">
                            {/* 
                                .map() recorre el array 'resultados' y por cada producto 'p' crea un <div> con un <Link> dentro.
                                No imprime directamente, sino que devuelve un ARRAY de elementos JSX: [<div>...</div>, <div>...</div>, ...]
                                React recibe ese array y automáticamente renderiza cada elemento en el DOM, mostrándolos uno tras otro.
                            */}
                            {resultados.map(p => (
                                <div className='resultado-item'  key={p.id}> {/*Identificardor de cada elemento de una lista que requiere React*/}
                                    <Link
                                        to={`/producto/${p.id}`}
                                        className='resultado-enlace'
                                        onClick={() => {
                                            setResultados([])
                                            setTextoBusqueda('')
                                        }} 
                                        // Cuando se hace click en un resultado, limpiamos la lista
                                        // para que desaparezca el desplegable
                                    >
                                        {p.nombre}
                                    </Link>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div id="resultados-busqueda" className="resultados-busqueda">
                            No se encontraron productos
                        </div>
                    )
                )}
            </div>

            <div className="usuario" id="zona-usuario">
                {usuario ? (
                    <>
                        <span>👋 Hola, {usuario.nombre}</span> |
                        <Link to="/perfil">Mi perfil</Link> |
                        <Link to="/carrito">Carrito</Link> |
                        <button className='cerrarSesion' onClick={cerrarSesion}>Cerrar sesión</button> |
                    </>
                ) : (
                    <>
                        <Link to="/login">Iniciar sesión</Link> |
                        <Link to="/registro">Registrarse</Link> |
                        <Link to="/carrito">🛒 Carrito ({contarProductos()})</Link>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header