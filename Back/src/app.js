import express from 'express';
import cors from 'cors';
import productRoutes from './routes/products.routes.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173'  // Frontend
}));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando ✅' });
});

// Rutas de productos
app.use('/api/productos', productRoutes);

export default app;