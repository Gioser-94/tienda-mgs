export const formatearPrecio = (precio) => {
    const precioNumero = Number(precio);

    if (Number.isNaN(precioNumero)) {
        return '0,00 €';
    }

    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(precioNumero);
};

export const calcularPrecioConDescuento = (precio, descuento) => {
    const precioNumero = Number(precio);
    const descuentoNumero = Number(descuento);

    if (
        Number.isNaN(precioNumero) ||
        Number.isNaN(descuentoNumero) ||
        descuentoNumero <= 0
    ) {
        return precioNumero;
    }

    return precioNumero - (precioNumero * descuentoNumero) / 100;
};

export const formatearDescuento = (descuento) => {
    const descuentoNumero = Number(descuento);

    if (Number.isNaN(descuentoNumero) || descuentoNumero <= 0) {
        return null;
    }

    return `-${descuentoNumero}%`;
};

export const formatearStock = (stock) => {
    const stockNumero = Number(stock);

    if (Number.isNaN(stockNumero)) {
        return 0;
    }

    return stockNumero;
};