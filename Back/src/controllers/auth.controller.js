import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'

// ── REGISTER ──────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { email, password, nombre_completo, telefono } = req.body

    if (!email || !password || !nombre_completo || !telefono) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const existe = await prisma.usuarios.findUnique({
      where: { email }
    })

    if (existe) {
      return res.status(409).json({ error: 'El email ya está registrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const nuevoUsuario = await prisma.usuarios.create({
      data: {
        email,
        password:        hashedPassword,
        nombre_completo,
        telefono,
        rol:             'cliente'
      }
    })

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario: {
        id:              nuevoUsuario.id,
        email:           nuevoUsuario.email,
        nombre_completo: nuevoUsuario.nombre_completo,
        telefono:        nuevoUsuario.telefono,
        rol:             nuevoUsuario.rol
      }
    })

  } catch (error) {
    console.error('Error en register:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ── LOGIN ─────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' })
    }

    // Buscamos el usuario
    const usuario = await prisma.usuarios.findUnique({
      where: { email }
    })

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    // Comparamos la password
    const passwordValida = await bcrypt.compare(password, usuario.password)

    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    // Generamos el JWT
    const token = jwt.sign(
    {
      id:              usuario.id,
      email:           usuario.email,
      nombre_completo: usuario.nombre_completo,
      rol:             usuario.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )

    // Metemos el token en la cookie httpOnly
    res.cookie('token', token, {
        httpOnly: true,
        secure:   process.env.NODE_ENV === 'production',  // false local, true en Render
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge:   24 * 60 * 60 * 1000
    })

    return res.json({
      message: 'Login correcto',
      usuario: {
        id:    usuario.id,
        email: usuario.email,
        rol:   usuario.rol
      }
    })

  } catch (error) {
    console.error('Error en login:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// ── LOGOUT ────────────────────────────────────────────
export const logout = (req, res) => {
  res.clearCookie('token')
  return res.json({ message: 'Sesión cerrada correctamente' })
}

// ── ME (datos del usuario logueado) ───────────────────
export const me = async (req, res) => {
  try {
    const usuario = await prisma.usuarios.findUnique({
      where: { id: BigInt(req.user.id) },
      select: {
        id:              true,
        email:           true,
        rol:             true,
        nombre_completo: true,
        telefono:        true,
        created_at:      true
      }
    })

    return res.json({ usuario })

  } catch (error) {
    console.error('Error en me:', error)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
}