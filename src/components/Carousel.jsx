import { useState, useEffect } from 'react'
import './Carousel.css'
import { productos } from '../data/productos'

/* eslint-disable react/prop-types */

function Carousel() {
    // Estado para el índice actual de la imagen
    const [indice, setIndice] = useState(0)

    // Array con imágenes de productos
    const categorias = ['Procesador', 'Grafica', 'Placa Base', 'Memoria RAM', 'Disco Duro', 'Teclado', 'Raton', 'Auriculares']
    // ?.imagen devuelve la imagen si la encuentra y si no la encuentra
    // devuelve undefined, entonces con .filter, borramos ese undefined
    // del array para que quede limpio, evitando errores
    const imagenes = categorias
        .map(categoria => productos.find(p => p.tipo === categoria)?.imagen)
        .filter(Boolean)
        
    // Función para ir a la siguiente imagen
    const siguiente = () => {
        setIndice((indice + 1) % imagenes.length) // vuelve a 0 al llegar al final
    }

    // Función para ir a la imagen anterior
    const anterior = () => {
        setIndice((indice - 1 + imagenes.length) % imagenes.length) // vuelve al final si está en 0
    }

    // Auto-avance cada 4 segundos
    useEffect(() => {
        const intervalo = setInterval(siguiente, 4000)
        return () => clearInterval(intervalo) // limpia el intervalo al desmontar
    }, [indice]) // Se reinicia cada vez que cambia el índice

    return (
        <div className="carousel">
            <button className="carousel-btn prev" onClick={anterior}>❮</button>

            <div className="carousel-track" style={{ transform: `translateX(-${indice * 100}%)` }}> 
                {imagenes.map((img, i) => (
                    <img
                        key={i}
                        src={`/img/${img}`}
                        alt={img}
                        className='slide'
                    />
                ))} 
            </div>

            <button className="carousel-btn next" onClick={siguiente}>❯</button>
        </div>
    )
}

export default Carousel
