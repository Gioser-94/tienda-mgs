import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/Auth/authService';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const [cargandoAuth, setCargandoAuth] = useState(true);

    useEffect(() => {
        const comprobarSesion = async () => {
            try {
                const data = await authService.me();
                setUsuario(data.usuario);
            } catch {
                setUsuario(null);
            } finally {
                setCargandoAuth(false);
            }
        };

        comprobarSesion();
    }, []);

    const value = {
        usuario,
        setUsuario,
        cargandoAuth,
        estaLogueado: usuario !== null
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;