<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import SupplierService from '../service/SupplierService';
import Header from '../../shared/components/Header.vue';
import RegisterSupplierModal from './RegisterSupplierModal.vue';
import EditSupplierModal from './EditSupplierModal.vue';

const { t } = useI18n();
const router = useRouter();
const searchQuery = ref('');
const suppliers = ref([]);
const showRegisterModal = ref(false);
const showEditModal = ref(false);
const selectedSupplierId = ref(null);

// Load all suppliers
onMounted(() => {
  suppliers.value = SupplierService.getSuppliers().value;
});

// Filter suppliers based on search query
const filteredSuppliers = computed(() => {
  if (!searchQuery.value) return suppliers.value;
  return SupplierService.searchSuppliers(searchQuery.value);
});

// Navigation functions 
const navigateToHome = () => {
  router.push('/');
};

const viewSupplierDetails = (supplierId) => {
  console.log('Viewing supplier details for ID:', supplierId);
  router.push(`/suppliers/${supplierId}`);
};

const editSupplier = (supplierId) => {
  selectedSupplierId.value = supplierId;
  showEditModal.value = true;
};

const openRegisterModal = () => {
  showRegisterModal.value = true;
};

const closeRegisterModal = () => {
  showRegisterModal.value = false;
  // Recargar la lista de proveedores después de cerrar el modal
  suppliers.value = SupplierService.getSuppliers().value;
};

const closeEditModal = () => {
  showEditModal.value = false;
  // Recargar la lista de proveedores después de cerrar el modal
  suppliers.value = SupplierService.getSuppliers().value;
};
</script>

<template>
  <div class="suppliers-container">
    <Header />
    
    <div class="breadcrumbs">
      <router-link to="/" class="breadcrumb-item clickable">{{ t('supply.home') }}</router-link>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">{{ t('supply.title') }}</span>
    </div>
    
    <div class="content-container">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery"
          :placeholder="t('supply.search')"
          class="search-input"
        />
      </div>
      
      <div class="table-container">
        <table class="suppliers-table">
          <thead>
            <tr>
              <th>{{ t('supply.tableHeaders.name') }}</th>
              <th>{{ t('supply.tableHeaders.email') }}</th>
              <th>{{ t('supply.tableHeaders.phone') }}</th>
              <th>{{ t('supply.tableHeaders.location') }}</th>
              <th class="actions-header"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="supplier in filteredSuppliers" :key="supplier.id">
              <td>{{ supplier.name }}</td>
              <td>{{ supplier.email }}</td>
              <td>{{ supplier.phone }}</td>
              <td>{{ supplier.location }}</td>
              <td class="actions-column">
                <div class="action-buttons">
                  <button 
                    class="action-button view" 
                    @click="viewSupplierDetails(supplier.id)"
                    :title="t('supply.actions.view')"
                  >
                    <i class="pi pi-search"></i>
                    <!-- Debug info -->
                    <span class="debug-id" style="display: none;">{{ supplier.id }}</span>
                  </button>
                  <button 
                    class="action-button edit" 
                    @click="editSupplier(supplier.id)"
                    :title="t('supply.actions.edit')"
                  >
                    <i class="pi pi-pencil"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="register-button-container">
        <button class="register-button" @click="openRegisterModal">
          {{ t('supply.registerButton') }}
        </button>
      </div>
    </div>
    
    <!-- Modal de registro de proveedores -->
    <RegisterSupplierModal v-if="showRegisterModal" @close="closeRegisterModal" />
    
    <!-- Modal de edición de proveedores -->
    <EditSupplierModal 
      v-if="showEditModal" 
      :supplierId="selectedSupplierId" 
      @close="closeEditModal" 
    />
  </div>
</template>

<style scoped>
.suppliers-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  background-color: #f5f1e8;
}

.breadcrumbs {
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
}

.breadcrumb-item.clickable {
  cursor: pointer;
  color: #4a634b;
  text-decoration: underline;
}

.breadcrumb-separator {
  color: #888;
}

.content-container {
  padding: 0 2rem 2rem;
  flex-grow: 1;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

.search-container {
  margin-bottom: 1rem;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.table-container {
  margin-bottom: 1.5rem;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 100%;
}

.suppliers-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.suppliers-table th {
  text-align: left;
  padding: 1rem;
  background-color: #5A7A6F;
  color: white;
  font-weight: normal;
}

.suppliers-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suppliers-table th:nth-child(1) {
  width: 25%;
}

.suppliers-table th:nth-child(2) {
  width: 30%;
}

.suppliers-table th:nth-child(3) {
  width: 20%;
}

.suppliers-table th:nth-child(4) {
  width: 20%;
}

.suppliers-table th:nth-child(5) {
  width: 5%;
}

.actions-header {
  text-align: center;
}

.actions-column {
  display: flex;
  justify-content: center;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.1rem;
}

.action-button.view {
  color: #4a634b;
}

.action-button.edit {
  color: #4a634b;
}

.action-button:hover {
  color: #2a432b;
}

.register-button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.register-button {
  background-color: #4a634b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.register-button:hover {
  background-color: #3a5239;
}
</style> 