<template>
  <header class="headerBar">
    <headerBar />
  </header>

  <div class="calibration">
    <!-- Breadcrumb y mensaje de error en la misma línea -->
    <div class="breadcrumb-calibration error-breadcrumb-row">
      <span class="breadcrumb-home">{{ t('breadcrumb.home') }}</span>
      <span class="breadcrumb-separator">&gt;</span>
      <span class="breadcrumb-current">{{ t('CALIBRATION.PAGE_TITLE') }}</span>
      <span v-if="deleteErrorMsg" class="error-alert-inline">{{ deleteErrorMsg }}</span>
    </div>

    <!-- Filtros de búsqueda -->
    <div class="centered-search-container">
      <input type="text" v-model="searchTerm" :placeholder="t('CALIBRATION.SEARCH_PLACEHOLDER')" class="search-bar" />
    </div>

    <!-- Tabla de calibraciones -->
    <div class="centered-table-container">
      <h3>{{ t('CALIBRATION.TABLE_TITLE') }}</h3>
      <table class="calibration-table">
        <thead>
          <tr>
            <th></th>
            <th>{{ t('CALIBRATION.TABLE_HEADER_NAME') }}</th>
            <th>{{ t('CALIBRATION.TABLE_HEADER_METHOD') }}</th>
            <th>{{ t('CALIBRATION.TABLE_HEADER_EQUIPMENT') }}</th>
            <th>{{ t('CALIBRATION.TABLE_HEADER_OPENING') }}</th>
            <th>{{ t('CALIBRATION.TABLE_HEADER_ACTION') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cal in filteredCalibrations" :key="cal.id" :class="{selected: selectedCalibrationId === cal.id}" @click="selectedCalibrationId = cal.id">
            <td>
              <input type="checkbox" :checked="selectedCalibrationId === cal.id" @change="selectCalibration(cal.id, $event)" class="custom-checkbox" />
            </td>
            <td>{{ cal.nombre }}</td>
            <td>{{ cal.method }}</td>
            <td>{{ cal.equipment }}</td>
            <td>{{ cal.opening }}</td>
            <td class="action-cell">
              <button class="icon-btn action-btn" @click="openEditModal(cal)"><i class="fa fa-pencil"></i></button>
              <button class="icon-btn action-btn" @click="openViewModal(cal)"><i class="fa fa-search"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Botones debajo de la tabla -->
    <div class="buttons-row">
      <button @click="handleDeleteSelectedCalibration" class="delete-btn-green">{{ t('CALIBRATION.DELETE_BUTTON') }}</button>
      <button @click="showRegisterModal = true" class="register-btn">{{ t('CALIBRATION.REGISTER_BUTTON') }}</button>
    </div>

    <!-- Modal para registrar o editar calibración -->
    <div v-if="showRegisterModal" class="modal">
      <div class="modal-content calibration-modal-content">
        <span class="close" @click="closeRegisterModal">&times;</span>
        <h2 class="modal-title">{{ editMode ? t('CALIBRATION.EDIT_MODAL_TITLE') : t('CALIBRATION.REGISTER_MODAL_TITLE') }}</h2>
        <form @submit.prevent="editMode ? updateCalibration() : registerCalibration()" class="calibration-form">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_SELECT_METHOD') }}</label>
              <select v-model="newCalibration.method" required>
                <option value="">{{ t('CALIBRATION.FORM_SELECT_METHOD_PLACEHOLDER') }}</option>
                <option>{{ t('CALIBRATION.METHOD_ESPRESSO') }}</option>
                <option>{{ t('CALIBRATION.METHOD_FILTER') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_GRIND_NUMBER') }}</label>
              <input type="text" v-model="newCalibration.grind" required />
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_OPENING') }}</label>
              <input type="number" v-model="newCalibration.opening" required />
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_CUP_VOLUME') }}</label>
              <input type="number" v-model="newCalibration.volume" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_SELECT_EQUIPMENT') }}</label>
              <select v-model="newCalibration.equipment" required>
                <option value="">{{ t('CALIBRATION.FORM_SELECT_EQUIPMENT_PLACEHOLDER') }}</option>
                <option>{{ t('CALIBRATION.EQUIPMENT_ESPRESSO') }}</option>
                <option>{{ t('CALIBRATION.EQUIPMENT_FILTER') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_DATE') }}</label>
              <input type="date" v-model="newCalibration.date" required />
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_FINAL_VOLUME') }}</label>
              <input type="number" v-model="newCalibration.volumeFinal" required />
            </div>
            <div class="form-group file-group">
              <label>{{ t('CALIBRATION.FORM_VISUALIZATION') }}</label>
              <label class="file-label">
                <input type="file" @change="handleFileUpload" style="display:none;" />
                <span class="file-btn">{{ t('CALIBRATION.FORM_ATTACH_SAMPLES') }} <i class="fa fa-upload"></i></span>
              </label>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-2">
              <label>{{ t('CALIBRATION.FORM_COMMENTS') }}</label>
              <textarea v-model="newCalibration.comments" :placeholder="t('CALIBRATION.FORM_COMMENTS_PLACEHOLDER')"></textarea>
            </div>
            <div class="form-group flex-2">
              <label>{{ t('CALIBRATION.FORM_NOTES') }}</label>
              <textarea v-model="newCalibration.notes" :placeholder="t('CALIBRATION.FORM_NOTES_PLACEHOLDER')"></textarea>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="cb1" disabled />
              <input type="checkbox" id="cb2" disabled />
              <input type="checkbox" id="cb3" disabled />
            </div>
          </div>
          <button type="submit" class="register-btn-modern">{{ editMode ? t('CALIBRATION.FORM_SUBMIT_EDIT') : t('CALIBRATION.FORM_SUBMIT_REGISTER') }}</button>
        </form>
      </div>
    </div>

    <!-- Modal para ver calibración -->
    <div v-if="showViewModal" class="modal">
      <div class="modal-content calibration-modal-content">
        <span class="close" @click="closeViewModal">&times;</span>
        <h2 class="modal-title">{{ t('CALIBRATION.VIEW_MODAL_TITLE') }}</h2>
        <form v-if="showEditModal" @submit.prevent="saveEditCalibration" class="calibration-form">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_SELECT_METHOD') }}</label>
              <select v-model="editCalibrationData.method" required>
                <option value="">{{ t('CALIBRATION.FORM_SELECT_METHOD_PLACEHOLDER') }}</option>
                <option>{{ t('CALIBRATION.METHOD_ESPRESSO') }}</option>
                <option>{{ t('CALIBRATION.METHOD_FILTER') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_GRIND_NUMBER') }}</label>
              <input type="text" v-model="editCalibrationData.grind" required />
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_OPENING') }}</label>
              <input type="number" v-model="editCalibrationData.opening" required />
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_CUP_VOLUME') }}</label>
              <input type="number" v-model="editCalibrationData.volume" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_SELECT_EQUIPMENT') }}</label>
              <select v-model="editCalibrationData.equipment" required>
                <option value="">{{ t('CALIBRATION.FORM_SELECT_EQUIPMENT_PLACEHOLDER') }}</option>
                <option>{{ t('CALIBRATION.EQUIPMENT_ESPRESSO') }}</option>
                <option>{{ t('CALIBRATION.EQUIPMENT_FILTER') }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_DATE') }}</label>
              <input type="date" v-model="editCalibrationData.date" required />
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_FINAL_VOLUME') }}</label>
              <input type="number" v-model="editCalibrationData.volumeFinal" required />
            </div>
            <div class="form-group file-group">
              <label>{{ t('CALIBRATION.FORM_VISUALIZATION') }}</label>
              <label class="file-label">
                <input type="file" @change="handleFileUpload" style="display:none;" />
                <span class="file-btn">{{ t('CALIBRATION.FORM_ATTACH_SAMPLES') }} <i class="fa fa-upload"></i></span>
              </label>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group flex-2">
              <label>{{ t('CALIBRATION.FORM_COMMENTS') }}</label>
              <textarea v-model="editCalibrationData.comments"></textarea>
            </div>
            <div class="form-group flex-2">
              <label>{{ t('CALIBRATION.FORM_NOTES') }}</label>
              <textarea v-model="editCalibrationData.notes"></textarea>
            </div>
            <div class="checkbox-group">
              <input type="checkbox" id="cb1" disabled />
              <input type="checkbox" id="cb2" disabled />
              <input type="checkbox" id="cb3" disabled />
            </div>
          </div>
          <button type="submit" class="register-btn-modern">{{ t('CALIBRATION.FORM_SUBMIT_EDIT') }}</button>
        </form>
        <form v-else class="calibration-form">
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_SELECT_METHOD') }}</label>
              <input type="text" :value="selectedCalibration?.method" disabled />
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_GRIND_NUMBER') }}</label>
              <input type="text" :value="selectedCalibration?.grind" disabled />
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_OPENING') }}</label>
              <input type="text" :value="selectedCalibration?.opening" disabled />
            </div>
            <div class="form-group">
              <label>{{ t('CALIBRATION.FORM_CUP_VOLUME') }}</label>
              <input type="text" :value="selectedCalibration?.volume" disabled />
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { getAllCalibrations, saveCalibration, deleteCalibration } from '../service';
import HeaderBar from '../../public/components/headerBar.vue';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

export default {
  name: 'Calibration',
  components: {
    HeaderBar,
  },
  setup() {
    const { t } = useI18n();
    const selectedCalibrationId = ref(null);
    return { t, selectedCalibrationId };
  },
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
      selectedCalibration: null,
      editCalibrationData: {},
      userPlan: '',
      deleteErrorMsg: '',
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
    },
  },
  methods: {
    loadCalibrations() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const userId = currentUser?.id;
      const userPlan = currentUser?.plan;
      this.userPlan = userPlan;
      const loadCalibrations = async () => {
        const response = await getAllCalibrations(userId);
        this.calibrationRecords = userPlan === 'owner' ? response.data : response.data.filter(c => c.user_id === userId);
      };
      loadCalibrations();
    },
    registerCalibration() {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const userId = currentUser?.id;
      const registerCalibration = async () => {
        await saveCalibration({ ...this.newCalibration, user_id: userId }, userId);
        await this.loadCalibrations();
          this.showRegisterModal = false;
      };
      registerCalibration();
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
        method: '', grind: '', opening: '', volume: '', equipment: '',
        date: '', volumeFinal: '', visualization: '', comments: '', notes: '',
      };
    },
    closeViewModal() {
      this.showViewModal = false;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (this.editMode) {
        this.editCalibrationData.visualization = file;
      } else {
      this.newCalibration.visualization = file;
      }
    },
    updateCalibration() {
      axios.put(`/api/calibrations/${this.editCalibrationData.id}`, this.editCalibrationData)
        .then(() => {
          this.loadCalibrations();
          this.closeRegisterModal();
        })
        .catch(error => {
          console.error('Error al actualizar calibración:', error);
        });
    },
    canDelete(cal) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const userId = currentUser?.id;
      const userPlan = currentUser?.plan;
      return cal.user_id === userId || userPlan === 'owner';
    },
    handleDelete(cal) {
      if (!this.canDelete(cal)) return;
      if (!confirm(this.t('CALIBRATION.CONFIRM_DELETE'))) return;
      axios.delete(`/api/calibrations/${cal.id}`)
        .then(() => {
          this.loadCalibrations();
        })
        .catch(error => {
          console.error('Error al eliminar calibración:', error);
        });
    },
    handleDeleteSelectedCalibration() {
      if (!this.selectedCalibrationId) {
        this.deleteErrorMsg = this.t('CALIBRATION.ERROR_NO_CALIBRATION_SELECTED');
        return;
      }
      if (!confirm(this.t('CALIBRATION.CONFIRM_DELETE_SELECTED'))) return;
      axios.delete(`/api/calibrations/${this.selectedCalibrationId}`)
        .then(() => {
          this.loadCalibrations();
          this.selectedCalibrationId = null;
        })
        .catch(error => {
          console.error('Error al eliminar calibración:', error);
        });
    },
    selectCalibration(id, event) {
      if (event.target.checked) {
        this.selectedCalibrationId = id;
      } else {
        this.selectedCalibrationId = null;
      }
    },
  },
  mounted() {
    this.loadCalibrations();
  },
};
</script>

<style scoped>
/* Estilos de la tabla y modal */
.calibration {
  background-color: #F8F7F2;
  min-height: 100vh;
  padding-bottom: 40px;
}

.breadcrumb-calibration {
  max-width: 1100px;
  margin: 70px auto 0 auto;
  display: flex;
  align-items: center;
  font-size: 2rem;
  color: #414535;
  font-family: 'Inter', sans-serif;
  padding-bottom: 32px;
  justify-content: flex-start;
}

.breadcrumb-home {
  color: #414535;
  font-weight: 400;
}

.breadcrumb-separator {
  color: #b0b0b0;
  margin: 0 8px;
  font-size: 2.2rem;
}

.breadcrumb-current {
  color: #414535;
  font-weight: 500;
}

.centered-table-container {
  max-width: 1100px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 0 0 30px 0;
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
  color: #fff;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  border: none;
  margin-top: 0;
  cursor: pointer;
  transition: background 0.2s;
}

.register-btn:hover {
  background-color: #23231f;
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
.centered-search-container {
  max-width: 1100px;
  margin: 0 auto 24px auto;
  display: flex;
  justify-content: center;
}
.action-cell {
  min-width: 120px;
  max-width: 140px;
  text-align: center;
}
.action-btn {
  background: #23231f;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  margin: 0 2px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.action-btn:hover {
  background: #414535;
}
.delete-btn-green {
  background-color: #618985;
  color: #fff;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  border: none;
  margin-top: 0;
  cursor: pointer;
  transition: background 0.2s;
}
.delete-btn-green:hover {
  background-color: #4b6f6b;
}
.buttons-row {
  max-width: 1100px;
  margin: 16px auto 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}
.custom-checkbox {
  width: 22px;
  height: 22px;
  accent-color: #414535;
  border-radius: 4px;
  border: 2px solid #414535;
  background: #414535;
}
/* Nueva clase para alinear breadcrumb y error */
.error-breadcrumb-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  position: relative;
}
.error-alert-inline {
  margin-left: auto;
  background: #f8d7da;
  color: #721c24;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 0.98em;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1.5px solid #d32f2f;
}
</style>




