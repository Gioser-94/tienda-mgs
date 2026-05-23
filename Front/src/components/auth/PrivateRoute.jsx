import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/spinner/Spinner';

/* eslint-disable react/prop-types */

function PrivateRoute({ children }) {
    const { estaLogueado, cargandoAuth } = useAuth();

    if (cargandoAuth) {
        return <Spinner />;
    }

    if (!estaLogueado) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;