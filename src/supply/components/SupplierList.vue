<template>
  <div class="supplier-container">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/dashboard-owner">{{ t('navbar.home') }}</router-link> &gt;
      <span
          v-if="showSupplierDetails"
          class="breadcrumb-link"
          @click="showSupplierDetails = false"
          style="cursor: pointer; color: #666; text-decoration: underline;"
      >
  {{ t('supply.suppliers.title') }}
</span>
      <router-link v-else to="/suppliers">{{ t('supply.suppliers.title') }}</router-link>

      <span v-if="showSupplierDetails"> &gt; {{ t('supply.suppliers.details.general_info') }}</span>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- Buscador -->
    <div v-if="!showSupplierDetails" class="search-container">
      <div class="search-box">
        <input v-model="searchQuery" @keyup.enter="searchSuppliers" :placeholder="t('supply.suppliers.search_placeholder')" />
        <button class="search-button" @click="searchSuppliers"><i class="material-icons">search</i></button>
      </div>
    </div>

    <!-- Botón de registrar proveedor -->
    <div v-if="!showSupplierDetails" class="register-container">
      <button class="register-button" @click="showRegisterModal = true">
        {{ t('supply.suppliers.register_button') }}
      </button>
    </div>

    <!-- Tabla -->
    <div v-if="!showSupplierDetails && !showEditModal && !showRegisterModal" class="table-container">
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>{{ t('supply.suppliers.loading') }}</p>
      </div>

      <table v-if="!loading" class="supplier-table">
        <thead>
        <tr>
          <th>{{ t('supply.suppliers.columns.name') }}</th>
          <th>{{ t('supply.suppliers.columns.email') }}</th>
          <th>{{ t('supply.suppliers.columns.phone') }}</th>
          <th>{{ t('supply.suppliers.columns.location') }}</th>
          <th colspan="3"></th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="suppliers.length === 0">
          <td colspan="6" class="empty-message">{{ t('supply.suppliers.no_suppliers') }}</td>
        </tr>
        <tr v-for="supplier in suppliers" :key="supplier.id">
          <td>{{ supplier.name }}</td>
          <td>{{ supplier.email }}</td>
          <td>{{ supplier.phone }}</td>
          <td>{{ supplier.location }}</td>
          <td class="action-cell">
            <button class="action-button" @click="viewSupplierDetails(supplier)"><i class="material-icons">search</i></button>
          </td>
          <td class="action-cell">
            <button class="action-button" @click="editSupplier(supplier)"><i class="material-icons">edit</i></button>
          </td>
          <td class="action-cell">
            <button class="action-button" :disabled="!supplier.id" @click="deleteSupplier(supplier.id)"><i class="material-icons">delete</i></button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Detalles -->
    <div v-if="showSupplierDetails" class="supplier-details">
      <h2>{{ t('supply.suppliers.details.title') }}</h2>
      <div class="detail-group"><label>{{ t('supply.suppliers.columns.name') }}:</label><p>{{ selectedSupplier.name }}</p></div>
      <div class="detail-group"><label>{{ t('supply.suppliers.columns.email') }}:</label><p>{{ selectedSupplier.email }}</p></div>
      <div class="detail-group"><label>{{ t('supply.suppliers.columns.phone') }}:</label><p>{{ selectedSupplier.phone }}</p></div>
      <div class="detail-group"><label>{{ t('supply.suppliers.columns.location') }}:</label><p>{{ selectedSupplier.location }}</p></div>
      <div class="detail-group"><label>{{ t('supply.suppliers.columns.specialties') }}:</label><p>{{ selectedSupplier.specialties?.join(', ') || t('supply.suppliers.no_specialties') }}</p></div>
    </div>

    <!-- Modal Registrar -->
    <div v-if="showRegisterModal" class="modal-overlay">
      <div class="modal-content">
        <div class="back-button" @click="showRegisterModal = false"><i class="material-icons">arrow_back</i> {{ t('supply.suppliers.register_title') }}</div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <form @submit.prevent="registerSupplier">
          <div class="form-group"><label>{{ t('supply.suppliers.columns.name') }}</label><input v-model="newSupplier.name" required /></div>
          <div class="form-group"><label>{{ t('supply.suppliers.columns.email') }}</label><input v-model="newSupplier.email" required type="email" /></div>
          <div class="form-group"><label>{{ t('supply.suppliers.columns.phone') }}</label><input v-model="newSupplier.phone" required type="tel" /></div>
          <div class="form-group"><label>{{ t('supply.suppliers.columns.location') }}</label><input v-model="newSupplier.location" required /></div>
          <div class="form-group">
            <label>{{ t('supply.suppliers.columns.specialties') }} (máx. 4)</label>
            <div class="specialties-list">
              <span v-for="(spec, i) in newSpecialties" :key="i" class="specialty-tag">
                {{ spec }} <button @click.prevent="removeNewSpecialty(i)">x</button>
              </span>
            </div>
            <input v-model="newSpecialtyInput" :placeholder="t('supply.suppliers.add_specialty_placeholder')" />
            <button type="button" @click="addNewSpecialty">+</button>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-button">{{ t('supply.suppliers.register_button') }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Editar -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <div class="back-button" @click="closeEditModal"><i class="material-icons">arrow_back</i> {{ t('supply.suppliers.edit_title') }}</div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <form @submit.prevent="saveSupplierChanges">
          <div class="form-group"><label>{{ t('supply.suppliers.columns.name') }}</label><input v-model="editingSupplier.name" required /></div>
          <div class="form-group"><label>{{ t('supply.suppliers.columns.email') }}</label><input v-model="editingSupplier.email" required type="email" /></div>
          <div class="form-group"><label>{{ t('supply.suppliers.columns.phone') }}</label><input v-model="editingSupplier.phone" required type="tel" /></div>
          <div class="form-group"><label>{{ t('supply.suppliers.columns.location') }}</label><input v-model="editingSupplier.location" required /></div>
          <div class="form-group">
            <label>{{ t('supply.suppliers.columns.specialties') }} (máx. 4)</label>
            <div class="specialties-list">
              <span v-for="(spec, i) in editingSpecialties" :key="i" class="specialty-tag">
                {{ spec }} <button @click.prevent="removeEditSpecialty(i)">x</button>
              </span>
            </div>
            <input v-model="editSpecialtyInput" :placeholder="t('supply.suppliers.add_specialty_placeholder')" />
            <button type="button" @click="addEditSpecialty">+</button>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-button">{{ t('supply.suppliers.save_button') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import {supplierService} from "../service/SupplierService.js";
import { useAuthService} from "../../auth/services/authService.js";

export default {
  name: 'SupplierList',
  setup() {
    const { t } = useI18n();
    const { getCurrentUserId } = useAuthService();
    const suppliers = ref([]);
    const searchQuery = ref('');
    const loading = ref(false);
    const error = ref(null);

    const showRegisterModal = ref(false);
    const showEditModal = ref(false);
    const showSupplierDetails = ref(false);

    const selectedSupplier = reactive({
      name: '',
      email: '',
      phone: '',
      location: '',
      specialties: []
    });    const newSupplier = reactive({ name: '', email: '', phone: '', location: '', specialties: [], user_id: 'mock-user-id' });
    const editingSupplier = reactive({ name: '', email: '', phone: '', location: '', specialties: [] });

    const newSpecialties = ref([]);
    const editingSpecialties = ref([]);
    const newSpecialtyInput = ref('');
    const editSpecialtyInput = ref('');

    const loadSuppliers = async () => {
      loading.value = true;
      try {
        const userId = getCurrentUserId();
        if (!userId) throw new Error('Usuario no autenticado');

        suppliers.value = await supplierService.getAllSuppliers(userId);
      } catch (err) {
        error.value = err?.message || 'No se encontraron proveedores';
      } finally {
        loading.value = false;
      }
    };


    const searchSuppliers = async () => {
      loading.value = true;
      try {
        suppliers.value = await supplierService.searchSuppliers(searchQuery.value);
      } catch {
        error.value = 'Error buscando proveedores';
      } finally {
        loading.value = false;
      }
    };

    const registerSupplier = async () => {
      try {
        error.value = null;
        const userId = getCurrentUserId();
        if (!userId) throw new Error('Usuario no autenticado');

        newSupplier.specialties = newSpecialties.value;
        newSupplier.user_id = userId; // <-- Añadir el userId aquí

        await supplierService.addSupplier(newSupplier);

        showRegisterModal.value = false;
        newSpecialties.value = [];
        Object.assign(newSupplier, {
          name: '',
          email: '',
          phone: '',
          location: '',
          specialties: [],
          user_id: ''
        });

        await loadSuppliers();
      } catch (err) {
        error.value = err?.message || 'Error registrando proveedor';
      }
    };



    const editSupplier = (supplier) => {
      Object.assign(editingSupplier, supplier);
      editingSpecialties.value = [...supplier.specialties];
      showEditModal.value = true;
    };

    const saveSupplierChanges = async () => {
      editingSupplier.specialties = editingSpecialties.value;
      await supplierService.update(editingSupplier);
      showEditModal.value = false;
      loadSuppliers();
    };

    const deleteSupplier = async (id) => {
      try {
        await supplierService.delete(id);
        loadSuppliers();
      } catch (err) {
        error.value = err.message || 'Error eliminando proveedor';
      }

    };

    const viewSupplierDetails = (supplier) => {
      Object.assign(selectedSupplier, supplier);
      showSupplierDetails.value = true;
    };

    const closeEditModal = () => showEditModal.value = false;

    const addNewSpecialty = () => {
      if (newSpecialtyInput.value && newSpecialties.value.length < 4) {
        newSpecialties.value.push(newSpecialtyInput.value);
        newSpecialtyInput.value = '';
      }
    };

    const removeNewSpecialty = (i) => newSpecialties.value.splice(i, 1);

    const addEditSpecialty = () => {
      if (editSpecialtyInput.value && editingSpecialties.value.length < 4) {
        editingSpecialties.value.push(editSpecialtyInput.value);
        editSpecialtyInput.value = '';
      }
    };

    const removeEditSpecialty = (i) => editingSpecialties.value.splice(i, 1);

    onMounted(loadSuppliers);

    return {
      t,
      suppliers, searchQuery, loading, error,
      showRegisterModal, showEditModal, showSupplierDetails,
      selectedSupplier, newSupplier, editingSupplier,
      newSpecialties, editingSpecialties,
      newSpecialtyInput, editSpecialtyInput,
      loadSuppliers, searchSuppliers, registerSupplier,
      editSupplier, saveSupplierChanges, deleteSupplier,
      viewSupplierDetails, closeEditModal,
      addNewSpecialty, removeNewSpecialty,
      addEditSpecialty, removeEditSpecialty
    };
  }
};
</script>

<style>
.supplier-container {
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

.supplier-table {
  width: 100%;
  border-collapse: collapse;
}

.supplier-table th {
  background-color: #4A5A54;
  color: white;
  text-align: left;
  padding: 12px 15px;
  position: sticky;
  top: 0;
  font-weight: normal;
}

.supplier-table td {
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  color: #333;
}

.supplier-table tr:hover {
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
  max-width: 500px;
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
  color: #555;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  text-decoration: none;
  cursor: pointer;
}

.back-button i {
  margin-right: 5px;
  font-size: 16px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 15px;
}

.form-group input:focus {
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

.cancel-button {
  background-color: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.cancel-button:hover {
  background-color: #eaeaea;
}

.submit-button {
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  min-width: 120px;
}

.submit-button:hover {
  background-color: #3D4B44;
}

/* Provider details styles */
.supplier-details {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 110px;
}

.supplier-details h2 {
  color: #4A5A54;
  margin-top: 0;
  margin-bottom: 20px;
}

.detail-group {
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
}

.detail-actions {
  display: none;
}

.detail-button {
  display: none;
}



</style>