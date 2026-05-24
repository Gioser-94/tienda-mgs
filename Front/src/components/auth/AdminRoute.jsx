import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../ui/spinner/Spinner'

function AdminRoute({ children }) {
  const { usuario, cargandoAuth } = useAuth()

  if (cargandoAuth) {
    return <Spinner />
  }

  if (!usuario || usuario.rol !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute