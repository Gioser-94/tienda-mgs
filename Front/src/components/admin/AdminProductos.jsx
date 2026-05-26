import { useState, useEffect } from 'react'
import { adminService } from '../../services/Admin/adminService'
import { productoService } from '../../services/Productos/productoService'
import './Admin.css'
import api from '../../services/api'

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)

  const formularioVacio = {
    nombre: '',
    descripcion: '',
    imagen: '',
    precio: '',
    categoria_id: '',
    especificaciones: '',
    descuento: '',
    stock: ''
  }

  const [formData, setFormData] = useState(formularioVacio)

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
  try {
    setCargando(true)
    const [dataProductos, dataCategorias] = await Promise.all([
      adminService.getTodosProductos(),
      api.get('/categories')
    ])
    setProductos(dataProductos.productos)
    setCategorias(dataCategorias.data.categorias)
  } catch {
    setError('No se han podido cargar los productos')
  } finally {
    setCargando(false)
  }
}

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

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
  }

  const handleNuevo = () => {
    setProductoEditando(null)
    setFormData(formularioVacio)
    setMostrarFormulario(true)
  }

  const handleCancelar = () => {
    setMostrarFormulario(false)
    setProductoEditando(null)
    setFormData(formularioVacio)
  }

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
      }
      console.log('especificaciones raw:', JSON.stringify(formData.especificaciones))
      if (productoEditando) {
        await adminService.actualizarProducto(productoEditando.id, datos)
      } else {
        await adminService.crearProducto(datos)
      }

      handleCancelar()
      cargarDatos()
    } catch {
      alert('Error al guardar el producto. Revisa que las especificaciones sean JSON válido')
    }
  }

  const handleToggleActivo = async (id, activoActual) => {
    const accion = activoActual ? 'desactivar' : 'activar'
    if (!confirm(`¿${accion} este producto?`)) return

    try {
      await adminService.actualizarProducto(id, { activo: !activoActual })
      cargarDatos()
    } catch {
      alert(`Error al ${accion} el producto`)
    }
  }

  if (cargando) return <p>Cargando productos...</p>
  if (error)    return <p className="errorAdmin">{error}</p>

  return (
    <div>
      <div className="cabeceraSeccionAdmin">
        <h2 className="tituloSeccionAdmin">Productos</h2>
        <button className="botonExitoAdmin" onClick={handleNuevo}>
          + Nuevo producto
        </button>
      </div>

      {/* FORMULARIO CREAR / EDITAR */}
      {mostrarFormulario && (
        <div className="formularioAdmin">
          <h3 className="tituloFormularioAdmin">
            {productoEditando ? 'Editar producto' : 'Nuevo producto'}
          </h3>

          <form onSubmit={handleSubmit} className="gridFormularioAdmin">
            <div className="grupoFormularioAdmin">
              <label>Nombre *</label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grupoFormularioAdmin">
              <label>Imagen (nombre del archivo) *</label>
              <input
                name="imagen"
                value={formData.imagen}
                onChange={handleChange}
                placeholder="producto.jpg"
                required
              />
            </div>

            <div className="grupoFormularioAdmin">
              <label>Precio *</label>
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
              <label>Stock *</label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grupoFormularioAdmin">
              <label>Categoría *</label>
              <select
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona categoría</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </div>

            <div className="grupoFormularioAdmin">
              <label>Descuento (%)</label>
              <input
                name="descuento"
                type="number"
                step="0.01"
                value={formData.descuento}
                onChange={handleChange}
              />
            </div>

            <div className="grupoFormularioAdmin grupoCompleto">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={2}
              />
            </div>

            <div className="grupoFormularioAdmin grupoCompleto">
              <label>Especificaciones (JSON) *</label>
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
                {productoEditando ? 'Guardar cambios' : 'Crear producto'}
              </button>
              <button
                type="button"
                className="botonPeligroAdmin"
                onClick={handleCancelar}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLA */}
      <table className="tablaAdmin">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Activo</th>
            <th>Acciones</th>
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
              <td>{producto.precio}€</td>
              <td>{producto.stock}</td>
              <td>{producto.categoria.nombre}</td>
              <td>
                <span className={`badgeRol ${producto.activo ? 'admin' : 'cliente'}`}>
                  {producto.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="accionesAdmin">
                <button
                  className="botonSecundarioAdmin"
                  onClick={() => handleEditar(producto)}
                >
                  Editar
                </button>
                <button
                  className={producto.activo ? 'botonPeligroAdmin' : 'botonExitoAdmin'}
                  onClick={() => handleToggleActivo(producto.id, producto.activo)}
                >
                  {producto.activo ? 'Desactivar' : 'Activar'}
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