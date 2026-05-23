import { useTranslation } from 'react-i18next';

import './LanguageSelector.css';

function LanguageSelector() {
    const { i18n } = useTranslation();

    const cambiarIdioma = (e) => {
        i18n.changeLanguage(e.target.value);
        localStorage.setItem('language', e.target.value);
    };

    return (
        <select
            className="language-selector"
            value={i18n.language}
            onChange={cambiarIdioma}
        >
            <option value="es">🇪🇸 ES</option>
            <option value="en">🇬🇧 EN</option>
        </select>
    );
}

export default LanguageSelector;