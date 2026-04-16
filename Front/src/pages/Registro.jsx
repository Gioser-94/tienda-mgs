import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cliente } from '../data/Cliente';
import './Registro.css'
import {Link} from 'react-router-dom';

function Registro() {

    // Estados para cada campo
    const [nombre, setNombre] = useState('');
    const [errorNombre, setErrorNombre] = useState('');

    const [email, setEmail] = useState('');
    const [errorEmail, setErrorEmail] = useState('');

    const [telefono, setTelefono] = useState('');
    const [errorTelefono, setErrorTelefono] = useState('');

    const [password, setPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

    // Validaciones básicas
    const handleNombreChange = (e) => {
        const valor = e.target.value;
        setNombre(valor);

        if(valor && !Cliente.validarNombre(valor)){
            setErrorNombre('Nombre inválido');
        } else {
            setErrorNombre('');
        }

    }

    const handleEmailChange = (e) => {
        const valor = e.target.value;
        setEmail(valor);

        if(valor && !Cliente.validarEmail(valor)){
            setErrorEmail('Email inválido');
        } else {
            setErrorEmail('');
        }

    }

    const handleTelefonoChange = (e) => {
        const valor = e.target.value;
        setTelefono(valor);

        if(valor && !Cliente.validarTelefono(valor)){
            setErrorTelefono('Teléfono inválido');
        } else {
            setErrorTelefono('');
        }

    }

    const handlePasswordChange = (e) => {
        const valor = e.target.value;
        setPassword(valor);

        if(valor && !Cliente.validarPassword(valor)){
            setErrorPassword('Contraseña inválido');
        } else {
            setErrorPassword('');
        }

    }

    const handleConfimPasswordChange = (e) => {
        const valor = e.target.value;
        setConfirmPassword(valor);

        if ( valor && valor !== password ) {
            setErrorConfirmPassword('Las contraseñas no coinciden');
        } else {
            setErrorConfirmPassword('');
        }

    }

  return (
    <div className="contenedorRegistro">
        <h1>CREAR CUENTA</h1>
        <div className="contenedorFormulario">
            <form id="formRegistro" className="divFormulario">
                <div className="input-container">
                    <input
                        type="text"
                        className="input-form"
                        id="nombreCrearCuenta"
                        placeholder="Nombre completo"
                        value={nombre}
                        onChange={handleNombreChange}
                        required
                    />
                    <div className='error'>
                        {errorNombre}
                    </div>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        className="input-form"
                        id="correoCrearCuenta"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    <div className='error'>
                        {errorEmail}
                    </div>
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        className="input-form"
                        id="telefonoCrearCuenta"
                        placeholder="Teléfono (Ej: +34 612345678)"
                        value={telefono}
                        onChange={handleTelefonoChange}
                        required
                    />
                    <div className='error'>
                        {errorTelefono}
                    </div>
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        className="input-form"
                        id="contrasenaCrearCuenta"
                        placeholder="Contraseña"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <div className='error'>
                        {errorPassword}
                    </div>
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        className="input-form"
                        id="repetirContrasena"
                        placeholder="Repetir contraseña"
                        value={confirmPassword}
                        onChange={handleConfimPasswordChange}
                        required
                    />
                    <div className='error'>
                        {errorConfirmPassword}
                    </div>
                </div>
                <div id="radio">
                    <input type="radio" className="input-form" id="radioAceptarPolitica"/>He leído y acepto la política de privacidad<br/>
                </div>    
                <button type="submit" className="botonCrearCuenta">CREAR CUENTA</button><br/>
            </form>
            <Link to='/login'>¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
    </div>
  )
}

export default Registro