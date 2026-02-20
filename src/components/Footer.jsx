import { Link } from "react-router-dom";
import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="info-footer">
                <p>© 2025 Tienda de Componentes. Todos los derechos reservados.</p>
                <Link to={'/contacto'}>Contacto</Link>
                <Link to={'/acerca'}>Sobre nosotros</Link>
            </div>
        </footer>
    )
}

export default Footer