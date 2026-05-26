import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Login.css";
import {
    validarEmail,
    validarPassword
} from "../../utils/validators";
import { traducirError } from "../../utils/errorTranslator";
import { authService } from "../../services/Auth/authService";
import { API_ERRORS } from "../../constants/apiErrors";
import { obtenerErrorApi } from "../../utils/apiErrorHandler";
import Spinner from "../../components/ui/spinner/Spinner";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const { t: traducir } = useTranslation();

    const { setUsuario } = useAuth();

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errores, setErrores] = useState({});
    const [errorServidor, setErrorServidor] = useState("");
    const [mensajeExito, setMensajeExito] = useState("");
    const [cargando, setCargando] = useState(false);

    const validarCampo = (campo, valor) => {
        let error = null;

        switch (campo) {
            case "email":
                error = validarEmail(valor);
                break;

            case "password":
                error = validarPassword(valor);
                break;

            default:
                break;
        }

        setErrores((errores) => ({
            ...errores,
            [campo]: error
        }));

        return error;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((formData) => ({
            ...formData,
            [name]: value
        }));

        validarCampo(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorServidor("");
        setMensajeExito("");

        const nuevosErrores = {
            email: validarEmail(formData.email),
            password: validarPassword(formData.password)
        };

        setErrores(nuevosErrores);

        const hayErrores = Object.values(nuevosErrores).some(
            (error) => error !== null
        );

        if (hayErrores) {
            return;
        }

        try {
            setCargando(true);

            const data = await authService.login({
                email: formData.email,
                password: formData.password
            });

            setUsuario(data.usuario);

            setMensajeExito(traducir("AUTH.LOGIN_SUCCESS"));

            setFormData({
                email: "",
                password: ""
            });

            setErrores({});

            navigate("/");

        } catch (error) {
            const codigoError = obtenerErrorApi(
                error,
                API_ERRORS.LOGIN_FAILED
            );

            setErrorServidor(
                traducir(`API_ERRORS.${codigoError}`)
            );

            setMensajeExito("");

        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="contenedorLogin">
            {cargando && <Spinner />}

            <h1 className="tituloLogin">
                {traducir("AUTH.LOGIN")}
            </h1>

            <div className="contenedorFormularioLogin">
                <form
                    id="formLogin"
                    className="formLogin"
                    onSubmit={handleSubmit}
                >
                    <div className="contenedorInputsLogin">
                        <div className="grupoInputLogin">
                            <label htmlFor="emailLogin">
                                {traducir("AUTH.EMAIL")}
                            </label>

                            <input
                                type="email"
                                name="email"
                                id="emailLogin"
                                className="inputLogin"
                                placeholder={traducir("AUTH.EMAIL")}
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <div className="error">
                                {traducirError(errores.email, traducir)}
                            </div>
                        </div>

                        <div className="grupoInputLogin">
                            <label htmlFor="passwordLogin">
                                {traducir("AUTH.PASSWORD")}
                            </label>

                            <input
                                type="password"
                                name="password"
                                id="passwordLogin"
                                className="inputLogin"
                                placeholder={traducir("AUTH.PASSWORD")}
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <div className="error">
                                {traducirError(errores.password, traducir)}
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="botonLogin"
                        disabled={cargando}
                    >
                        {cargando
                            ? traducir("COMMON.LOADING")
                            : traducir("AUTH.LOGIN")}
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
                </form>

                <Link to="/registro" className="linkRegistroLogin">
                    {traducir("AUTH.NO_ACCOUNT_REGISTER")}
                </Link>
            </div>
        </div>
    );
}

export default Login;