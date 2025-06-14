const API_URL = 'https://backenddcw-production.up.railway.app/api'

// 🟢 Login de usuario
export async function login(email, password) {
  try {
    console.log('Intentando login con URL:', `${API_URL}/auth/login`)
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error en login:', error)
    throw new Error('Error al conectar con el servidor. Por favor, intente nuevamente.')
  }
}

// 🟣 Registro: permite enviar rol y token opcional para crear admin
export async function register(nombre, email, password, rol = 'cliente', token = null) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
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

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`)
    }

    return await res.json()
  } catch (error) {
    console.error('Error en registro:', error)
    throw new Error('Error al conectar con el servidor. Por favor, intente nuevamente.')
  }
}

// 🔵 Obtener lista de servicios (sin autenticación)
export async function getServicios() {
  try {
    const res = await fetch(`${API_URL}/servicios`, {
      credentials: 'include'
    })
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${res.status}: ${res.statusText}`)
    }
    
    return await res.json()
  } catch (error) {
    console.error('Error al obtener servicios:', error)
    throw new Error('Error al conectar con el servidor. Por favor, intente nuevamente.')
  }
}
