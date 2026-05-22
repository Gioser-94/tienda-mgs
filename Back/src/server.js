import dotenv from 'dotenv';

// PRIMERO cargamos el .env
dotenv.config();

console.log('🔧 Variables de entorno cargadas');
console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅' : '❌');
console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅' : '❌');

// DESPUÉS importamos app (que usa supabase)
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});