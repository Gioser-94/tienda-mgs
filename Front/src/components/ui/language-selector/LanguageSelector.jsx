import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LanguageSelector.module.css';

const idiomas = [
  { code: 'es', label: 'ES', flag: 'https://flagcdn.com/es.svg' },
  { code: 'en', label: 'EN', flag: 'https://flagcdn.com/gb.svg' }
]

function LanguageSelector() {
  const { i18n } = useTranslation()
  const [abierto, setAbierto] = useState(false)
  const ref = useRef(null)

  const actual = idiomas.find(i => i.code === i18n.language) || idiomas[0]

  const cambiarIdioma = (code) => {
    i18n.changeLanguage(code)
    localStorage.setItem('language', code)
    setAbierto(false)
  }

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className={styles.langSelector} ref={ref}>
      <button
        className={styles.langBtn}
        onClick={() => setAbierto(!abierto)}
      >
        <img src={actual.flag} alt={actual.label} className={styles.langFlag} />
        <span>{actual.label}</span>
        <span className={styles.langArrow}>{abierto ? '▲' : '▼'}</span>
      </button>

      {abierto && (
        <div className={styles.langDropdown}>
          {idiomas.map(idioma => (
            <button
              key={idioma.code}
              className={`${styles.langOption} ${idioma.code === i18n.language ? styles.langOptionActivo : ''}`}
              onClick={() => cambiarIdioma(idioma.code)}
            >
              <img src={idioma.flag} alt={idioma.label} className={styles.langFlag} />
              <span>{idioma.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector