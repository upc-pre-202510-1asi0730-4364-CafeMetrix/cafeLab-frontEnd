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
      <input type="text" v-model="searchTerm" placeholder="Buscar por método, equipo o fecha..." class="search-bar" />
    </div>

    <!-- Tabla de calibraciones -->
    <div class="calibrations-table-container">
      <h3>Calibraciones</h3>
      <table class="calibration-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Método</th>
            <th>Equipo</th>
            <th>Apertura (mm)</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cal in filteredCalibrations" :key="cal.id">
            <td>{{ cal.nombre }}</td>
            <td>{{ cal.method }}</td>
            <td>{{ cal.equipment }}</td>
            <td>{{ cal.opening }}</td>
            <td>
              <button class="icon-btn" @click="openEditModal(cal)"><i class="fa fa-pencil"></i></button>
              <button class="icon-btn" @click="openViewModal(cal)"><i class="fa fa-search"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Botón para registrar nueva calibración -->
    <button @click="showRegisterModal = true" class="register-btn">Registrar Nueva Calibración</button>

    <!-- Modal para registrar o editar calibración -->
    <div v-if="showRegisterModal" class="modal">
      <div class="modal-content calibration-modal-content">
        <span class="close" @click="closeRegisterModal">&times;</span>
        <h2 class="modal-title">Registrar Calibracion</h2>
        <form @submit.prevent="editMode ? updateCalibration() : registerCalibration" class="calibration-form">
          <div class="form-row">
            <div class="form-group">
              <label>Selección de Método</label>
              <select v-model="newCalibration.method" required>
                <option value="">Seleccione Método</option>
                <option>Espresso</option>
                <option>Filtrado</option>
              </select>
            </div>
            <div class="form-group">
              <label>N° de molienda</label>
              <input type="text" v-model="newCalibration.grind" required />
            </div>
            <div class="form-group">
              <label>Apertura (mm)</label>
              <input type="number" v-model="newCalibration.opening" required />
            </div>
            <div class="form-group">
              <label>Volumen en taza (ml)</label>
              <input type="number" v-model="newCalibration.volume" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Selección de equipo</label>
              <select v-model="newCalibration.equipment" required>
                <option value="">Seleccione Equipo</option>
                <option>Maquina Espresso</option>
                <option>Maquina Filtrado</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fecha de calibración</label>
              <input type="date" v-model="newCalibration.date" required />
            </div>
            <div class="form-group">
              <label>Volumen final (ml)</label>
              <input type="number" v-model="newCalibration.volumeFinal" required />
            </div>
            <div class="form-group file-group">
              <label>Visualización</label>
              <label class="file-label">
                <input type="file" @change="handleFileUpload" style="display:none;" />
                <span class="file-btn">Adjuntar muestras <i class="fa fa-upload"></i></span>
              </label>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-2">
              <label>Comentarios:</label>
              <textarea v-model="newCalibration.comments" placeholder="La densidad del espresso puede variar entre 0.95-1.05 g/mL"></textarea>
            </div>
            <div class="form-group flex-2">
              <label>Notas:</label>
              <textarea v-model="newCalibration.notes" placeholder="A mayor altitud, menor punto de ebullición del agua"></textarea>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="cb1" disabled />
              <input type="checkbox" id="cb2" disabled />
              <input type="checkbox" id="cb3" disabled />
            </div>
          </div>
          <button type="submit" class="register-btn-modern">Registrar Calibracion</button>
        </form>
      </div>
    </div>

    <!-- Modal para ver/editar calibración -->
    <div v-if="showViewModal || showEditModal" class="modal">
      <div class="modal-content calibration-modal-content">
        <span class="close" @click="showViewModal ? closeViewModal() : closeEditModal()">&times;</span>
        <h2 class="modal-title">{{ showEditModal ? 'Editar Calibración' : 'Ficha de Calibración' }}</h2>
        <form v-if="showEditModal" @submit.prevent="saveEditCalibration" class="calibration-form">
          <div class="form-row">
            <div class="form-group">
              <label>Selección de Método</label>
              <select v-model="editCalibrationData.method" required>
                <option value="">Seleccione Método</option>
                <option>Espresso</option>
                <option>Filtrado</option>
              </select>
            </div>
            <div class="form-group">
              <label>N° de molienda</label>
              <input type="text" v-model="editCalibrationData.grind" required />
            </div>
            <div class="form-group">
              <label>Apertura (mm)</label>
              <input type="number" v-model="editCalibrationData.opening" required />
            </div>
            <div class="form-group">
              <label>Volumen en taza (ml)</label>
              <input type="number" v-model="editCalibrationData.volume" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Selección de equipo</label>
              <select v-model="editCalibrationData.equipment" required>
                <option value="">Seleccione Equipo</option>
                <option>Maquina Espresso</option>
                <option>Maquina Filtrado</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fecha de calibración</label>
              <input type="date" v-model="editCalibrationData.date" required />
            </div>
            <div class="form-group">
              <label>Volumen final (ml)</label>
              <input type="number" v-model="editCalibrationData.volumeFinal" required />
            </div>
            <div class="form-group file-group">
              <label>Visualización</label>
              <label class="file-label">
                <input type="file" @change="handleFileUpload" style="display:none;" />
                <span class="file-btn">Adjuntar muestras <i class="fa fa-upload"></i></span>
              </label>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-2">
              <label>Comentarios:</label>
              <textarea v-model="editCalibrationData.comments"></textarea>
            </div>
            <div class="form-group flex-2">
              <label>Notas:</label>
              <textarea v-model="editCalibrationData.notes"></textarea>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="cb1" disabled />
              <input type="checkbox" id="cb2" disabled />
              <input type="checkbox" id="cb3" disabled />
            </div>
          </div>
          <button type="submit" class="register-btn-modern">Guardar Cambios</button>
        </form>
        <form v-else class="calibration-form">
          <div class="form-row">
            <div class="form-group">
              <label>Selección de Método</label>
              <input type="text" :value="selectedCalibration?.method" disabled />
            </div>
            <div class="form-group">
              <label>N° de molienda</label>
              <input type="text" :value="selectedCalibration?.grind" disabled />
            </div>
            <div class="form-group">
              <label>Apertura (mm)</label>
              <input type="number" :value="selectedCalibration?.opening" disabled />
            </div>
            <div class="form-group">
              <label>Volumen en taza (ml)</label>
              <input type="number" :value="selectedCalibration?.volume" disabled />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Selección de equipo</label>
              <input type="text" :value="selectedCalibration?.equipment" disabled />
            </div>
            <div class="form-group">
              <label>Fecha de calibración</label>
              <input type="date" :value="selectedCalibration?.date" disabled />
            </div>
            <div class="form-group">
              <label>Volumen final (ml)</label>
              <input type="number" :value="selectedCalibration?.volumeFinal" disabled />
            </div>
            <div class="form-group file-group">
              <label>Visualización</label>
              <input type="text" :value="selectedCalibration?.visualization" disabled />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-2">
              <label>Comentarios:</label>
              <textarea :value="selectedCalibration?.comments" disabled></textarea>
            </div>
            <div class="form-group flex-2">
              <label>Notas:</label>
              <textarea :value="selectedCalibration?.notes" disabled></textarea>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="cb1" disabled />
              <input type="checkbox" id="cb2" disabled />
              <input type="checkbox" id="cb3" disabled />
            </div>
          </div>
          <button type="button" class="register-btn-modern" @click="closeViewModal">Cerrar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAllCalibrations, saveCalibration } from '../service';
import HeaderBar from '../../public/components/headerBar.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  data() {
    return {
      showRegisterModal: false,
      editMode: false,
      calibrationRecords: [],
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
      searchTerm: '',
      showViewModal: false,
      showEditModal: false,
      selectedCalibration: null,
      editCalibrationData: {},
    };
  },
  computed: {
    filteredCalibrations() {
      const term = this.searchTerm.toLowerCase();
      return this.calibrationRecords.filter(cal =>
        (cal.method && cal.method.toLowerCase().includes(term)) ||
        (cal.equipment && cal.equipment.toLowerCase().includes(term)) ||
        (cal.date && cal.date.toLowerCase().includes(term))
      );
    }
  },
  methods: {
    loadCalibrations() {
      getAllCalibrations()
        .then(response => {
          this.calibrationRecords = response.data;
        })
        .catch(error => {
          console.error('Error al obtener calibraciones:', error);
        });
    },
    registerCalibration() {
      axios.post('/api/calibrations', this.newCalibration)
        .then(() => {
          this.loadCalibrations();
          this.showRegisterModal = false;
          this.resetForm();
        })
        .catch(error => {
          console.error('Error al registrar calibración:', error);
        });
    },
    openEditModal(cal) {
      this.editCalibrationData = { ...cal };
      this.editMode = true;
      this.showRegisterModal = true;
    },
    openViewModal(cal) {
      this.selectedCalibration = cal;
      this.showViewModal = true;
    },
    closeRegisterModal() {
      this.showRegisterModal = false;
      this.editMode = false;
      this.resetForm();
    },
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
    },
    closeViewModal() {
      this.showViewModal = false;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.newCalibration.visualization = file;
    },
    async saveEditCalibration() {
      try {
        await axios.put(`/api/calibrations/${this.editCalibrationData.id}`, this.editCalibrationData);
        this.loadCalibrations();
        this.showEditModal = false;
      } catch (e) {
        console.error('Error al guardar calibración', e);
      }
    },
    updateCalibration() {
      axios.put(`/api/calibrations/${this.newCalibration.id}`, this.newCalibration)
        .then(() => {
          this.loadCalibrations();
          this.showRegisterModal = false;
          this.resetForm();
        })
        .catch(error => {
          console.error('Error al actualizar calibración', error);
        });
    }
  },
  mounted() {
    this.loadCalibrations();
  }
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

.calibrations-table-container {
  margin-top: 24px;
}

.calibration-table {
  width: 100%;
  border-collapse: collapse;
  background: #f8f7f2;
}

.calibration-table th, .calibration-table td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
  vertical-align: middle;
}

.calibration-table th {
  background-color: #618985;
  color: white;
}

.calibration-table td {
  background-color: white;
  color: #414535;
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
.calibration-info {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 30px;
  margin-bottom: 30px;
}
.details-block, .results-block {
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
.calibration-modal-content {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 32px 36px 24px 36px;
  max-width: 800px;
  width: 90vw;
  position: relative;
}
.modal-title {
  font-size: 1.4em;
  font-weight: 700;
  margin-bottom: 24px;
  color: #414535;
  text-align: left;
}
.calibration-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form-row {
  display: flex;
  gap: 18px;
  margin-bottom: 0;
}
.form-group {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 120px;
}
.flex-2 {
  flex: 2;
}
.form-group label {
  font-size: 0.98em;
  font-weight: 600;
  margin-bottom: 6px;
  color: #414535;
}
.form-group input,
.form-group select,
.form-group textarea {
  border: 1px solid #d1d1c9;
  border-radius: 7px;
  padding: 8px 10px;
  font-size: 1em;
  background: #f8f7f2;
  color: #414535;
  outline: none;
  margin-bottom: 0;
  transition: border 0.2s;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border: 1.5px solid #618985;
}
.form-group textarea {
  min-height: 48px;
  resize: vertical;
}
.file-group .file-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.file-btn {
  background: #414535;
  color: #fff;
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 1em;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: background 0.2s;
}
.file-btn:hover {
  background: #5a6c6a;
}
.checkbox-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  gap: 18px;
  margin-left: 12px;
}
.checkbox-group input[type="checkbox"] {
  width: 22px;
  height: 22px;
  accent-color: #e57373;
  border-radius: 4px;
  border: 2px solid #e57373;
  background: #fff;
}
.register-btn-modern {
  background: #414535;
  color: #fff;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  border: none;
  margin-top: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.register-btn-modern:hover {
  background: #5a6c6a;
}
</style>




