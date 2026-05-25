import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/Orders/orderService';
import { API_ERRORS } from '../constants/apiErrors';
import { obtenerErrorApi } from '../utils/apiErrorHandler';
import { formatearPrecio } from '../utils/formatters';
import { traducirError } from '../utils/errorTranslator';
import Spinner from '../components/ui/spinner/Spinner';

import {
    validarNombre,
    validarEmail,
    validarTelefono,
    validarDireccion,
    validarCiudad,
    validarCodigoPostal,
    validarPais,
    validarNumeroTarjeta,
    validarCaducidad,
    validarCVV
} from '../utils/validators';

import './Checkout.css';

const PASOS = { PERSONAL: 0, DIRECCION: 1, PAGO: 2 };

function Checkout() {
    const { t: traducir } = useTranslation();
    const navigate = useNavigate();
    const { carrito, vaciarCarrito } = useCart();
    const { usuario } = useAuth();

    const [pasoActual, setPasoActual] = useState(PASOS.PERSONAL);
    const [cargando, setCargando] = useState(false);
    const [errorServidor, setErrorServidor] = useState('');

    const [datosPersonales, setDatosPersonales] = useState({
        nombre: usuario?.nombre || '',
        email: usuario?.email || '',
        telefono: usuario?.telefono || ''
    });

    const [datosDireccion, setDatosDireccion] = useState({
        direccion: '',
        ciudad: '',
        provincia: '',
        codigo_postal: '',
        pais: 'España'
    });

    const [datosPago, setDatosPago] = useState({
        titular: usuario?.nombre || '',
        numero: '',
        caducidad: '',
        cvv: ''
    });

    const [errores, setErrores] = useState({});

    const calcularTotal = () => {
        if (!carrito?.items) return 0;
        return carrito.items.reduce(
            (total, item) => total + Number(item.producto.precio) * Number(item.cantidad),
            0
        );
    };

    const handleChangePersonal = (e) => {
        const { name, value } = e.target;
        setDatosPersonales((prev) => ({ ...prev, [name]: value }));
        setErrores((prev) => ({ ...prev, [name]: null }));
    };

    const handleChangeDireccion = (e) => {
        const { name, value } = e.target;
        setDatosDireccion((prev) => ({ ...prev, [name]: value }));
        setErrores((prev) => ({ ...prev, [name]: null }));
    };

    const handleChangePago = (e) => {
        const { name, value } = e.target;
        setDatosPago((prev) => ({ ...prev, [name]: value }));
        setErrores((prev) => ({ ...prev, [name]: null }));
    };

    const validarPasoPersonal = () => {
        const nuevosErrores = {
            nombre: validarNombre(datosPersonales.nombre),
            email: validarEmail(datosPersonales.email),
            telefono: validarTelefono(datosPersonales.telefono)
        };
        setErrores(nuevosErrores);
        return !Object.values(nuevosErrores).some((e) => e !== null);
    };

    const validarPasoDireccion = () => {
        const nuevosErrores = {
            direccion: validarDireccion(datosDireccion.direccion),
            ciudad: validarCiudad(datosDireccion.ciudad),
            codigo_postal: validarCodigoPostal(datosDireccion.codigo_postal),
            pais: validarPais(datosDireccion.pais)
        };
        setErrores(nuevosErrores);
        return !Object.values(nuevosErrores).some((e) => e !== null);
    };

    const validarPasoPago = () => {
        const nuevosErrores = {
            titular: validarNombre(datosPago.titular),
            numero: validarNumeroTarjeta(datosPago.numero),
            caducidad: validarCaducidad(datosPago.caducidad),
            cvv: validarCVV(datosPago.cvv)
        };
        setErrores(nuevosErrores);
        return !Object.values(nuevosErrores).some((e) => e !== null);
    };

    const handleSiguiente = () => {
        let valido = false;
        if (pasoActual === PASOS.PERSONAL) valido = validarPasoPersonal();
        if (pasoActual === PASOS.DIRECCION) valido = validarPasoDireccion();
        if (valido) {
            setPasoActual((prev) => prev + 1);
            setErrores({});
        }
    };

    const handleVolver = () => {
        setPasoActual((prev) => prev - 1);
        setErrores({});
    };

    const handleConfirmar = async () => {
        if (!validarPasoPago()) return;

        setErrorServidor('');
        setCargando(true);

        try {
            const productos = carrito.items.map((item) => ({
                producto_id: item.producto.id,
                cantidad: Number(item.cantidad),
                precio_unitario: Number(item.producto.precio)
            }));

            const datosPedido = {
                ...datosPersonales,
                ...datosDireccion,
                productos
            };

            const respuesta = await orderService.crearPedido(datosPedido);

            await vaciarCarrito();

            navigate('/pedido-confirmado', { state: { pedido: respuesta.pedido } });

        } catch (error) {
            const codigoError = obtenerErrorApi(error, API_ERRORS.ORDER_CREATE_FAILED);
            setErrorServidor(traducir(`API_ERRORS.${codigoError}`));
        } finally {
            setCargando(false);
        }
    };

    const ResumenPedido = () => (
        <aside className="checkout-resumen">
            <h2>{traducir('CHECKOUT.ORDER_SUMMARY')}</h2>
            <ul className="checkout-resumen-lista">
                {carrito?.items.map((item) => (
                    <li key={item.id} className="checkout-resumen-item">
                        <span className="checkout-resumen-nombre">
                            {item.producto.nombre} × {Number(item.cantidad)}
                        </span>
                        <span className="checkout-resumen-precio">
                            {formatearPrecio(Number(item.producto.precio) * Number(item.cantidad))}
                        </span>
                    </li>
                ))}
            </ul>
            <div className="checkout-resumen-total">
                <strong>{traducir('CART.TOTAL')}:</strong>
                <strong>{formatearPrecio(calcularTotal())}</strong>
            </div>
        </aside>
    );

    const IndicadorPasos = () => {
        const pasos = [
            traducir('CHECKOUT.STEP_PERSONAL'),
            traducir('CHECKOUT.STEP_ADDRESS'),
            traducir('CHECKOUT.STEP_PAYMENT')
        ];
        return (
            <div className="checkout-stepper">
                {pasos.map((nombre, index) => (
                    <div
                        key={index}
                        className={`checkout-step ${index === pasoActual ? 'checkout-step--activo' : ''} ${index < pasoActual ? 'checkout-step--completado' : ''}`}
                    >
                        <span className="checkout-step-numero">{index + 1}</span>
                        <span className="checkout-step-nombre">{nombre}</span>
                    </div>
                ))}
            </div>
        );
    };

    const renderPasoPersonal = () => (
        <div className="checkout-formulario">
            <h2>{traducir('CHECKOUT.STEP_PERSONAL')}</h2>

            <div className="checkout-grupo">
                <label htmlFor="nombre">{traducir('CHECKOUT.NAME')}</label>
                <input type="text" id="nombre" name="nombre"
                    value={datosPersonales.nombre} onChange={handleChangePersonal}
                    placeholder={traducir('CHECKOUT.NAME')} />
                <div className="error">{traducirError(errores.nombre, traducir)}</div>
            </div>

            <div className="checkout-grupo">
                <label htmlFor="email">{traducir('CHECKOUT.EMAIL')}</label>
                <input type="email" id="email" name="email"
                    value={datosPersonales.email} onChange={handleChangePersonal}
                    placeholder={traducir('CHECKOUT.EMAIL')} />
                <div className="error">{traducirError(errores.email, traducir)}</div>
            </div>

            <div className="checkout-grupo">
                <label htmlFor="telefono">{traducir('CHECKOUT.PHONE')}</label>
                <input type="tel" id="telefono" name="telefono"
                    value={datosPersonales.telefono} onChange={handleChangePersonal}
                    placeholder={traducir('CHECKOUT.PHONE')} />
                <div className="error">{traducirError(errores.telefono, traducir)}</div>
            </div>
        </div>
    );

    const renderPasoDireccion = () => (
        <div className="checkout-formulario">
            <h2>{traducir('CHECKOUT.STEP_ADDRESS')}</h2>

            <div className="checkout-grupo">
                <label htmlFor="direccion">{traducir('CHECKOUT.ADDRESS')}</label>
                <input type="text" id="direccion" name="direccion"
                    value={datosDireccion.direccion} onChange={handleChangeDireccion}
                    placeholder={traducir('CHECKOUT.ADDRESS')} />
                <div className="error">{traducirError(errores.direccion, traducir)}</div>
            </div>

            <div className="checkout-fila">
                <div className="checkout-grupo">
                    <label htmlFor="ciudad">{traducir('CHECKOUT.CITY')}</label>
                    <input type="text" id="ciudad" name="ciudad"
                        value={datosDireccion.ciudad} onChange={handleChangeDireccion}
                        placeholder={traducir('CHECKOUT.CITY')} />
                    <div className="error">{traducirError(errores.ciudad, traducir)}</div>
                </div>

                <div className="checkout-grupo">
                    <label htmlFor="codigo_postal">{traducir('CHECKOUT.POSTAL_CODE')}</label>
                    <input type="text" id="codigo_postal" name="codigo_postal"
                        value={datosDireccion.codigo_postal} onChange={handleChangeDireccion}
                        placeholder={traducir('CHECKOUT.POSTAL_CODE')} />
                    <div className="error">{traducirError(errores.codigo_postal, traducir)}</div>
                </div>
            </div>

            <div className="checkout-fila">
                <div className="checkout-grupo">
                    <label htmlFor="provincia">{traducir('CHECKOUT.PROVINCE_OPTIONAL')}</label>
                    <input type="text" id="provincia" name="provincia"
                        value={datosDireccion.provincia} onChange={handleChangeDireccion}
                        placeholder={traducir('CHECKOUT.PROVINCE_OPTIONAL')} />
                </div>

                <div className="checkout-grupo">
                    <label htmlFor="pais">{traducir('CHECKOUT.COUNTRY')}</label>
                    <input type="text" id="pais" name="pais"
                        value={datosDireccion.pais} onChange={handleChangeDireccion}
                        placeholder={traducir('CHECKOUT.COUNTRY')} />
                    <div className="error">{traducirError(errores.pais, traducir)}</div>
                </div>
            </div>
        </div>
    );

    const renderPasoPago = () => (
        <div className="checkout-formulario">
            <h2>{traducir('CHECKOUT.STEP_PAYMENT')}</h2>

            <p className="checkout-aviso-simulado">
                ⚠️ {traducir('CHECKOUT.PAYMENT_SIMULATED')}
            </p>

            <div className="checkout-grupo">
                <label htmlFor="titular">{traducir('CHECKOUT.CARD_HOLDER')}</label>
                <input type="text" id="titular" name="titular"
                    value={datosPago.titular} onChange={handleChangePago}
                    placeholder={traducir('CHECKOUT.CARD_HOLDER')} />
                <div className="error">{traducirError(errores.titular, traducir)}</div>
            </div>

            <div className="checkout-grupo">
                <label htmlFor="numero">{traducir('CHECKOUT.CARD_NUMBER')}</label>
                <input type="text" id="numero" name="numero" maxLength={19}
                    value={datosPago.numero} onChange={handleChangePago}
                    placeholder="1234 5678 9012 3456" />
                <div className="error">{traducirError(errores.numero, traducir)}</div>
            </div>

            <div className="checkout-fila">
                <div className="checkout-grupo">
                    <label htmlFor="caducidad">{traducir('CHECKOUT.CARD_EXPIRY')}</label>
                    <input type="text" id="caducidad" name="caducidad" maxLength={5}
                        value={datosPago.caducidad} onChange={handleChangePago}
                        placeholder="MM/AA" />
                    <div className="error">{traducirError(errores.caducidad, traducir)}</div>
                </div>

                <div className="checkout-grupo">
                    <label htmlFor="cvv">{traducir('CHECKOUT.CARD_CVV')}</label>
                    <input type="password" id="cvv" name="cvv" maxLength={4}
                        value={datosPago.cvv} onChange={handleChangePago}
                        placeholder="CVV" />
                    <div className="error">{traducirError(errores.cvv, traducir)}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="checkout-container">
            {cargando && <Spinner />}

            <h1>{traducir('CHECKOUT.TITLE')}</h1>

            <IndicadorPasos />

            <div className="checkout-contenido">
                <div className="checkout-main">
                    {pasoActual === PASOS.PERSONAL && renderPasoPersonal()}
                    {pasoActual === PASOS.DIRECCION && renderPasoDireccion()}
                    {pasoActual === PASOS.PAGO && renderPasoPago()}

                    {errorServidor && (
                        <div className="error mensajeFormulario">{errorServidor}</div>
                    )}

                    <div className="checkout-navegacion">
                        {pasoActual > 0 && (
                            <button className="checkout-btn-volver" onClick={handleVolver} disabled={cargando}>
                                {traducir('CHECKOUT.BACK')}
                            </button>
                        )}
                        {pasoActual < 2 && (
                            <button className="checkout-btn-siguiente" onClick={handleSiguiente} disabled={cargando}>
                                {traducir('CHECKOUT.NEXT')}
                            </button>
                        )}
                        {pasoActual === 2 && (
                            <button className="checkout-btn-confirmar" onClick={handleConfirmar} disabled={cargando}>
                                {cargando ? traducir('CHECKOUT.PROCESSING') : traducir('CHECKOUT.CONFIRM_ORDER')}
                            </button>
                        )}
                    </div>
                </div>

                <ResumenPedido />
            </div>
        </div>
    );
}

export default Checkout;