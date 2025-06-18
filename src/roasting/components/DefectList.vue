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

    <!-- Filtros de búsqueda modernos -->
    <div class="filters-row">
      <div class="filter-block">
        <label class="filter-label">Tipo de Café</label>
        <div class="filter-input-group">
          <input type="text" v-model="searchCafe" placeholder="Buscar café..." class="search-bar" />
          <select v-model="selectedCafe" class="dropdown">
            <option value="">Todos</option>
            <option v-for="cafe in uniqueCafes" :key="cafe" :value="cafe">{{ cafe }}</option>
          </select>
        </div>
      </div>
      <div class="filter-block">
        <label class="filter-label">Tipo de Defecto</label>
        <div class="filter-input-group">
          <input type="text" v-model="searchDefecto" placeholder="Buscar defecto..." class="search-bar" />
          <select v-model="selectedDefecto" class="dropdown">
            <option value="">Todos</option>
            <option v-for="defecto in uniqueDefectos" :key="defecto" :value="defecto">{{ defecto }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla de defectos -->
    <div class="defect-container">
      <table class="defect-table">
        <thead>
        <tr>
          <th>Peso</th>
          <th>Café</th>
          <th>Defecto</th>
          <th>Porcentaje</th>
          <th>Acción</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="defect in filteredDefects" :key="defect.id">
          <td>{{ defect.peso || '' }}</td>
          <td>{{ defect.cafe || '' }}</td>
          <td>{{ defect.defecto }}</td>
          <td>{{ defect.porcentaje || '' }}</td>
          <td>
            <button class="view-btn" @click="openModal(defect)">
              <i class="fa fa-search"></i>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Botón para agregar un defecto -->
    <button @click="showAddDefectModal = true" class="add-btn-modern">Agregar defecto</button>

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

    <!-- Modal de ver defecto moderno -->
    <div v-if="showModal" class="modal">
      <div class="modal-content defect-modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>Ficha de defecto</h2>
        <div class="defect-info">
          <div class="causes-block">
            <span class="block-title">Causas probables</span>
            <div class="block-content">{{ selectedDefect?.causas || 'No disponible' }}</div>
          </div>
          <div class="solutions-block">
            <span class="block-title">Soluciones recomendadas</span>
            <div class="block-content">{{ selectedDefect?.soluciones || 'No disponible' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>
  </div>
</template>

<script>
// Importa el componente HeaderBar (ahora CuppingHeader.vue)
import HeaderBar from '../../public/components/headerBar.vue'
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllDefects, createDefect } from '../service';

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
    const searchCafe = ref('');
    const searchDefecto = ref('');
    const selectedCafe = ref('');
    const selectedDefecto = ref('');
    const errorMsg = ref('');

    const uniqueCafes = computed(() => [...new Set(defects.value.map(d => d.cafe).filter(Boolean))]);
    const uniqueDefectos = computed(() => [...new Set(defects.value.map(d => d.defecto).filter(Boolean))]);

    const filteredDefects = computed(() => {
      return defects.value.filter(defect => {
        const matchCafe = (!selectedCafe.value || defect.cafe === selectedCafe.value) &&
          (!searchCafe.value || (defect.cafe && defect.cafe.toLowerCase().includes(searchCafe.value.toLowerCase())));
        const matchDefecto = (!selectedDefecto.value || defect.defecto === selectedDefecto.value) &&
          (!searchDefecto.value || (defect.defecto && defect.defecto.toLowerCase().includes(searchDefecto.value.toLowerCase())));
        return matchCafe && matchDefecto;
      });
    });

    const loadDefects = async () => {
      try {
        const response = await getAllDefects();
        console.log('Defectos recibidos:', response.data);
        defects.value = response.data;
        errorMsg.value = '';
      } catch (error) {
        console.error('Error al cargar defectos:', error);
        errorMsg.value = 'No se pudieron cargar los defectos.';
      }
    };

    const addNewDefect = async () => {
      try {
        console.log('Nuevo defecto a agregar:', newDefect.value);
        await createDefect(newDefect.value);
        await loadDefects();
        showAddDefectModal.value = false;
        newDefect.value = { name: '', description: '', severity: '', category: '', solution: '' };
        errorMsg.value = '';
      } catch (error) {
        console.error('Error al agregar defecto:', error);
        errorMsg.value = 'No se pudo agregar el defecto.';
      }
    };

    const closeAddDefectModal = () => {
      showAddDefectModal.value = false;
    };

    const openModal = (defect) => {
      selectedDefect.value = { ...defect };
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
      showModal,
      showAddDefectModal,
      selectedDefect,
      newDefect,
      searchCafe,
      searchDefecto,
      selectedCafe,
      selectedDefecto,
      uniqueCafes,
      uniqueDefectos,
      filteredDefects,
      addNewDefect,
      closeAddDefectModal,
      openModal,
      closeModal,
      errorMsg
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
.filters-row {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
}

.filter-block {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-weight: 600;
  margin-bottom: 6px;
  color: #414535;
}

.filter-input-group {
  display: flex;
  gap: 8px;
}

.search-bar {
  flex: 2;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  color: #111;
}

.dropdown {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  color: #111;
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

.add-btn-modern {
  background-color: #414535;
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  border: none;
  margin-top: 18px;
  cursor: pointer;
  float: right;
  transition: background 0.2s;
}

.add-btn-modern:hover {
  background-color: #5a6c6a;
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

/* Mensaje de error */
.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.defect-modal-content {
  background-color: #fff;
  color: #414535;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 30px 30px 20px 30px;
  max-width: 900px;
  width: 90vw;
  text-align: left;
}
.defect-info {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 30px;
  margin-bottom: 30px;
}
.causes-block, .solutions-block {
  flex: 1;
  background: #f5f5f5;
  border-radius: 20px;
  margin: 0 20px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 180px;
}
.block-title {
  font-size: 1.3em;
  font-weight: 500;
  margin-bottom: 20px;
}
.block-content {
  font-size: 1.1em;
  color: #414535;
  text-align: center;
}
.close-btn {
  background-color: #414535;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}
.close-btn:hover {
  background-color: #3c3f31;
}
</style>
