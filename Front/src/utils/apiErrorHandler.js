import { API_ERRORS } from '../constants/apiErrors';

export const obtenerErrorApi = (error, fallback = API_ERRORS.UNKNOWN) => {
    if (error.response?.status === 401) {
        return API_ERRORS.SESSION_EXPIRED;
    }

    return fallback;
};