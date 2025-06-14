<template>
  <div class="space-y-6">
    <!-- Lista de tecnologías -->
    <div class="bg-white/90 dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-semibold text-violet-700 dark:text-violet-300 mb-4">
        Tecnologías Existentes
      </h3>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Imagen
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nombre
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Descripción
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Precio
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Categoría
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            <tr v-for="tech in tecnologias" :key="tech._id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-6 py-4 whitespace-nowrap">
                <img :src="`http://localhost:5000${tech.image}`" :alt="tech.name" class="h-12 w-12 object-cover rounded">
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ tech.name }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-500 dark:text-gray-300">{{ tech.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">${{ tech.price }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white capitalize">{{ categorias.find(c => c.value === tech.categoria)?.label || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="editarTecnologia(tech)"
                  class="text-violet-600 hover:text-violet-900 dark:text-violet-400 dark:hover:text-violet-300 mr-3">
                  Editar
                </button>
                <button @click="eliminarTecnologia(tech._id)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Botón para agregar -->
    <div v-if="!mostrarFormulario" class="flex justify-center mt-10">
      <button @click="mostrarFormulario = true"
        class="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-3 rounded-xl shadow">
        Agregar Tecnología
      </button>
    </div>

    <!-- Formulario de edición -->
    <div v-if="mostrarFormulario" class="bg-white/90 dark:bg-gray-900 p-6 rounded-lg shadow-xl max-w-2xl mx-auto animate-fade-in">
      <h3 class="text-2xl font-semibold text-violet-700 dark:text-violet-300 mb-4">
        {{ tecnologiaEditando ? 'Editar Tecnología' : 'Agregar Nueva Tecnología' }}
      </h3>

      <form @submit.prevent="guardarTecnologia" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
          <input v-model="form.nombre" type="text" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-800 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
          <textarea v-model="form.descripcion" required rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-800 dark:text-white"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Precio</label>
          <input v-model="form.precio" type="number" required min="0" step="0.01"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-800 dark:text-white">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoría</label>
          <select v-model="form.categoria" required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 dark:bg-gray-800 dark:text-white">
            <option v-for="cat in categorias" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Imagen</label>
          <input type="file" @change="handleImageChange" accept="image/*" :required="!tecnologiaEditando"
            class="mt-1 block w-full">
        </div>

        <div class="flex justify-end space-x-4">
          <button type="submit"
            class="bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2 rounded">
            {{ tecnologiaEditando ? 'Actualizar' : 'Agregar' }}
          </button>
          <button type="button" @click="cerrarFormulario"
            class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerToken } from '@/utils/auth'

const tecnologias = ref([])
const mostrarFormulario = ref(false)
const tecnologiaEditando = ref(null)
const form = ref({
  nombre: '',
  descripcion: '',
  precio: '',
  categoria: 'pagina_web',
  imagen: null
})

// Definir las categorías disponibles
const categorias = [
  { value: 'pagina_web', label: 'Página Web' },
  { value: 'aplicacion', label: 'Aplicación' },
  { value: 'mantenimiento', label: 'Mantenimiento' },
  { value: 'otros', label: 'Otros' }
]

// Cargar tecnologías
const fetchTechnologies = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/tecnologias')
    if (!response.ok) {
      throw new Error('Error al obtener tecnologías')
    }
    const data = await response.json()
    tecnologias.value = data
  } catch (error) {
    console.error('Error:', error)
  }
}

// Manejar cambio de imagen
const handleImageChange = (event) => {
  form.value.imagen = event.target.files[0]
}

// Guardar tecnología (Agregar o Actualizar)
const guardarTecnologia = async () => {
  try {
    if (!form.value.nombre || !form.value.descripcion || !form.value.precio || !form.value.categoria) {
      // Aquí puedes manejar un error o mensaje al usuario si faltan campos
      console.error('Error: Faltan campos requeridos')
      return
    }

    const formData = new FormData()
    formData.append('name', form.value.nombre)
    formData.append('description', form.value.descripcion)
    formData.append('price', form.value.precio)
    formData.append('categoria', form.value.categoria)
    if (form.value.imagen) {
      formData.append('image', form.value.imagen)
    }

    const token = obtenerToken()
    if (!token) {
      // Manejar el caso donde no hay token
      console.error('No hay token de autenticación disponible')
      return
    }

    const url = tecnologiaEditando.value?._id
      ? `http://localhost:5000/api/tecnologias/${tecnologiaEditando.value._id}`
      : 'http://localhost:5000/api/tecnologias'

    const method = tecnologiaEditando.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al guardar tecnología')
    }

    await fetchTechnologies()
    cerrarFormulario()
  } catch (error) {
    console.error('Error al guardar tecnología:', error)
    // Aquí puedes actualizar una variable de estado para mostrar el error en la UI
  }
}

// Editar tecnología
const editarTecnologia = (tech) => {
  tecnologiaEditando.value = tech
  form.value = {
    nombre: tech.name,
    descripcion: tech.description,
    precio: tech.price,
    categoria: tech.categoria || 'pagina_web',
    imagen: null // No precargamos la imagen, se seleccionará una nueva si se desea
  }
  mostrarFormulario.value = true
}

// Eliminar tecnología
const eliminarTecnologia = async (id) => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta tecnología?')) return

  try {
    const token = obtenerToken()
    if (!token) {
      console.error('No hay token de autenticación disponible')
      return
    }

    const response = await fetch(`http://localhost:5000/api/tecnologias/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Error al eliminar tecnología')
    }

    await fetchTechnologies()
  } catch (error) {
    console.error('Error al eliminar tecnología:', error)
    // Aquí puedes actualizar una variable de estado para mostrar el error en la UI
  }
}

// Cerrar formulario
const cerrarFormulario = () => {
  mostrarFormulario.value = false
  tecnologiaEditando.value = null
  form.value = {
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'pagina_web',
    imagen: null
  }
}

onMounted(fetchTechnologies)
</script>

<style scoped>
@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(16px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in .5s cubic-bezier(.44, .09, .52, 1.02);
}
</style> 