/* const pool = require('./config/db');

const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/productos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});*/

import express from "express";
import productRoutes from "./routes/products.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend funcionando");
});


app.use("/api/products", productRoutes);

export default app;