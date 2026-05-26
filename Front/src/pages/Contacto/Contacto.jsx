import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { traducirError } from '../../utils/errorTranslator'
import { validarNombre, validarEmail, validarMensaje, validarAsunto } from '../../utils/validators'
import Spinner from '../../components/ui/spinner/Spinner'
import './Contacto.css'

const FORMULARIO_VACIO = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: ''
}

function Contacto() {
    const { t: traducir } = useTranslation()

    const [formData, setFormData] = useState(FORMULARIO_VACIO)
    const [errores, setErrores] = useState({})
    const [cargando, setCargando] = useState(false)
    const [enviado, setEnviado] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setErrores((prev) => ({ ...prev, [name]: null }))
    }

    const validarFormulario = () => {
        const nuevosErrores = {
            nombre:  validarNombre(formData.nombre),
            email:   validarEmail(formData.email),
            asunto:  validarAsunto(formData.asunto),
            mensaje: validarMensaje(formData.mensaje)
        }
        setErrores(nuevosErrores)
        return !Object.values(nuevosErrores).some((e) => e !== null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validarFormulario()) return

        setCargando(true)

        // Simulamos el envío con un pequeño delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setCargando(false)
        setEnviado(true)
        setFormData(FORMULARIO_VACIO)
        setErrores({})
    }

    const handleNuevoMensaje = () => {
        setEnviado(false)
    }

    if (enviado) {
        return (
            <div className="contacto-exito">
                <div className="contacto-exito-icono">✓</div>
                <h2>{traducir('CONTACT.SUCCESS_TITLE')}</h2>
                <p>{traducir('CONTACT.SUCCESS_MESSAGE')}</p>
                <button className="contacto-btn" onClick={handleNuevoMensaje}>
                    {traducir('CONTACT.NEW_MESSAGE')}
                </button>
            </div>
        )
    }

    return (
        <div className="contacto-container">
            {cargando && <Spinner />}

            <h1 className="contacto-titulo">{traducir('CONTACT.TITLE')}</h1>

            <div className="contacto-contenido">

                {/* INFO */}
                <aside className="contacto-info">
                    <h2>{traducir('CONTACT.INFO_TITLE')}</h2>

                    <div className="contacto-info-item">
                        <span className="contacto-info-icono">✉</span>
                        <div>
                            <p className="contacto-info-label">{traducir('CONTACT.EMAIL')}</p>
                            <p className="contacto-info-valor">contacto@mgscomponents.com</p>
                        </div>
                    </div>

                    <div className="contacto-info-item">
                        <span className="contacto-info-icono">☎</span>
                        <div>
                            <p className="contacto-info-label">{traducir('CONTACT.PHONE')}</p>
                            <p className="contacto-info-valor">+34 916 123 456</p>
                        </div>
                    </div>

                    <div className="contacto-info-item">
                        <span className="contacto-info-icono">📍</span>
                        <div>
                            <p className="contacto-info-label">{traducir('CONTACT.ADDRESS')}</p>
                            <p className="contacto-info-valor">Avenida de Portugal 24, 28935 Móstoles</p>
                        </div>
                    </div>

                    <div className="contacto-info-item">
                        <span className="contacto-info-icono">🕐</span>
                        <div>
                            <p className="contacto-info-label">{traducir('CONTACT.HOURS')}</p>
                            <p className="contacto-info-valor">{traducir('CONTACT.HOURS_VALUE')}</p>
                        </div>
                    </div>
                </aside>

                {/* FORMULARIO */}
                <section className="contacto-formulario">
                    <h2>{traducir('CONTACT.FORM_TITLE')}</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="contacto-grupo">
                            <label htmlFor="nombre">{traducir('CONTACT.NAME')}</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder={traducir('CONTACT.NAME')}
                            />
                            <div className="error">{traducirError(errores.nombre, traducir)}</div>
                        </div>

                        <div className="contacto-grupo">
                            <label htmlFor="email">{traducir('CONTACT.EMAIL')}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder={traducir('CONTACT.EMAIL')}
                            />
                            <div className="error">{traducirError(errores.email, traducir)}</div>
                        </div>

                        <div className="contacto-grupo">
                            <label htmlFor="asunto">{traducir('CONTACT.SUBJECT')}</label>
                            <select
                                id="asunto"
                                name="asunto"
                                value={formData.asunto}
                                onChange={handleChange}
                            >
                                <option value="">{traducir('CONTACT.SUBJECT')}</option>
                                <option value="consulta">{traducir('CONTACT.SUBJECT_QUERY')}</option>
                                <option value="pedido">{traducir('CONTACT.SUBJECT_ORDER')}</option>
                                <option value="devolucion">{traducir('CONTACT.SUBJECT_RETURN')}</option>
                                <option value="otro">{traducir('CONTACT.SUBJECT_OTHER')}</option>
                            </select>
                            <div className="error">{traducirError(errores.asunto, traducir)}</div>
                        </div>

                        <div className="contacto-grupo">
                            <label htmlFor="mensaje">{traducir('CONTACT.MESSAGE')}</label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                rows={5}
                                value={formData.mensaje}
                                onChange={handleChange}
                                placeholder={traducir('CONTACT.MESSAGE_PLACEHOLDER')}
                            />
                            <div className="error">{traducirError(errores.mensaje, traducir)}</div>
                        </div>

                        <button
                            type="submit"
                            className="contacto-btn"
                            disabled={cargando}
                        >
                            {cargando
                                ? traducir('CONTACT.SENDING')
                                : traducir('CONTACT.SEND')}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    )
}

export default Contacto