import api from '../api';

export const authService =  {
    async register(usuario) {
        const response = await api.post('/auth/register', usuario);
        return response.data;
    },

    async login(credenciales) {
        const response = await api.post('/auth/login', credenciales);
        return response.data;
    },

    async logout() {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    async me() {
        const response = await api.get('/auth/me');
        return response.data;
    }
}