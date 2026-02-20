import './Registro.css'

function Registro() {
  return (
    <div className="contenedorRegistro">
        <h1>CREAR CUENTA</h1>
        <div className="contenedorFormulario">
            <form action="" id="formRegistro" className="divFormulario" novalidate>
                <input type="text" className="input-form" id="nombreCrearCuenta" placeholder="Nombre completo" required/><br/>
                <input type="text" className="input-form" id="correoCrearCuenta" placeholder="Correo electrónico" required/><br/>
                <input type="text" className="input-form" id="telefonoCrearCuenta" placeholder="Teléfono (Ej: +34 612345678)" required/><br/>
                <input type="password" className="input-form" id="contrasenaCrearCuenta" placeholder="Contraseña" required/><br/>
                <input type="password" className="input-form" id="repetirContrasena" placeholder="Repetir contraseña" required/><br/>
                <div id="radio">
                    <input type="radio" className="input-form" id="radioAceptarPolitica"/>He leído y acepto la política de privacidad<br/>
                </div>    
                <button type="submit" className="botonCrearCuenta">CREAR CUENTA</button><br/>
                <p id="mensajeRegistro"></p>
            </form>
        </div>
    </div>
  )
}

export default Registro