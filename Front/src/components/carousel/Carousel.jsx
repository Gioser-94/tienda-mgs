import { useState, useEffect } from 'react';
import './Carousel.css';

/* eslint-disable react/prop-types */

function Carousel({ productos = [] }) {
    const [indice, setIndice] = useState(0);

    const imagenes = productos
        .map((producto) => producto.imagen)
        .filter(Boolean)
        .sort(() => Math.random() - 0.5);

    const totalImagenes = imagenes.length;

    const siguiente = () => {
        setIndice((indiceActual) =>
            (indiceActual + 1) % totalImagenes
        );
    };

    const anterior = () => {
        setIndice((indiceActual) =>
            (indiceActual - 1 + totalImagenes) % totalImagenes
        );
    };

    useEffect(() => {
        if (totalImagenes === 0) {
            return;
        }

        const intervalo = setInterval(() => {
            setIndice((indiceActual) =>
                (indiceActual + 1) % totalImagenes
            );
        }, 4000);

        return () => clearInterval(intervalo);
    }, [totalImagenes]);


    if (totalImagenes === 0) {
        return null;
    }

    return (
        <div className="carousel">
            <button
                className="carousel-btn prev"
                onClick={anterior}
            >
                ❮
            </button>

            <div
                className="carousel-track"
                style={{
                    transform: `translateX(-${indice * 100}%)`
                }}
            >
                {imagenes.map((imagen, i) => (
                    <img
                        key={imagen}
                        src={imagen}
                        alt={`slide-${i + 1}`}
                        className="slide"
                    />
                ))}
            </div>

            <button
                className="carousel-btn next"
                onClick={siguiente}
            >
                ❯
            </button>
        </div>
    );
}

export default Carousel;