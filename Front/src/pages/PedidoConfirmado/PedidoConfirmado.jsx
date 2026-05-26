import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatearPrecio } from '../../utils/formatters';
import './PedidoConfirmado.css';

function PedidoConfirmado() {
    const { t: traducir, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const pedido = location.state?.pedido;

    return (
        <div className="confirmacion-container">
            <div className="confirmacion-icono">✓</div>
            <h1>{traducir('ORDER.SUCCESS_TITLE')}</h1>
            <p>{traducir('ORDER.SUCCESS_MESSAGE')}</p>

            {pedido && (
                <div className="confirmacion-detalles">
                    <p>
                        <span>{traducir('ORDER.ORDER_NUMBER')}:</span>
                        <strong>#{String(pedido.id)}</strong>
                    </p>
                    <p>
                        <span>{traducir('ORDER.ORDER_TOTAL')}:</span>
                        <strong>{formatearPrecio(pedido.total, i18n.language)}</strong>
                    </p>
                    <p>
                        <span>{traducir('ORDER.ORDER_STATUS')}:</span>
                        <strong>{pedido.estado}</strong>
                    </p>
                </div>
            )}

            <button className="confirmacion-btn" onClick={() => navigate('/')}>
                {traducir('ORDER.GO_HOME')}
            </button>
        </div>
    );
}

export default PedidoConfirmado;