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
      <select v-model="searchCoffee" class="dropdown">
        <option value="">Tipo de Café</option>
        <option v-for="coffee in coffeeOptions" :key="coffee" :value="coffee">{{ coffee }}</option>
      </select>

      <select v-model="searchDefect" class="dropdown">
        <option value="">Tipo de Defecto</option>
        <option v-for="defect in defectOptions" :key="defect" :value="defect">{{ defect }}</option>
      </select>
    </div>

    <!-- Tabla de defectos -->
    <div class="defect-container">
      <table class="defect-table">
        <thead>
        <tr>
          <th>Peso (g)</th>
          <th>Café</th>
          <th>Defecto</th>
          <th>Porcentaje (%)</th>
          <th>Acción</th> <!-- Nueva columna para la acción con botón -->
        </tr>
        </thead>
        <tbody>
        <tr v-for="defect in filteredDefects" :key="defect.id">
          <td>{{ defect.peso }} g</td>
          <td>{{ defect.cafe }}</td>
          <td>{{ defect.defecto }}</td>
          <td>{{ defect.porcentaje }}%</td>
          <td>
            <!-- Botón con ícono de lupa -->
            <button class="view-btn" @click="viewDefect(defect)">
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
            <label for="cafe" class="form-label">Café:</label>
            <input type="text" id="cafe" v-model="newDefect.cafe" required />
          </div>
          <div>
            <label for="defecto" class="form-label">Defecto:</label>
            <input type="text" id="defecto" v-model="newDefect.defecto" required />
          </div>
          <div>
            <label for="peso" class="form-label">Peso (g):</label>
            <input type="number" id="peso" v-model="newDefect.peso" required />
          </div>
          <div>
            <label for="porcentaje" class="form-label">Porcentaje (%):</label>
            <input type="number" id="porcentaje" v-model="newDefect.porcentaje" required />
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
          <p><strong>Causas probables:</strong> {{ selectedDefect.causas || 'No disponible' }}</p>
          <p><strong>Soluciones recomendadas:</strong> {{ selectedDefect.soluciones || 'No disponible' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importa el componente HeaderBar (ahora CuppingHeader.vue)
import HeaderBar from '../../shared/components/CuppingHeader.vue';

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // Agregamos useRouter para la redirección
import { getDefects, addDefect } from '../services/defectApi.js'; // La API falsa

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
    const newDefect = ref({ cafe: '', defecto: '', peso: '', porcentaje: '' });

    const searchCoffee = ref('');
    const searchDefect = ref('');
    const coffeeOptions = ref(['Typica', 'Arabica', 'Robusta']);
    const defectOptions = ref(['Quemado', 'Verde', 'Roto']);

    const loadDefects = async () => {
      defects.value = await getDefects();
    };

    const filteredDefects = computed(() => {
      return defects.value.filter(
          (defect) =>
              (defect.cafe.toLowerCase().includes(searchCoffee.value.toLowerCase()) || !searchCoffee.value) &&
              (defect.defecto.toLowerCase().includes(searchDefect.value.toLowerCase()) || !searchDefect.value)
      );
    });

    const addNewDefect = async () => {
      const defectData = { ...newDefect.value, id: Date.now() };
      await addDefect(defectData);
      loadDefects();
      showAddDefectModal.value = false;
      newDefect.value = { cafe: '', defecto: '', peso: '', porcentaje: '' };
    };

    const closeAddDefectModal = () => {
      showAddDefectModal.value = false;
    };

    const viewDefect = (defect) => {
      // Redirige a la página de detalles del defecto con su ID
      router.push({ name: 'defectDetails', params: { defectId: defect.id } });
    };

    const closeModal = () => {
      showModal.value = false;
    };

    loadDefects();

    return {
      defects,
      searchCoffee,
      searchDefect,
      filteredDefects,
      addNewDefect,
      newDefect,
      coffeeOptions,
      defectOptions,
      showAddDefectModal,
      closeAddDefectModal,
      showModal,
      selectedDefect,
      viewDefect,
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
  padding: 20px;
  border-radius: 8px;
  width: 50%;
  max-width: 600px;
  text-align: center;
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
