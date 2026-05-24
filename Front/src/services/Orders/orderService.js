import api from '../api'

export const orderService = {
  async crearPedido(pedido) {
    const response = await api.post('/orders', pedido)
    return response.data
  },

  async getMisPedidos() {
    const response = await api.get('/orders/me')
    return response.data
  },

  async getPedidosPorEmail(email) {
    const response = await api.get(`/orders/email/${email}`)
    return response.data
  }
}