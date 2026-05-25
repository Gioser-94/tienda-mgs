import api from '../api';

export const getCarrito = async () => {
    const response = await api.get('/cart');
    return response.data;
};

export const addItemCarrito = async (productoId, cantidad = 1) => {
    const response = await api.post('/cart/items', {
        productoId,
        cantidad
    });

    return response.data;
};

export const updateItemCarrito = async (productId, cantidad) => {
    const response = await api.put(`/cart/items/${productId}`, {
        cantidad
    });

    return response.data;
};

export const deleteItemCarrito = async (productId) => {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
};

export const clearCarrito = async () => {
    const response = await api.delete('/cart');
    return response.data;
};