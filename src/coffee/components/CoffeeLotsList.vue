<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import CoffeeLotService from '../service/CoffeeLotService';
import Header from '../../shared/components/Header.vue';
import RegisterLotModal from './RegisterLotModal.vue';
import EditLotModal from './EditLotModal.vue';

const { t } = useI18n();
const router = useRouter();
const searchQuery = ref('');
const lots = ref([]);
const showRegisterModal = ref(false);
const showEditModal = ref(false);
const selectedLotId = ref(null);

// Load all lots
onMounted(() => {
  lots.value = CoffeeLotService.getLots().value;
});

// Filter lots based on search query
const filteredLots = computed(() => {
  if (!searchQuery.value) return lots.value;
  return CoffeeLotService.searchLots(searchQuery.value);
});

// Navigation functions 
const navigateToHome = () => {
  router.push('/');
};

const viewLotDetails = (lotId) => {
  router.push(`/lots/${lotId}`);
};

const editLot = (lotId) => {
  selectedLotId.value = lotId;
  showEditModal.value = true;
};

const openRegisterModal = () => {
  showRegisterModal.value = true;
};

const closeRegisterModal = () => {
  showRegisterModal.value = false;
  // Reload the lot list after closing the modal
  lots.value = CoffeeLotService.getLots().value;
};

const closeEditModal = () => {
  showEditModal.value = false;
  // Reload the lot list after closing the modal
  lots.value = CoffeeLotService.getLots().value;
};
</script>

<template>
  <div class="lots-container">
    <Header />
    
    <div class="breadcrumbs">
      <router-link to="/" class="breadcrumb-item clickable">{{ t('coffee.home') }}</router-link>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">{{ t('coffee.title') }}</span>
    </div>
    
    <div class="content-container">
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery"
          :placeholder="t('coffee.search')"
          class="search-input"
        />
      </div>
      
      <div class="table-container">
        <table class="lots-table">
          <thead>
            <tr>
              <th>{{ t('coffee.tableHeaders.name') }}</th>
              <th>{{ t('coffee.tableHeaders.type') }}</th>
              <th>{{ t('coffee.tableHeaders.altitude') }}</th>
              <th>{{ t('coffee.tableHeaders.supplier') }}</th>
              <th class="actions-header"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lot in filteredLots" :key="lot.id">
              <td>{{ lot.name }}</td>
              <td>{{ lot.type }}</td>
              <td>{{ lot.altitude }}</td>
              <td>{{ lot.origin }}</td>
              <td class="actions-column">
                <div class="action-buttons">
                  <button 
                    class="action-button view" 
                    @click="viewLotDetails(lot.id)"
                    :title="t('coffee.actions.view')"
                  >
                    <i class="pi pi-search"></i>
                  </button>
                  <button 
                    class="action-button edit" 
                    @click="editLot(lot.id)"
                    :title="t('coffee.actions.edit')"
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
          {{ t('coffee.registerButton') }}
        </button>
      </div>
    </div>
    
    <!-- Lot registration modal -->
    <RegisterLotModal v-if="showRegisterModal" @close="closeRegisterModal" />
    
    <!-- Lot editing modal -->
    <EditLotModal 
      v-if="showEditModal" 
      :lotId="selectedLotId" 
      @close="closeEditModal" 
    />
  </div>
</template>

<style scoped>
.lots-container {
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

.lots-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.lots-table th {
  text-align: left;
  padding: 1rem;
  background-color: #5A7A6F;
  color: white;
  font-weight: normal;
}

.lots-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.lots-table th:nth-child(1) {
  width: 25%;
}

.lots-table th:nth-child(2) {
  width: 25%;
}

.lots-table th:nth-child(3) {
  width: 20%;
}

.lots-table th:nth-child(4) {
  width: 25%;
}

.lots-table th:nth-child(5) {
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