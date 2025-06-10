<template>
  <div class="defect-list">
    <!-- Agregar el HeaderBar al inicio del archivo -->
    <HeaderBar />

    <!-- Breadcrumb -->
    <div class="breadcrumb-container">
      <div class="breadcrumb">
        {{ $t('breadcrumb.home') }} > <strong>{{ $t('breadcrumb.libraryDefects') }}</strong>
      </div>
    </div>

    <!-- Filtros de búsqueda -->
    <div class="filters">
      <input type="text" v-model="searchTerm" placeholder="Buscar..." class="search-bar" />
      <select v-model="selectedCategory" class="dropdown">
        <option value="">Categoría</option>
        <option v-for="cat in defectCategories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
    </div>

    <!-- Tabla de defectos -->
    <div class="defect-container">
      <table class="defect-table">
        <thead>
        <tr>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Severidad</th>
          <th>Categoría</th>
          <th>Solución</th>
          <th>Acción</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="defect in filteredDefects" :key="defect.id">
          <td>{{ defect.name }}</td>
          <td>{{ defect.description }}</td>
          <td>{{ defect.severity }}</td>
          <td>{{ defect.category }}</td>
          <td>{{ defect.solution }}</td>
          <td>
            <!-- Botón con ícono de lupa -->
            <button class="view-btn" @click="openModal(defect)">
              <i class="fa fa-search"></i>
            </button>
          </td> <!-- Botón circular -->
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Botón para agregar un defecto -->
    <button @click="showAddDefectModal = true" class="add-btn">Agregar defecto</button>

    <!-- Modal para agregar defecto -->
    <div v-if="showAddDefectModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddDefectModal">&times;</span>
        <h2>Agregar Defecto</h2>
        <form @submit.prevent="addNewDefect">
          <div>
            <label for="name" class="form-label">Nombre:</label>
            <input type="text" id="name" v-model="newDefect.name" required />
          </div>
          <div>
            <label for="description" class="form-label">Descripción:</label>
            <input type="text" id="description" v-model="newDefect.description" required />
          </div>
          <div>
            <label for="severity" class="form-label">Severidad:</label>
            <input type="text" id="severity" v-model="newDefect.severity" required />
          </div>
          <div>
            <label for="category" class="form-label">Categoría:</label>
            <input type="text" id="category" v-model="newDefect.category" required />
          </div>
          <div>
            <label for="solution" class="form-label">Solución:</label>
            <input type="text" id="solution" v-model="newDefect.solution" required />
          </div>
          <button type="submit" class="add-submit-btn">Agregar</button>
        </form>
      </div>
    </div>

    <!-- Ventana emergente para detalles del defecto -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Ficha de defecto</h2>
        <div class="modal-body">
          <p><strong>Nombre:</strong> {{ selectedDefect?.name }}</p>
          <p><strong>Descripción:</strong> {{ selectedDefect?.description }}</p>
          <p><strong>Severidad:</strong> {{ selectedDefect?.severity }}</p>
          <p><strong>Categoría:</strong> {{ selectedDefect?.category }}</p>
          <p><strong>Solución:</strong> {{ selectedDefect?.solution }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importa el componente HeaderBar (ahora CuppingHeader.vue)
import HeaderBar from '../../shared/components/HeaderBar.vue';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { defectApi } from '../api/defectApi.js'; // Usar la API real

export default {
  components: {
    HeaderBar, // Registra HeaderBar (CuppingHeader.vue)
  },
  setup() {
    const router = useRouter(); // Instanciamos el enrutador
    const defects = ref([]);
    const showModal = ref(false);
    const showAddDefectModal = ref(false);
    const selectedDefect = ref(null);
    const newDefect = ref({ name: '', description: '', severity: '', category: '', solution: '' });
    const searchTerm = ref('');
    const selectedCategory = ref('');

    const defectCategories = computed(() => {
      const cats = defects.value.map(d => d.category).filter(Boolean);
      return [...new Set(cats)];
    });

    const filteredDefects = computed(() => {
      return defects.value.filter(defect => {
        const matchesSearch =
          defect.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
          defect.description.toLowerCase().includes(searchTerm.value.toLowerCase());
        const matchesCategory =
          !selectedCategory.value || defect.category === selectedCategory.value;
        return matchesSearch && matchesCategory;
      });
    });

    const loadDefects = async () => {
      try {
        const response = await defectApi.getAll();
        defects.value = response.data;
      } catch (error) {
        console.error('Error al cargar defectos:', error);
      }
    };

    const addNewDefect = async () => {
      try {
        await defectApi.create(newDefect.value);
        await loadDefects();
        showAddDefectModal.value = false;
        newDefect.value = { name: '', description: '', severity: '', category: '', solution: '' };
      } catch (error) {
        console.error('Error al agregar defecto:', error);
      }
    };

    const closeAddDefectModal = () => {
      showAddDefectModal.value = false;
    };

    const openModal = (defect) => {
      selectedDefect.value = defect;
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    onMounted(() => {
      loadDefects();
    });

    return {
      defects,
      searchTerm,
      selectedCategory,
      filteredDefects,
      addNewDefect,
      newDefect,
      defectCategories,
      showAddDefectModal,
      closeAddDefectModal,
      showModal,
      selectedDefect,
      openModal,
      closeModal
    };
  },
};
</script>

<style scoped>
/* Estilos de la tabla y modal */
body {
  background-color: #F8F7F2; /* Fondo principal color solicitado */
  margin: 0;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.defect-list {
  padding: 20px;
}

.breadcrumb-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.breadcrumb {
  font-size: 16px;
  color: #414535; /* Color de texto solicitado */
}

/* Filtros */
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.dropdown {
  padding: 8px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* Tabla de defectos */
.defect-container {
  margin-top: 20px;
}

.defect-table {
  width: 100%;
  border-collapse: collapse;
}

.defect-table th, .defect-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
  background-color: #618985;
  color: white;
}

.defect-table i {
  color: #fff;
  cursor: pointer;
}

.defect-table th {
  background-color: #4b6f6b;
}

/* Botón circular en la columna de acción */
.view-btn {
  background-color: #414535;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
}

.view-btn:hover {
  background-color: #5a6c6a;
}

/* Modal Agregar Defecto */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  color: #222;
  padding: 20px;
  border-radius: 8px;
  width: 50%;
  max-width: 600px;
  text-align: center;
}

.modal-body {
  color: #222;
}

.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;

}

.add-btn {
  background-color: #414535;
  color: white;
  padding: 10px 15px;
  width: auto;
  border-radius: 5px;
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.form-label {
  color: #414535; /* Color de las letras en el formulario */
  font-weight: 600;
}

input[type="text"], input[type="number"] {
  padding: 8px;
  margin-top: 5px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button[type="submit"] {
  background-color: #414535;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #5a6c6a;
}
</style>
