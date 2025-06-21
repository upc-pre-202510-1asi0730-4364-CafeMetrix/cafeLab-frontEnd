<template>
  <div class="lot-container">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <a @click="router.push('/')">Inicio</a> / {{ t('LOTS.TITLE') }}
    </div>

    <!-- Search -->
    <div class="search-container">
      <div class="search-box">
        <input
            type="text"
            v-model="searchQuery"
            :placeholder="t('LOTS.SEARCH_PLACEHOLDER')"
            @keyup.enter="searchLots"
        />
        <button class="search-button" @click="searchLots">
          <span class="material-icons">search</span>
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>{{ t('COMMON.LOADING') }}</p>
    </div>


    <!-- Lots Table -->
    <div v-else>
      <div class="table-container">
        <table class="lot-table">
          <thead>
          <tr>
            <th>{{ t('LOTS.LOT_NAME') }}</th>
            <th>{{ t('LOTS.COFFEE_TYPE') }}</th>
            <th>{{ t('LOTS.WEIGHT') }}</th>
            <th>{{ t('LOTS.SUPPLIER') }}</th>
            <th class="action-cell">{{ t('COMMON.ACTIONS') }}</th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="lots.length === 0">
            <td colspan="5" class="empty-message">
              {{ t('LOTS.NO_LOTS_FOUND') }}
            </td>
          </tr>
          <tr v-for="lot in lots" :key="lot.id">
            <td>{{ lot.lot_name }}</td>
            <td>{{ lot.coffee_type }}</td>
            <td>{{ lot.weight }} kg</td>
            <td>{{ getSupplierName(lot.supplier_id) }}</td>
            <td class="action-cell">
              <button class="action-button" @click="viewLotDetails(lot)">
                <span class="material-icons">visibility</span>
              </button>
            </td>
              <td class="action-cell">
              <button class="action-button" @click="editLot(lot)">
                <span class="material-icons">edit</span>
              </button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

    </div>



    <!-- Register Button -->
    <div class="register-container">
      <button class="register-button" @click="showRegisterModal = true">
        {{ t('LOTS.REGISTER_BUTTON') }}
      </button>
    </div>

    <!-- Register Modal -->
    <div v-if="showRegisterModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ t('LOTS.REGISTER_TITLE') }}</h2>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('LOTS.LOT_NAME') }}</label>
            <input v-model="newLot.lot_name" />
          </div>
          <div class="form-group">
            <label>{{ t('LOTS.COFFEE_TYPE') }}</label>
            <select v-model="newLot.coffee_type">
              <option value="" disabled>{{ t('COMMON.SELECT') }}</option>
              <option v-for="type in coffeeTypes" :key="type">{{ type }}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('LOTS.PROCESSING_METHOD') }}</label>
            <select v-model="newLot.processing_method">
              <option value="" disabled>{{ t('COMMON.SELECT') }}</option>
              <option v-for="method in processTypes" :key="method">{{ method }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ t('LOTS.ALTITUDE') }}</label>
            <input type="number" v-model="newLot.altitude" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('LOTS.WEIGHT') }}</label>
            <input type="number" v-model="newLot.weight" />
          </div>
          <div class="form-group">
            <label>{{ t('LOTS.ORIGIN') }}</label>
            <input v-model="newLot.origin" />
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('LOTS.SUPPLIER') }}</label>
          <select v-model="newLot.supplier_id">
            <option value="" disabled>{{ t('COMMON.SELECT') }}</option>
            <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>

        <div class="form-group certifications-container">
          <label>{{ t('LOTS.CERTIFICATIONS') }}</label>
          <div class="certification-input">
            <select v-model="newCertification">
              <option value="" disabled>{{ t('COMMON.SELECT') }}</option>
              <option v-for="cert in certificationsOptions" :key="cert" :value="cert">{{ cert }}</option>
            </select>
            <button class="add-button" @click="addCertification(newCertification)">
              <i class="material-icons">add</i>
            </button>
          </div>
          <div class="certifications-tags">
            <div class="certification-tag" v-for="(cert, index) in newLot.certifications" :key="index">
              {{ cert }}
              <button class="remove-tag" @click="removeCertification(index)">
                <i class="material-icons">close</i>
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="submit-button" @click="registerLot">{{ t('COMMON.SAVE') }}</button>
          <button class="cancel-button" @click="cancelRegister">{{ t('COMMON.CANCEL') }}</button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ t('LOTS.EDIT_TITLE') }}</h2>
        <div class="form-row">
          <div class="form-group">
            <label>{{ t('LOTS.LOT_NAME') }}</label>
            <div class="input-icon-wrapper">
              <input v-model="editingLot.lot_name" />
              <span class="material-icons edit-icon">edit</span>
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('LOTS.COFFEE_TYPE') }}</label>
            <div class="input-icon-wrapper">
              <select v-model="editingLot.coffee_type">
                <option value="" disabled>{{ t('COMMON.SELECT') }}</option>
                <option v-for="type in coffeeTypes" :key="type">{{ type }}</option>
              </select>
              <span class="material-icons edit-icon">edit</span>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('LOTS.PROCESSING_METHOD') }}</label>
            <div class="input-icon-wrapper">
              <select v-model="editingLot.processing_method">
                <option value="" disabled>{{ t('COMMON.SELECT') }}</option>
                <option v-for="method in processTypes" :key="method">{{ method }}</option>
              </select>
              <span class="material-icons edit-icon">edit</span>
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('LOTS.ALTITUDE') }}</label>
            <div class="input-icon-wrapper">
              <input type="number" v-model="editingLot.altitude" />
              <span class="material-icons edit-icon">edit</span>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>{{ t('LOTS.WEIGHT') }}</label>
            <div class="input-icon-wrapper">
              <input type="number" v-model="editingLot.weight" />
              <span class="material-icons edit-icon">edit</span>
            </div>
          </div>
          <div class="form-group">
            <label>{{ t('LOTS.ORIGIN') }}</label>
            <div class="input-icon-wrapper">
              <input v-model="editingLot.origin" />
              <span class="material-icons edit-icon">edit</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>{{ t('LOTS.SUPPLIER') }}</label>
          <div class="input-icon-wrapper">
            <select v-model="editingLot.supplier_id">
              <option value="" disabled>{{ t('COMMON.SELECT') }}</option>
              <option v-for="s in suppliers" :key="s.id" :value="s.id">{{ s.name }}</option>
            </select>
            <span class="material-icons edit-icon">edit</span>
          </div>
        </div>
        <div class="form-group certifications-container">
          <label>{{ t('LOTS.CERTIFICATIONS') }}</label>
          <div class="certification-input">
            <select v-model="newCertification">
              <option value="" disabled>{{ t('COMMON.SELECT') }}</option>
              <option v-for="cert in certificationsOptions" :key="cert" :value="cert">{{ cert }}</option>
            </select>
            <button class="add-button" @click="addCertificationToEdit(newCertification)">
              <i class="material-icons">add</i>
            </button>
          </div>
          <div class="certifications-tags">
            <div class="certification-tag" v-for="(cert, index) in editingLot.certifications" :key="index">
              {{ cert }}
              <button class="remove-tag" @click="removeCertificationFromEdit(index)">
                <i class="material-icons">close</i>
              </button>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="submit-button" @click="saveLotChanges">{{ t('COMMON.SAVE') }}</button>
          <button class="cancel-button" @click="closeEditModal">{{ t('COMMON.CANCEL') }}</button>
        </div>
      </div>
    </div>

    <!-- Lot Details Modal -->
    <div v-if="showLotDetails" class="modal-overlay">
      <div class="modal-content">
        <button class="back-button" @click="closeLotDetails">
          <i class="material-icons">arrow_back</i> {{ t('COMMON.BACK') }}
        </button>
        <div class="lot-details">
          <h2>{{ selectedLot.lot_name }}</h2>
          <div class="detail-row">
            <div class="detail-group">
              <label>{{ t('LOTS.COFFEE_TYPE') }}</label>
              <p>{{ selectedLot.coffee_type }}</p>
            </div>
            <div class="detail-group">
              <label>{{ t('LOTS.WEIGHT') }}</label>
              <p>{{ selectedLot.weight }} kg</p>
            </div>
            <div class="detail-group">
              <label>{{ t('LOTS.PROCESSING_METHOD') }}</label>
              <p>{{ selectedLot.processing_method }}</p>
            </div>
            <div class="detail-group">
              <label>{{ t('LOTS.SUPPLIER') }}</label>
              <p>{{ getSupplierName(selectedLot.supplier_id) }}</p>
            </div>
          </div>

          <h3>{{ t('LOTS.CERTIFICATIONS') }}</h3>
          <ul class="certifications-list">
            <li v-for="(cert, index) in selectedLot.certifications" :key="index">{{ cert }}</li>
          </ul>
        </div>
        <div class="btn-edit">
          <button class="save-edit" @click="editLot(selectedLot)">{{ t('COMMON.EDIT') }}</button>
          <button class="cancel-edit" @click="closeLotDetails">{{ t('COMMON.CLOSE') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { coffeeLotService as CoffeeLotService } from '../services/coffeeLotService';
import { SupplierService} from "../../supply/service/SupplierService.js";
import { useAuthService } from '../../auth/services/authService';

const supplierService = new SupplierService();
const AuthService = useAuthService();
const { t } = useI18n();
const router = useRouter();

const lots = ref([]);
const suppliers = ref([]);
const searchQuery = ref('');
const showRegisterModal = ref(false);
const showEditModal = ref(false);
const showLotDetails = ref(false);
const loading = ref(false);
const error = ref(null);
const newCertification = ref('');

const coffeeTypes = ['Arábica', 'Robusta', 'Mezcla'];
const processTypes = ['Grano Verde', 'Tostado'];
const certificationsOptions = ['Comercio Justo', 'Bird Friendly', 'UTZ certified', 'Orgánico', 'Rainforest Alliance'];

const newLot = ref(getEmptyLot());
const editingLot = ref(getEmptyLot());
const selectedLot = ref(null);

function getEmptyLot() {
  return {
    lot_name: '',
    coffee_type: '',
    processing_method: '',
    altitude: 0,
    weight: 0,
    origin: '',
    certifications: [],
    supplier_id: '',
    user_id: ''
  };
}

async function loadSuppliers() {
  const userId = AuthService.getCurrentUserId();
  try {
    const res = await axios.get('https://6824c1b40f0188d7e72aabca.mockapi.io/api/v1/suppliers');
    suppliers.value = res.data.filter(s => s.user_id === userId);
  } catch (err) {
    console.error('Error loading suppliers', err);
    suppliers.value = [];
  }
}

async function loadLots() {
  loading.value = true;
  error.value = null;
  const userId = AuthService.getCurrentUserId();

  try {
    const allLots = await CoffeeLotService.getLots();

    // Validar datos
    if (!Array.isArray(allLots)) {
      throw new Error('La respuesta del servidor no es una lista');
    }

    lots.value = allLots.filter(lot => lot.user_id === userId);
    console.log('Lotes cargados:', lots.value);
  } catch (err) {
    console.error('Error al cargar lotes:', err);
    error.value = t('ERRORS.LOAD_LOTS');
    lots.value = []; // Garantiza que se actualice
  } finally {
    loading.value = false;
  }
}


async function searchLots() {
  if ((searchQuery.value || '').trim())
  {
    loading.value = true;
    try {
      lots.value = await CoffeeLotService.searchLots(searchQuery.value);
    } catch (err) {
      error.value = t('ERROR.SEARCH_LOTS');
    }
    finally {
      loading.value = false;
    }
  } else {
    await loadLots();
  }
}

function viewLotDetails(lot) {
  selectedLot.value = { ...lot };
  showLotDetails.value = true;
}

function closeLotDetails() {
  showLotDetails.value = false;
  selectedLot.value = null;
}

function editLot(lot) {
  editingLot.value = { ...lot };
  showEditModal.value = true;
  showLotDetails.value = false;
}

function closeEditModal() {
  showEditModal.value = false;
  error.value = null;
}

async function registerLot() {
  error.value = null;
  const userId = AuthService.getCurrentUserId();

  if (!userId) {
    error.value = 'Usuario no autenticado';
    return;
  }

  const userSuppliers = suppliers.value.filter(s => s.user_id === userId);
  if (userSuppliers.length === 0) {
    error.value = 'Debe tener al menos un proveedor registrado';
    return;
  }

  const lot = newLot.value;
  if (!lot.lot_name || !lot.coffee_type || !lot.processing_method || !lot.altitude || !lot.weight || !lot.origin || !lot.supplier_id) {
    error.value = 'Complete todos los campos obligatorios';
    return;
  }

  lot.user_id = userId;
  lot.altitude = Number(lot.altitude);
  lot.weight = Number(lot.weight);

  try {
    await CoffeeLotService.addLot(lot);
    await loadLots();
    showRegisterModal.value = false;
    newLot.value = getEmptyLot();
  } catch (err) {
    error.value = err.message;
  }
}

function cancelRegister() {
  showRegisterModal.value = false;
  newLot.value = getEmptyLot();
  error.value = null;
}

async function saveLotChanges() {
  const lot = editingLot.value;
  if (!lot.lot_name || !lot.coffee_type || !lot.processing_method || !lot.altitude || !lot.weight || !lot.origin || !lot.supplier_id) {
    error.value = 'Complete todos los campos obligatorios';
    return;
  }

  loading.value = true;
  try {
    await CoffeeLotService.update(lot);
    showEditModal.value = false;
    await loadLots();
  } catch (err) {
    error.value = 'Error al actualizar el lote';
  } finally {
    loading.value = false;
  }
}

function addCertification(value) {
  if (value.trim() && !newLot.value.certifications.includes(value)) {
    newLot.value.certifications.push(value);
    newCertification.value = '';
  }
}

function addCertificationToEdit(value) {
  if (value.trim() && !editingLot.value.certifications.includes(value)) {
    editingLot.value.certifications.push(value);
    newCertification.value = '';
  }
}

function removeCertification(index) {
  newLot.value.certifications.splice(index, 1);
}

function removeCertificationFromEdit(index) {
  editingLot.value.certifications.splice(index, 1);
}

function getSupplierName(id) {
  if (!id) return '';
  const supplier = suppliers.value.find(s => s.id === id);
  return supplier ? supplier.name : '';
}

onMounted(() => {
  loadLots();
  loadSuppliers();
});
</script>

<style scoped>
.lot-container {
  padding: 20px;
  font-family: Arial, sans-serif;
  position: relative;
  background-color: #f4f2ed;
  min-height: 100vh;
}

.breadcrumb {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.breadcrumb a {
  color: #666;
  text-decoration: none;
  cursor: pointer;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.search-container {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 10px;
  position: relative;
  margin-top: 10px;
  z-index: 10;
}

.search-box {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 24px;
  overflow: hidden;
  width: 300px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.search-box input {
  flex: 1;
  padding: 10px 15px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-button {
  background-color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  background-color: #f0f0f0;
}

.material-icons {
  font-size: 18px;
  color: #666;
}

/* Loading indicator styles */
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4A5A54;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error message styles */
.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px 16px;
  margin-bottom: 15px;
  border-radius: 4px;
  border-left: 4px solid #c62828;
  width: 100%;
  box-sizing: border-box;
}

.table-container {
  margin-top: 15px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.lot-table {
  width: 100%;
  border-collapse: collapse;
}

.lot-table th {
  background-color: #4A5A54;
  color: white;
  text-align: left;
  padding: 12px 15px;
  position: sticky;
  top: 0;
  font-weight: normal;
}

.lot-table td {
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  color: #333;
}

.lot-table tr:hover {
  background-color: #f5f5f5;
}

.empty-message {
  text-align: center;
  padding: 20px;
  color: #666;
}

.action-cell {
  text-align: center;
  width: 50px;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.register-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.register-button {
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.register-button:hover {
  background-color: #3D4B44;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
}

.modal-content h2 {
  color: #4A5A54;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: normal;
}

.back-button {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.back-button i {
  margin-right: 5px;
}


.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 15px;
}

.form-group input:focus, .form-group select:focus {
  border-color: #4A5A54;
  outline: none;
  box-shadow: 0 0 3px rgba(74,90,84,0.3);
}

.edit-field-icon {
  position: absolute;
  right: 10px;
  top: 38px;
  color: #4A5A54;
  cursor: pointer;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.submit-button {
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  min-width: 150px;
}

.submit-button:hover {
  background-color: #3D4B44;
}
.cancel-button {
  background-color: #990033;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  min-width: 150px;
}

.cancel-button:hover {
  background-color: #3e0719;
}


/* Lote details styles */
.lot-details {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 20px;
}

.lot-details h2 {
  color: #4A5A54;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 22px;
}

.lot-details h3 {
  color: #4A5A54;
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 18px;
}

.detail-row {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 20px;
}

.detail-group {
  flex: 1;
  min-width: 200px;
  margin-bottom: 15px;
}

.detail-group label {
  font-weight: 500;
  color: #666;
  display: block;
  margin-bottom: 5px;
}

.detail-group p {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.certifications-section {
  margin-top: 20px;
  border-top: 1px solid #eee;
  padding-top: 20px;
}

.certifications-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.certifications-list li {
  background-color: #e9f0ee;
  color: #4A5A54;
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 14px;
}

.detail-actions {
  display: none;
}

.detail-button {
  display: none;
}

/* Certificaciones styles */
.certifications-container {
  margin-top: 10px;
}

.certification-input {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.certification-input select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.add-button {
  background-color: #4A5A54;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.add-button i {
  font-size: 16px;
  color: white;
}

.btn-addC{
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.btn-deleteC{
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.certifications-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.certification-tag {
  background-color: #e9f0ee;
  color: #4A5A54;
  padding: 5px 10px;
  border-radius: 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.remove-tag {
  background: none;
  border: none;
  color: #4A5A54;
  margin-left: 5px;
  cursor: pointer;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.add-certification{
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.delete-certification{
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.save-edit{
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}


.cancel-edit{
  background-color: #163e2f;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 10px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}


.btn-edit{
  display: flex;
  justify-content: center;
  margin-top: 25px;
}


</style>
