import api from '../api';

export const productoService = {
    async obtenerProductos() {
        const response = await api.get('/products');
        return response.data.productos;
    },

    async obtenerProductoPorId(id) {
        const response = await api.get(`/products/${id}`);
        return response.data.producto;
    },

    async buscarProductos(texto) {
        const response = await api.get('/products/search', {
            params: {
                q: texto
            }
        });
        return response.data.productos;
    }
}
