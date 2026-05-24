import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

import './index.css';
import App from './App.jsx';

import './i18n/i18n.js';
import { CartProvider } from './context/CartContext.jsx';

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>

);
