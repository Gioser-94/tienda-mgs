import './Toast.css';

function Toast({ toasts, onCerrar }) {
    if (toasts.length === 0) return null;

    return (
        <div className="toast-contenedor">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast--${toast.tipo}`}>
                    <span className="toast-mensaje">{toast.mensaje}</span>
                    <button className="toast-cerrar" onClick={() => onCerrar(toast.id)}>✕</button>
                </div>
            ))}
        </div>
    );
}

export default Toast;