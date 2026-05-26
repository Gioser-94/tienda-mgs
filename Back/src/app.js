import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoutes     from './routes/auth.routes.js'
import productRoutes  from './routes/products.routes.js'
import categoryRoutes from './routes/categories.routes.js'
import clientRoutes   from './routes/clients.routes.js'
import orderRoutes    from './routes/orders.routes.js'
import userRoutes     from './routes/users.routes.js'
import cartRoutes     from './routes/cart.routes.js';

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tienda-mgs-front.onrender.com'
    : 'http://localhost:5173',
  credentials: true
}))

app.use('/api/auth',       authRoutes)
app.use('/api/products',   productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/clients',    clientRoutes)
app.use('/api/orders',     orderRoutes)
app.use('/api/users',      userRoutes)
app.use('/api/cart', cartRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando ✅' })
})

export default app