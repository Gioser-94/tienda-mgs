 export class Producto {
    constructor(id, nombre, descripcion, precio, stock, imagen, categoria_id, especificaciones = {}, descuento = 0) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.stock = stock;
        this.imagen = imagen;
        this.categoria_id = categoria_id;
        this.especificaciones = especificaciones;
        this.descuento = descuento;
    }
}

    /* VER COMPATIBILIDAD YA QUE ESTAS FUNCIONES SON A MEDIDA DEL ANTIGUO CONSTRUCTOR
    mostrarResumen() {
        const precioFinal = this.aplicarDescuento(this.descuento);

        // Si no hay descuento, muestra precio normal
        if (this.descuento === 0){
            return `
                <div class="producto-resumen">
                <h3 class="producto-nombre">${this.nombre}</h3>
                <p class="producto-precio">${this.precio.toFixed(2)} €</p>
                </div>
            `;
        }

        // Si hay descuento, muestra precio tachado y precio final
        return `
            <div class="producto-resumen">
                <h3 class="producto-nombre">${this.nombre}</h3>
                <p class="producto-precio-original"><s>${this.precio.toFixed(2)} €</s></p>
                <p class="producto-precio-descuento">${precioFinal.toFixed(2)} € (-${this.descuento}%)</p>
            </div>
        `;
    }

    aplicarDescuento(porcentaje) {
        if (porcentaje <= 0) return this.precio;
        const descuento = this.precio * (porcentaje / 100);
        return this.precio - descuento;
    }

    // Metodo para filtrar en la barra de búsqueda por tipo de producto también.
    esDeCategoria(categoriaBuscada) {
        return this.tipo.toLowerCase() === categoriaBuscada.toLowerCase();
    }
*/
