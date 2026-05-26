import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/toast/Toast';

const ToastContext = createContext();

export const useToast = () => {
    return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const mostrarToast = useCallback((mensaje, tipo = 'success', duracion = 3000) => {
        const id = Date.now();

        setToasts((prev) => [...prev, { id, mensaje, tipo }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duracion);
    }, []);

    const cerrarToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const value = {
        mostrarToast
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Toast toasts={toasts} onCerrar={cerrarToast} />
        </ToastContext.Provider>
    );
};

export default ToastContext;