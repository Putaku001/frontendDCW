const API_URL = import.meta.env.VITE_API_URL || 'https://backenddcw-production.up.railway.app/api'

// 🟢 Login de usuario
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
  return await res.json()
}

// 🟣 Registro: permite enviar rol y token opcional para crear admin
export async function register(nombre, email, password, rol = 'cliente', token = null) {
  const headers = {
    'Content-Type': 'application/json'
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ nombre, email, password, rol })
  })

  return await res.json()
}

// 🔵 Obtener lista de servicios (sin autenticación)
export async function getServicios() {
  const res = await fetch(`${API_URL}/productos`, {
    credentials: 'include'
  })
  return await res.json()
}
