import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import './index.css';
import App from './App.jsx';
import './i18n/i18n.js';

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>

);
