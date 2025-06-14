<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'
import { obtenerToken } from '@/utils/auth'

const props = defineProps({ refetch: { type: Number, default: 0 } })

const usuarios    = ref([])
const cargando    = ref(true)
const error       = ref('')
const modoEdicion = ref(null)

/* ---- API ---- */
const fetchUsers = async () => {
  cargando.value = true
  error.value = ''
  try {
    const token = obtenerToken()
    if (!token) {
      error.value = 'No estás autenticado para ver los usuarios.'
      return
    }
    const response = await fetch('http://localhost:5000/api/admin/usuarios', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error('Error al obtener usuarios')
    }

    const data = await response.json()
    usuarios.value = data
  } catch (error) {
    console.error('Error:', error)
    error.value = error.message || 'Error al cargar usuarios'
  } finally {
    cargando.value = false
  }
}

const deleteUser = async (id) => {
  if (!confirm('¿Eliminar este usuario?')) return
  try {
    const token = obtenerToken()
    if (!token) {
      error.value = 'No estás autenticado para eliminar usuarios.'
      return
    }
    const response = await fetch(`http://localhost:5000/api/admin/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al eliminar usuario')
    }

    await fetchUsers()
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    // Mostrar el error en la UI si es necesario
  }
}

const updateUser = async (usuario) => {
  try {
    const token = obtenerToken()
    if (!token) {
      error.value = 'No estás autenticado para actualizar usuarios.'
      return
    }
    const response = await fetch(`http://localhost:5000/api/admin/usuarios/${usuario._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(usuario)
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al actualizar usuario')
    }

    await fetchUsers()
    modoEdicion.value = null // Salir del modo edición al guardar con éxito
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    error.value = error.message || 'Error al actualizar usuario' // Mostrar el error en la UI
  }
}

onMounted(fetchUsers)
watch(() => props.refetch, fetchUsers)
</script>

<template>
  <p v-if="error"    class="text-red-600 font-semibold mb-4 text-center">{{ error }}</p>
  <p v-if="cargando" class="text-gray-500 italic text-center">Cargando usuarios...</p>

  <div class="overflow-x-auto shadow-md rounded-lg">
    <table v-if="!cargando && usuarios.length"
           class="w-full table-auto text-sm text-gray-800 dark:text-gray-100">
      <thead class="bg-violet-200 dark:bg-violet-700 text-violet-800 dark:text-white uppercase text-xs">
        <tr>
          <th class="p-3 text-left">Nombre</th>
          <th class="p-3 text-left">Correo</th>
          <th class="p-3 text-left">Rol</th>
          <th class="p-3 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in usuarios" :key="user._id"
            class="border-b dark:border-gray-700 hover:bg-violet-50 dark:hover:bg-violet-900 transition">

          <!-- edición -->
          <template v-if="modoEdicion === user._id">
            <td class="p-2">
              <input v-model="user.nombre" class="w-full px-2 py-1 border rounded dark:bg-gray-800" />
            </td>
            <td class="p-2">
              <input v-model="user.email" class="w-full px-2 py-1 border rounded dark:bg-gray-800" />
            </td>
            <td class="p-2">
              <select v-model="user.rol" class="w-full px-2 py-1 border rounded dark:bg-gray-800">
                <option value="cliente">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </td>
            <td class="p-2 text-center">
              <button @click="updateUser(user)"
                      class="text-green-600 hover:text-green-800 font-semibold mr-2">Guardar</button>
              <button @click="modoEdicion = null"
                      class="text-gray-500 hover:text-gray-700 font-semibold">Cancelar</button>
            </td>
          </template>

          <!-- lectura -->
          <template v-else>
            <td class="p-2">{{ user.nombre }}</td>
            <td class="p-2">{{ user.email }}</td>
            <td class="p-2 capitalize">{{ user.rol }}</td>
            <td class="p-2 text-center">
              <button @click="modoEdicion = user._id"
                      class="text-blue-600 hover:text-blue-800 font-semibold mr-2">Editar</button>
              <button @click="deleteUser(user._id)"
                      class="text-red-600 hover:text-red-800 font-semibold">Eliminar</button>
            </td>
          </template>

        </tr>
      </tbody>
    </table>

    <div v-else-if="!cargando && !usuarios.length"
         class="text-center text-gray-500 dark:text-gray-400 py-12">
      No hay usuarios registrados.
    </div>
  </div>
</template>
