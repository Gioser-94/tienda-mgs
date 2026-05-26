import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'
import { adminService } from '../../services/Admin/adminService';
import { API_ERRORS } from '../../constants/apiErrors';
import { obtenerErrorApi } from '../../utils/apiErrorHandler';
import { formatearPrecio } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import Spinner from '../ui/spinner/Spinner';
import './Admin.css';

const FORMULARIO_VACIO = {
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: '',
    categoria_id: '',
    especificaciones: '',
    descuento: '',
    stock: ''
}

function AdminProductos() {
  const { t: traducir, i18n } = useTranslation();
  const { mostrarToast } = useToast();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorServidor, setErrorServidor] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formData, setFormData] = useState(FORMULARIO_VACIO);


  useEffect(() => {
    cargarDatos()
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setErrorServidor('');
      const [dataProductos, dataCategorias] = await Promise.all([
        adminService.getTodosProductos(),
        adminService.getCategorias()
      ]);
      setProductos(dataProductos.productos);
      setCategorias(dataCategorias.categorias);
    } catch (error) {
      const codigoError = obtenerErrorApi(error, API_ERRORS.PRODUCTS_LOAD_FAILED);
      setErrorServidor(traducir(`API_ERRORS.${codigoError}`));
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto)
    setFormData({
      nombre:           producto.nombre,
      descripcion:      producto.descripcion || '',
      imagen:           producto.imagen.split('/').pop(),
      precio:           producto.precio,
      categoria_id:     producto.categoria_id,
      especificaciones: JSON.stringify(producto.especificaciones),
      descuento:        producto.descuento || '',
      stock:            producto.stock
    })
    setMostrarFormulario(true)
  };

  const handleNuevo = () => {
    setProductoEditando(null)
    setFormData(FORMULARIO_VACIO)
    setMostrarFormulario(true)
  };

  const handleCancelar = () => {
    setMostrarFormulario(false)
    setProductoEditando(null)
    setFormData(FORMULARIO_VACIO)
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const datos = {
        ...formData,
        precio:           parseFloat(formData.precio),
        categoria_id:     parseInt(formData.categoria_id),
        stock:            parseInt(formData.stock),
        descuento:        formData.descuento ? parseFloat(formData.descuento) : null,
        especificaciones: JSON.parse(formData.especificaciones.trim())
      };

      if (productoEditando) {
        await adminService.actualizarProducto(productoEditando.id, datos);
        mostrarToast(traducir('ADMIN.TOAST_PRODUCT_UPDATED'));
      } else {
        await adminService.crearProducto(datos);
        mostrarToast(traducir('ADMIN.TOAST_PRODUCT_CREATED'));
      }

      handleCancelar();
      cargarDatos();
    } catch (error) {
      const codigoError = obtenerErrorApi(
        error,
        productoEditando
          ? API_ERRORS.PRODUCTS_UPDATE_FAILED
          : API_ERRORS.PRODUCTS_CREATE_FAILED
      );
      mostrarToast(traducir(`API_ERRORS.${codigoError}`), 'error');
    }
  };

  const handleToggleActivo = async (id, activoActual) => {
    const accion = activoActual ? traducir('ADMIN.DEACTIVATE') : traducir('ADMIN.ACTIVATE');
    if (!window.confirm(traducir('ADMIN.CONFIRM_TOGGLE_PRODUCT', { accion }))) return

    try {
      await adminService.actualizarProducto(id, { activo: !activoActual });
      mostrarToast(traducir('ADMIN.TOAST_PRODUCT_TOGGLED'));
      cargarDatos();
    } catch (error) {
      const codigoError = obtenerErrorApi(error, API_ERRORS.PRODUCTS_UPDATE_FAILED);
      mostrarToast(traducir(`API_ERRORS.${codigoError}`), 'error');
    }
  }

  if (cargando) return <Spinner />
  if (errorServidor) return <p className="errorAdmin">{errorServidor}</p>

  return (
    <div>
      <div className="cabeceraSeccionAdmin">
        <h2 className="tituloSeccionAdmin">{traducir('ADMIN.PRODUCTS_TITLE')}</h2>
        <button className="botonExitoAdmin" onClick={handleNuevo}>
          {traducir('ADMIN.NEW_PRODUCT')}
        </button>
      </div>

      {/* FORMULARIO CREAR / EDITAR */}
      {mostrarFormulario && (
        <div className="formularioAdmin">
          <h3 className="tituloFormularioAdmin">
            {productoEditando ? traducir('ADMIN.EDIT_PRODUCT') : traducir('ADMIN.CREATE_PRODUCT')}
          </h3>

          <form onSubmit={handleSubmit} className="gridFormularioAdmin">
            <div className="grupoFormularioAdmin">
              <label>{traducir('ADMIN.FIELD_NAME')}</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grupoFormularioAdmin">
              <label>{traducir('ADMIN.FIELD_IMAGE')}</label>
              <input
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="producto.jpg"
                required
              />
            </div>

            <div className="grupoFormularioAdmin">
              <label>{traducir('ADMIN.FIELD_PRICE')}</label>
              <input
                name="precio"
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grupoFormularioAdmin">
              <label>{traducir('ADMIN.FIELD_STOCK')}</label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grupoFormularioAdmin">
              <label>{traducir('ADMIN.FIELD_CATEGORY')}</label>
              <select
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                required
              >
                <option value="">{traducir('ADMIN.SELECT_CATEGORY')}</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div className="grupoFormularioAdmin">
              <label>{traducir('ADMIN.FIELD_DISCOUNT')}</label>
              <input
                name="descuento"
                type="number"
                step="0.01"
                value={formData.descuento}
                onChange={handleChange}
              />
            </div>

            <div className="grupoFormularioAdmin grupoCompleto">
              <label>{traducir('ADMIN.FIELD_DESCRIPTION')}</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={2}
              />
            </div>

            <div className="grupoFormularioAdmin grupoCompleto">
              <label>{traducir('ADMIN.FIELD_SPECS')}</label>
              <textarea
                name="especificaciones"
                value={formData.especificaciones}
                onChange={handleChange}
                rows={3}
                placeholder='{"clave": "valor"}'
                required
              />
            </div>

            <div className="accionesFormularioAdmin">
              <button type="submit" className="botonExitoAdmin">
                {productoEditando ? traducir('ADMIN.SAVE') : traducir('ADMIN.CREATE_PRODUCT')}
              </button>
              <button
                type="button"
                className="botonPeligroAdmin"
                onClick={handleCancelar}
              >
                {traducir('ADMIN.CANCEL')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLA */}
      <table className="tablaAdmin">
        <thead>
          <tr>
            <th>{traducir('ADMIN.COL_ID')}</th>
            <th>{traducir('ADMIN.COL_IMAGE')}</th>
            <th>{traducir('ADMIN.COL_NAME')}</th>
            <th>{traducir('ADMIN.COL_PRICE')}</th>
            <th>{traducir('ADMIN.COL_STOCK')}</th>
            <th>{traducir('ADMIN.COL_CATEGORY')}</th>
            <th>{traducir('ADMIN.COL_ACTIVE')}</th>
            <th>{traducir('ADMIN.COL_ACTIONS')}</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="imagenTablaAdmin"
                />
              </td>
              <td>{producto.nombre}</td>
              <td className="celda-precio">{formatearPrecio(producto.precio, i18n.language)}</td>
              <td>{producto.stock}</td>
              <td>{producto.categoria.nombre}</td>
              <td>
                <span className={`badgeRol ${producto.activo ? 'admin' : 'cliente'}`}>
                  {producto.activo ? traducir('ADMIN.STATUS_ACTIVE') : traducir('ADMIN.STATUS_INACTIVE')}
                </span>
              </td>
              <td className="accionesAdmin">
                <button
                  className="botonSecundarioAdmin"
                  onClick={() => handleEditar(producto)}
                >
                  {traducir('ADMIN.EDIT')}
                </button>
                <button
                  className={producto.activo ? 'botonPeligroAdmin' : 'botonExitoAdmin'}
                  onClick={() => handleToggleActivo(producto.id, producto.activo)}
                >
                  {producto.activo ? traducir('ADMIN.DEACTIVATE') : traducir('ADMIN.ACTIVATE')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminProductos