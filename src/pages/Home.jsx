import { useState, useEffect } from "react"
import { productos } from "../data/productos"
import './Home.css'
import ProductoCard from "../components/ProductoCard"
import Carousel from "../components/Carousel"

function Home() {
  return (
    <>
      <Carousel></Carousel>
      <div className="home">
        <h2 className="productos-destacados">Productos destacados</h2>
        <div className="grid-productos">
          {/* 
              .map() recorre el array 'productos' y por cada producto 'p' crea un componente <ProductoCard>
              pasándole el producto completo como prop a través de producto={p}
              key={p.id} es necesario para que React identifique cada elemento de la lista de forma única
          */}
          {productos.map(p => (
            <ProductoCard key={p.id} producto={p}/>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home