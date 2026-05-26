import { useState } from 'react'
import './Registro.css'
import {Link} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { validarConfirmPassword, validarNombre, validarPassword, validarTelefono, validarEmail } from '../../utils/validators';
import { traducirError } from '../../utils/errorTranslator';
import { authService } from '../../services/Auth/authService';
import { API_ERRORS } from '../../constants/apiErrors';
import { obtenerErrorApi } from '../../utils/apiErrorHandler';
import Spinner from '../../components/ui/spinner/Spinner';

function Registro() {
    const { t: traducir } = useTranslation();

    // Un solo estado para todos los campos del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: '',
        aceptaPolitica: false
    });

    // Un solo estado para todos los errores de formulario
    const [errores, setErrores] = useState({});

    // Estado para error de servidor
    const [errorServidor, setErrorServidor] = useState('');

    // Estado mensaje de exito
    const [mensajeExito, setMensajeExito] = useState('');

    // Estado para la espera de la petición
    const [cargando, setCargando] = useState(false);

    // Función que valida un campo específico en tiempo real
    const validarCampo = (campo, valor, datosActualizados = formData) => {
        let error = null;

        switch (campo) {
            case 'nombre':
                error = validarNombre(valor);
                break;

            case 'email':
                error = validarEmail(valor);
                break;

            case 'telefono':
                error = validarTelefono(valor);
                break;

            case 'password':
                error = validarPassword(valor);
                break;

            case 'confirmPassword':
                error = validarConfirmPassword(
                    datosActualizados.password,
                    valor
                );
                break;
            
            default:
                break;
        }

        setErrores((errores) => ({
            ...errores,
            [campo]: error
        }));

        return error;
    }

    // Handler universal para todos los inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        const nuevoValor = type === 'checkbox' ? checked: value;

        const datosActualizados = {
            ...formData,
            [name]: nuevoValor
        };

        setFormData(datosActualizados);
        
        validarCampo(name, nuevoValor, datosActualizados);

        if (name === 'password' && formData.confirmPassword) {
            validarCampo(
                'confirmPassword',
                formData.confirmPassword,
                datosActualizados
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorServidor('');
        setMensajeExito('');

        const nuevosErrores = {
            nombre: validarNombre(formData.nombre),
            email: validarEmail(formData.email),
            telefono: validarTelefono(formData.telefono),
            password: validarPassword(formData.password),
            confirmPassword: validarConfirmPassword(
                formData.password,
                formData.confirmPassword
            )
        };

        setErrores(nuevosErrores);

        const hayErrores = Object.values(nuevosErrores).some(
            (error) => error !== null
        );

        if (hayErrores || !formData.aceptaPolitica) {
            return;
        }

        try {
            setCargando(true);

            await authService.register({
                email:           formData.email,
                password:        formData.password,
                nombre_completo: formData.nombre, 
                telefono:        formData.telefono  
            });

            setMensajeExito(traducir('AUTH.REGISTER_SUCCESS'));

            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                password: '',
                confirmPassword: '',
                aceptaPolitica: false
            });

            setErrores({});

        } catch (error) {
            const codigoError = obtenerErrorApi(
                error,
                API_ERRORS.REGISTER_FAILED
            );

            setErrorServidor(
                traducir(`API_ERRORS.${codigoError}`)
            );

            setMensajeExito('');

        } finally {
            setCargando(false);
        }
    };

  return (
    <div className="contenedorRegistro">
        {cargando && <Spinner />}
        <h1 className="tituloRegistro">{traducir('AUTH.REGISTER')}</h1>
        <form
            id="formRegistro"
            className="divFormulario"
            onSubmit={handleSubmit}
        >
            <div className="input-container">
                <input
                    type="text"
                    name="nombre"
                    className="input-form"
                    id="nombreCrearCuenta"
                    placeholder={traducir('AUTH.NAME')}
                    value={formData.nombre}
                    onChange={handleChange}
                />
                <div className='error'>
                    {traducirError(errores.nombre, traducir)}
                </div>
            </div>
            <div className="input-container">
                <input
                    type="email"
                    name="email"
                    className="input-form"
                    id="correoCrearCuenta"
                    placeholder={traducir('AUTH.EMAIL')}
                    value={formData.email}
                    onChange={handleChange}
                />
                <div className='error'>
                    {traducirError(errores.email, traducir)}
                </div>
            </div>
            <div className="input-container">
                <input
                    type="text"
                    name="telefono"
                    className="input-form"
                    id="telefonoCrearCuenta"
                    placeholder={traducir('AUTH.PHONE')}
                    value={formData.telefono}
                    onChange={handleChange}
                />
                <div className='error'>
                    {traducirError(errores.telefono, traducir)}
                </div>
            </div>
            <div className="input-container">
                <input
                    type="password"
                    name="password"
                    className="input-form"
                    id="contrasenaCrearCuenta"
                    placeholder={traducir('AUTH.PASSWORD')}
                    value={formData.password}
                    onChange={handleChange}
                />
                <div className='error'>
                    {traducirError(errores.password, traducir)}
                </div>
            </div>
            <div className="input-container">
                <input
                    type="password"
                    name="confirmPassword"
                    className="input-form"
                    id="repetirContrasena"
                    placeholder={traducir('AUTH.CONFIRM_PASSWORD')}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />
                <div className='error'>
                    {traducirError(errores.confirmPassword, traducir)}
                </div>
            </div>
            <div id="radio">
                <input
                    type="checkbox"
                    name="aceptaPolitica"
                    className="input-form"
                    id="radioAceptarPolitica"
                    checked={formData.aceptaPolitica}
                    onChange={handleChange}
                />
                {traducir('AUTH.ACCEPT_PRIVACY')}
                <br/>
            </div>    
            <button
                type="submit"
                className="botonCrearCuenta"
                disabled={cargando}
            >
                {cargando
                        ? traducir('COMMON.LOADING')
                        : traducir('AUTH.CREATE_ACCOUNT')}
            </button>
            {errorServidor && (
                <div className="error mensajeFormulario">
                    {errorServidor}
                </div>
            )}

            {mensajeExito && (
                <div className="success mensajeFormulario">
                    {mensajeExito}
                </div>
            )}
            <br/>
        </form>
        <Link to='/login'>
            {traducir('AUTH.ALREADY_HAVE_ACCOUNT')}
        </Link>
    </div>
  )
}

export default Registro