import api from '../api'

export const adminService = {
  // Pedidos
  async getPedidos() {
    const response = await api.get('/orders')
    return response.data
  },

  async actualizarEstadoPedido(id, estado) {
    const response = await api.put(`/orders/${id}/estado`, { estado })
    return response.data
  },

  async eliminarPedido(id) {
    const response = await api.delete(`/orders/${id}`)
    return response.data
  },

  // Usuarios
  async getUsuarios() {
    const response = await api.get('/users')
    return response.data
  },

  async cambiarRol(id, rol) {
    const response = await api.put(`/users/${id}/rol`, { rol })
    return response.data
  },

  async eliminarUsuario(id) {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  // Productos
  async crearProducto(producto) {
    const response = await api.post('/products', producto)
    return response.data
  },

  async actualizarProducto(id, producto) {
    const response = await api.put(`/products/${id}`, producto)
    return response.data
  },

  async eliminarProducto(id) {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  async getTodosProductos() {
    const response = await api.get('/products/all')
    return response.data
  },

  async getCategorias() {
    const response = await api.get('/categories')
    return response.data
  },
}