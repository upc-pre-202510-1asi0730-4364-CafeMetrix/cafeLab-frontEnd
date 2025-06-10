<template>
  <div class="calibration">
    <!-- Breadcrumb -->
    <div class="breadcrumb-container">
      <div class="breadcrumb">
        {{ $t('breadcrumb.home') }} > <strong>{{ $t('breadcrumb.calibration') }}</strong>
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
    <div class="defects-table-container">
      <h3>Defectos</h3>
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
              <button class="icon-btn" @click="openViewModal(defect)"><i class="fa fa-search"></i></button>
              <button class="icon-btn" @click="openEditModal(defect)"><i class="fa fa-pencil"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Botón para registrar nueva calibración -->
    <button @click="showRegisterModal = true" class="register-btn">Registrar Nueva Calibración</button>

    <!-- Modal para registrar o editar calibración -->
    <div v-if="showRegisterModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeRegisterModal">&times;</span>
        <h2>{{ editMode ? 'Editar Calibración' : 'Registrar Nueva Calibración' }}</h2>
        <form @submit.prevent="editMode ? updateCalibration() : registerCalibration">
          <table>
            <tbody>
              <!-- Primera fila -->
              <tr>
                <td><label for="calibration-method">Selección de Método:</label></td>
                <td>
                  <select id="calibration-method" v-model="newCalibration.method" required>
                    <option value="">Seleccione Método</option>
                    <option>Espresso</option>
                    <option>Filtrado</option>
                  </select>
                </td>
                <td><label for="calibration-grind">N° de molienda:</label></td>
                <td><input type="text" id="calibration-grind" v-model="newCalibration.grind" required /></td>
              </tr>

              <!-- Segunda fila -->
              <tr>
                <td><label for="calibration-opening">Apertura (mm):</label></td>
                <td><input type="number" id="calibration-opening" v-model="newCalibration.opening" required /></td>
                <td><label for="calibration-volume">Volumen en taza (ml):</label></td>
                <td><input type="number" id="calibration-volume" v-model="newCalibration.volume" required /></td>
              </tr>

              <!-- Tercera fila -->
              <tr>
                <td><label for="calibration-equipment">Selección de equipo:</label></td>
                <td>
                  <select id="calibration-equipment" v-model="newCalibration.equipment" required>
                    <option value="">Seleccione Equipo</option>
                    <option>Maquina Espresso</option>
                    <option>Maquina Filtrado</option>
                  </select>
                </td>
                <td><label for="calibration-date">Fecha de calibración:</label></td>
                <td><input type="date" id="calibration-date" v-model="newCalibration.date" required /></td>
              </tr>

              <!-- Cuarta fila -->
              <tr>
                <td><label for="calibration-volume-final">Volumen final (ml):</label></td>
                <td><input type="number" id="calibration-volume-final" v-model="newCalibration.volumeFinal" required /></td>
                <td><label for="calibration-visualization">Visualización:</label></td>
                <td><input type="file" id="calibration-visualization" @change="handleFileUpload" /></td>
              </tr>

              <!-- Quinta fila -->
              <tr>
                <td><label for="calibration-comments">Comentarios:</label></td>
                <td colspan="3"><textarea id="calibration-comments" v-model="newCalibration.comments"></textarea></td>
              </tr>

              <!-- Sexta fila -->
              <tr>
                <td><label for="calibration-notes">Notas:</label></td>
                <td colspan="3"><textarea id="calibration-notes" v-model="newCalibration.notes"></textarea></td>
              </tr>
            </tbody>
          </table>

          <button type="submit" class="submit-btn">Registrar Calibración</button>
        </form>
      </div>
    </div>

    <!-- Modal de ver defecto -->
    <div v-if="showViewModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeViewModal">&times;</span>
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

    <!-- Modal de editar defecto -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h2>Editar defecto</h2>
        <form @submit.prevent="saveEditDefect">
          <div>
            <label>Nombre:</label>
            <input type="text" v-model="editDefectData.name" required />
          </div>
          <div>
            <label>Descripción:</label>
            <input type="text" v-model="editDefectData.description" required />
          </div>
          <div>
            <label>Severidad:</label>
            <input type="text" v-model="editDefectData.severity" required />
          </div>
          <div>
            <label>Categoría:</label>
            <input type="text" v-model="editDefectData.category" required />
          </div>
          <div>
            <label>Solución:</label>
            <input type="text" v-model="editDefectData.solution" required />
          </div>
          <button type="submit" class="add-submit-btn">Guardar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Importar Axios para las peticiones HTTP
import { defectApi } from '../../roasting/api/defectApi';

export default {
  data() {
    return {
      showRegisterModal: false,
      editMode: false, // Indica si es modo edición o nuevo registro
      selectedMethod: '',
      methods: ['Espresso', 'Filtrado'],
      calibrationRecords: [], // Los registros que obtendremos desde la API
      newCalibration: {
        method: '',
        grind: '',
        opening: '',
        volume: '',
        equipment: '',
        date: '',
        volumeFinal: '',
        visualization: '',
        comments: '',
        notes: '',
      },
      defects: [],
      searchTerm: '',
      selectedCategory: '',
      showViewModal: false,
      showEditModal: false,
      selectedDefect: null,
      editDefectData: { name: '', description: '', severity: '', category: '', solution: '' },
    };
  },
  computed: {
    defectCategories() {
      // Devuelve las categorías únicas de los defectos
      const cats = this.defects.map(d => d.category).filter(Boolean);
      return [...new Set(cats)];
    },
    filteredDefects() {
      return this.defects.filter(defect => {
        const matchesSearch =
          defect.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          defect.description.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesCategory =
          !this.selectedCategory || defect.category === this.selectedCategory;
        return matchesSearch && matchesCategory;
      });
    }
  },
  methods: {
    // Cargar los registros de calibración desde la API
    loadCalibrations() {
      axios.get('https://jsonplaceholder.typicode.com/posts') // Usamos JSONPlaceholder como API falsa
          .then(response => {
            this.calibrationRecords = response.data.slice(0, 5); // Limitar a 5 registros para la demo
          })
          .catch(error => {
            console.error("Hubo un error al obtener los datos:", error);
          });
    },
    // Registrar una nueva calibración
    registerCalibration() {
      const calibrationData = { ...this.newCalibration, userId: 1 };

      axios.post('https://jsonplaceholder.typicode.com/posts', calibrationData)
          .then(response => {
            this.calibrationRecords.unshift(response.data); // Mostrar el nuevo registro
            this.showRegisterModal = false; // Cerrar el modal
            this.resetForm();
          })
          .catch(error => {
            console.error("Hubo un error al registrar los datos:", error);
          });
    },
    // Actualizar un registro existente
    updateCalibration() {
      axios.put(`https://jsonplaceholder.typicode.com/posts/${this.newCalibration.id}`, this.newCalibration)
          .then(response => {
            const index = this.calibrationRecords.findIndex(record => record.id === this.newCalibration.id);
            this.calibrationRecords[index] = response.data; // Actualizar el registro en la tabla
            this.showRegisterModal = false; // Cerrar el modal
            this.resetForm();
          })
          .catch(error => {
            console.error("Hubo un error al actualizar los datos:", error);
          });
    },
    // Configurar el modal para la edición
    openEditModal(defect) {
      this.editDefectData = { ...defect };
      this.showEditModal = true;
    },
    // Función para manejar el cambio de archivo (visualización)
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.newCalibration.visualization = file;
    },
    // Resetear el formulario
    resetForm() {
      this.newCalibration = {
        method: '',
        grind: '',
        opening: '',
        volume: '',
        equipment: '',
        date: '',
        volumeFinal: '',
        visualization: '',
        comments: '',
        notes: '',
      };
      this.editMode = false;
    },
    // Cerrar el modal de registro
    closeRegisterModal() {
      this.showRegisterModal = false;
      this.resetForm();
    },
    openViewModal(defect) {
      this.selectedDefect = defect;
      this.showViewModal = true;
    },
    closeViewModal() {
      this.showViewModal = false;
    },
    async saveEditDefect() {
      try {
        await defectApi.update(this.editDefectData.id, this.editDefectData);
        this.loadDefects();
        this.showEditModal = false;
      } catch (e) {
        console.error('Error al guardar defecto', e);
      }
    },
    loadDefects() {
      defectApi.getAll().then(response => {
        this.defects = response.data;
      }).catch(e => console.error('Error al cargar defectos', e));
    }
  },
  mounted() {
    // Cargar los registros cuando el componente se monte
    this.loadCalibrations();
    this.loadDefects();
  },
};
</script>

<style scoped>
/* Estilos de la tabla y modal */
.calibration {
  padding: 20px;
  background-color: #f8f7f2;
  color: #414535;
}

.breadcrumb-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.breadcrumb {
  font-size: 16px;
  color: #414535;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  vertical-align: middle;
}

table th {
  background-color: #4b6f6b;
  color: white;
}

table td {
  background-color: white;
}

input,
select,
textarea {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

textarea {
  height: 100px;
}

button.submit-btn {
  background-color: #414535;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button.submit-btn:hover {
  background-color: #5a6c6a;
}

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

.register-btn {
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

.icon-btn {
  background: #222;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  margin: 2px;
  font-size: 1.1em;
  cursor: pointer;
  transition: background 0.2s;
}

.icon-btn:hover {
  background: #444;
}

.modal-body {
  color: #222;
}

.add-submit-btn {
  background-color: #414535;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.add-submit-btn:hover {
  background-color: #5a6c6a;
}
</style>




