const API_URL = '//backenddcw-production.up.railway.app/api'

// Función auxiliar para hacer peticiones
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`
  console.log('🌐 Haciendo petición a:', url)
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    credentials: 'include'
  }

  try {
    const res = await fetch(url, { ...defaultOptions, ...options })
    console.log('📡 Respuesta del servidor:', res.status, res.statusText)
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('❌ Error en la petición:', error)
    throw error
  }
}

// 🟢 Login de usuario
export async function login(email, password) {
  return fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  })
}

// 🟣 Registro
export async function register(nombre, email, password, rol = 'cliente', token = null) {
  const headers = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return fetchAPI('/auth/register', {
    method: 'POST',
    headers,
    body: JSON.stringify({ nombre, email, password, rol })
  })
}

// 🔵 Obtener lista de servicios
export async function getServicios() {
  return fetchAPI('/servicios')
} 