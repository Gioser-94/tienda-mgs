import { useTranslation } from 'react-i18next';
import { acercaEs } from '../assets/i18n/acerca.es';
import { acercaEn } from '../assets/i18n/acerca.en';
import './Acerca.css';

function Acerca() {
    const { i18n } = useTranslation()

    const contenido = i18n.language.startsWith('en') ? acercaEn : acercaEs

    const renderTexto = (texto) => {
        return texto.map((segmento, index) =>
            segmento.tipo === 'negrita'
                ? <strong key={index}>{segmento.contenido}</strong>
                : <span key={index}>{segmento.contenido}</span>
        )
    }

    return (
        <div className="contenedor acerca">
            <h1>{contenido.titulo}</h1>

            <div className="acerca-info">
                {contenido.parrafos.map((parrafo) => (
                    <p key={parrafo.id}>
                        {renderTexto(parrafo.texto)}
                    </p>
                ))}
            </div>

            <div className="acerca-equipo">
                <h2>{contenido.equipo.titulo}</h2>
                <div className="equipo-grid">
                    {contenido.equipo.miembros.map((miembro) => (
                        <div key={miembro.nombre} className="miembro">
                            <h3>{miembro.nombre}</h3>
                            <p>{miembro.descripcion}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Acerca