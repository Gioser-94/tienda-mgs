import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { adminService } from '../../services/Admin/adminService';
import { API_ERRORS } from '../../constants/apiErrors';
import { obtenerErrorApi } from '../../utils/apiErrorHandler';
import { useToast } from '../../context/ToastContext';
import Spinner from '../ui/spinner/Spinner';
import './Admin.css';

function AdminUsuarios() {
  const { t: traducir } = useTranslation();
  const { mostrarToast } = useToast();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState('');

  useEffect(() => {
    cargarUsuarios()
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true)
      setErrorServidor('');
      const data = await adminService.getUsuarios();
      setUsuarios(data.usuarios);
    } catch (error) {
      const codigoError = obtenerErrorApi(error, API_ERRORS.USERS_LOAD_FAILED);
      setErrorServidor(traducir(`API_ERRORS.${codigoError}`));
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarRol = async (id, rolActual) => {
    const nuevoRol = rolActual === 'admin' ? 'cliente' : 'admin'
    if (!window.confirm(traducir('ADMIN.CONFIRM_CHANGE_ROLE', { rol: nuevoRol }))) return

    try {
      await adminService.cambiarRol(id, nuevoRol);
      mostrarToast(traducir('ADMIN.TOAST_USER_ROLE_CHANGED'));
      cargarUsuarios();
    } catch (error) {
      const codigoError = obtenerErrorApi(error, API_ERRORS.USERS_UPDATE_FAILED);
      mostrarToast(traducir(`API_ERRORS.${codigoError}`), 'error');
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm(traducir('ADMIN.CONFIRM_DELETE_USER'))) return

    try {
      await adminService.eliminarUsuario(id);
      mostrarToast(traducir('ADMIN.TOAST_USER_DELETED'));
      cargarUsuarios();
    } catch (error) {
      const codigoError = obtenerErrorApi(error, API_ERRORS.USERS_DELETE_FAILED);
      mostrarToast(traducir(`API_ERRORS.${codigoError}`), 'error');
    }
  };

  if (cargando) return <Spinner />
  if (errorServidor) return <p className="errorAdmin">{errorServidor}</p>

  return (
    <div>
      <h2 className="tituloSeccionAdmin">{traducir('ADMIN.USERS_TITLE')}</h2>

      <table className="tablaAdmin">
        <thead>
          <tr>
            <th>{traducir('ADMIN.COL_ID')}</th>
            <th>{traducir('ADMIN.COL_EMAIL')}</th>
            <th>{traducir('ADMIN.COL_ROLE')}</th>
            <th>{traducir('ADMIN.COL_REGISTERED')}</th>
            <th>{traducir('ADMIN.COL_ACTIONS')}</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.email}</td>
              <td>
                <span className={`badgeRol ${usuario.rol}`}>
                  {usuario.rol}
                </span>
              </td>
              <td>{new Date(usuario.created_at).toLocaleDateString()}</td>
              <td className="accionesAdmin">
                <button
                  className="botonSecundarioAdmin"
                  onClick={() => handleCambiarRol(usuario.id, usuario.rol)}
                >
                  {usuario.rol === 'admin' ? traducir('ADMIN.MAKE_CLIENT') : traducir('ADMIN.MAKE_ADMIN')}
                </button>
                <button
                  className="botonPeligroAdmin"
                  onClick={() => handleEliminar(usuario.id)}
                >
                  {traducir('ADMIN.DELETE')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminUsuarios