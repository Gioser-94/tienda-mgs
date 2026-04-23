const pool = require('./config/db');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error conectando a la BD:', err);
  } else {
    console.log('Conectado a Supabase:', res.rows);
  }
});
