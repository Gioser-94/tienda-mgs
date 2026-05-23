import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 3000

console.log('🔧 Variables de entorno cargadas')
console.log('   SUPABASE_URL:',     process.env.SUPABASE_URL     ? '✅' : '❌')
console.log('   SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅' : '❌')
console.log('   DATABASE_URL:',     process.env.DATABASE_URL     ? '✅' : '❌')
console.log('   JWT_SECRET:',       process.env.JWT_SECRET       ? '✅' : '❌')

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
})