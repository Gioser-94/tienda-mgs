import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './Footer.css';

function Footer() {
    const { t: traducir } = useTranslation();
    return (
        <footer className="footer">
            <div className="info-footer">
                <p>{traducir('FOOTER.RIGHTS')}.</p>
                <Link to={'/contacto'} className="footer-link">{traducir('FOOTER.CONTACT')}</Link>
                <Link to={'/acerca'} className="footer-link">{traducir('FOOTER.ABOUT')}</Link>
            </div>
        </footer>
    )
}

export default Footer