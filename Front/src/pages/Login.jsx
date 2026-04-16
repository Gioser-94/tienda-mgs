import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  return (
    <div className="contenedorLogin">
      <h1 className="tituloLogin">INICIAR SESIÓN</h1>

      <div className="contenedorFormularioLogin">
        <form id="formLogin" className="formLogin">
          <div className="contenedorInputsLogin">
            <div className="grupoInputLogin">
              <label htmlFor="nombreLogin">Nombre o correo electrónico</label>
              <input
                type="text"
                id="nombreLogin"
                className="inputLogin"
                placeholder="Nombre o correo electrónico"
              />
            </div>

            <div className="grupoInputLogin">
              <label htmlFor="passwordLogin">Contraseña</label>
              <input
                type="password"
                id="passwordLogin"
                className="inputLogin"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <button type="submit" className="botonLogin">
            INICIAR SESIÓN
          </button>
        </form>

        <Link to="/registro" className="linkRegistroLogin">
          ¿No tienes cuenta? Regístrate
        </Link>
      </div>
    </div>
  );
}

export default Login;