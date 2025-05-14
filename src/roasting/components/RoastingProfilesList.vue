<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import RoastingProfileService from '../service/RoastingProfileService';
import Header from '../../shared/components/Header.vue';

const { t } = useI18n();
const router = useRouter();
const searchQuery = ref('');
const profiles = ref([]);
const selectedProfiles = ref([]);
const showFilterDropdown = ref(false);

// Modales
const showRegisterModal = ref(false);
const showEditModal = ref(false);
const currentProfile = ref({
  id: null,
  name: '',
  type: '',
  altitude: '',
  supplier: '',
  isFavorite: false
});

// Opciones para selects
const typeOptions = ['Tueste claro', 'Tueste medio', 'Tueste oscuro'];
const altitudeOptions = ['Baja', 'Media', 'Alta'];
const supplierOptions = ['Chanchamayo', 'Villa Rica', 'Cusco', 'Importado'];

// Filtros
const filterOptions = ref({
  type: '',
  altitude: '',
  supplier: ''
});

// Load all profiles
onMounted(() => {
  profiles.value = RoastingProfileService.getProfiles().value;
});

// Generate unique options from profile data
const getUniqueTypes = computed(() => {
  const types = new Set(profiles.value.map(profile => profile.type));
  return Array.from(types);
});

const getUniqueAltitudes = computed(() => {
  const altitudes = new Set(profiles.value.map(profile => profile.altitude));
  return Array.from(altitudes);
});

const getUniqueSuppliers = computed(() => {
  const suppliers = new Set(profiles.value.map(profile => profile.supplier));
  return Array.from(suppliers);
});

// Toggle filter dropdown
const toggleFilterDropdown = () => {
  showFilterDropdown.value = !showFilterDropdown.value;
};

// Apply filter
const applyFilter = () => {
  showFilterDropdown.value = false;
};

// Clear filter
const clearFilter = () => {
  filterOptions.value = {
    type: '',
    altitude: '',
    supplier: ''
  };
  showFilterDropdown.value = false;
};

// Filter profiles based on search query and filter options
const filteredProfiles = computed(() => {
  let result = profiles.value;

  // Apply search query filter
  if (searchQuery.value) {
    const searchText = searchQuery.value.toLowerCase();
    result = result.filter(profile =>
        profile.name.toLowerCase().includes(searchText) ||
        profile.type.toLowerCase().includes(searchText) ||
        profile.altitude.toLowerCase().includes(searchText) ||
        profile.supplier.toLowerCase().includes(searchText)
    );
  }

  // Apply dropdown filters
  if (filterOptions.value.type) {
    result = result.filter(profile => profile.type === filterOptions.value.type);
  }

  if (filterOptions.value.altitude) {
    result = result.filter(profile => profile.altitude === filterOptions.value.altitude);
  }

  if (filterOptions.value.supplier) {
    result = result.filter(profile => profile.supplier === filterOptions.value.supplier);
  }

  return result;
});

// Toggle profile selection for comparison
const toggleProfileSelection = (profileId) => {
  const index = selectedProfiles.value.indexOf(profileId);
  if (index === -1) {
    // Limit to 3 selections
    if (selectedProfiles.value.length < 3) {
      selectedProfiles.value.push(profileId);
    }
  } else {
    selectedProfiles.value.splice(index, 1);
  }
};

// Check if a profile is selected
const isProfileSelected = (profileId) => {
  return selectedProfiles.value.includes(profileId);
};

// Toggle favorite status
const toggleFavorite = (profileId) => {
  RoastingProfileService.toggleFavorite(profileId);
  // Refresh the profiles list
  profiles.value = [...RoastingProfileService.getProfiles().value];
};

// Duplicate profile
const duplicateProfile = (profileId) => {
  RoastingProfileService.duplicateProfile(profileId);
  // Refresh the profiles list
  profiles.value = [...RoastingProfileService.getProfiles().value];
};

// Navigate to compare view
const navigateToCompare = () => {
  if (selectedProfiles.value.length > 0) {
    const profileIds = selectedProfiles.value.join(',');
    router.push(`/roasting/compare/${profileIds}`);
  } else {
    router.push('/roasting/compare/0'); // Un ID ficticio para iniciar la comparación sin perfiles
  }
};

// Open register modal
const openRegisterModal = () => {
  currentProfile.value = {
    id: null,
    name: '',
    type: '',
    altitude: '',
    supplier: '',
    isFavorite: false
  };
  showRegisterModal.value = true;
};

// Open edit modal
const openEditModal = (profileId) => {
  const profileToEdit = RoastingProfileService.getProfileById(profileId);
  if (profileToEdit) {
    currentProfile.value = { ...profileToEdit };
    showEditModal.value = true;
  }
};

// Save profile
const saveProfile = () => {
  if (currentProfile.value.id) {
    // Update existing profile
    RoastingProfileService.updateProfile(currentProfile.value);
  } else {
    // Add new profile
    RoastingProfileService.addProfile(currentProfile.value);
  }
  // Refresh profiles and close modals
  profiles.value = [...RoastingProfileService.getProfiles().value];
  showRegisterModal.value = false;
  showEditModal.value = false;
};

// Close modals
const closeModals = () => {
  showRegisterModal.value = false;
  showEditModal.value = false;
};

// View profile details
const viewProfileDetails = (profileId) => {
  router.push(`/roasting/${profileId}`);
};
</script>

<template>
  <div class="roasting-container">
    <Header />

    <div class="breadcrumbs">
      <router-link to="/" class="breadcrumb-item clickable">{{ t('roasting.home') }}</router-link>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">{{ t('roasting.title') }}</span>
    </div>

    <div class="content-container">
      <div class="top-controls">
        <div class="search-filter-container">
          <div class="search-container">
            <input
                type="text"
                v-model="searchQuery"
                :placeholder="t('roasting.search')"
                class="search-input"
            />
          </div>

          <div class="filter-container">
            <button class="filter-button" @click="toggleFilterDropdown">
              <i class="pi pi-filter"></i>
              <span>{{ t('roasting.filter.title') }}</span>
            </button>

            <div v-if="showFilterDropdown" class="filter-dropdown">
              <div class="filter-header">
                <h3>{{ t('roasting.filter.title') }}</h3>
              </div>

              <div class="filter-content">
                <div class="filter-row">
                  <label>{{ t('roasting.filter.type') }}</label>
                  <select v-model="filterOptions.type">
                    <option value="">{{ t('roasting.filter.allTypes') }}</option>
                    <option v-for="type in getUniqueTypes" :key="type" :value="type">
                      {{ type }}
                    </option>
                  </select>
                </div>

                <div class="filter-row">
                  <label>{{ t('roasting.filter.altitude') }}</label>
                  <select v-model="filterOptions.altitude">
                    <option value="">{{ t('roasting.filter.allAltitudes') }}</option>
                    <option v-for="altitude in getUniqueAltitudes" :key="altitude" :value="altitude">
                      {{ altitude }}
                    </option>
                  </select>
                </div>

                <div class="filter-row">
                  <label>{{ t('roasting.filter.supplier') }}</label>
                  <select v-model="filterOptions.supplier">
                    <option value="">{{ t('roasting.filter.allSuppliers') }}</option>
                    <option v-for="supplier in getUniqueSuppliers" :key="supplier" :value="supplier">
                      {{ supplier }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="filter-actions">
                <button class="filter-clear-button" @click="clearFilter">
                  {{ t('roasting.filter.clearFilter') }}
                </button>
                <button class="filter-apply-button" @click="applyFilter">
                  {{ t('roasting.filter.applyFilter') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="action-buttons-container">
          <button
              class="compare-button"
              @click="navigateToCompare"
          >
            {{ t('roasting.compare') }} ({{ selectedProfiles.length }})
          </button>

          <button class="register-button" @click="openRegisterModal">
            {{ t('roasting.registerButton') }}
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="roasting-table">
          <thead>
          <tr>
            <th>{{ t('roasting.tableHeaders.name') }}</th>
            <th>{{ t('roasting.tableHeaders.type') }}</th>
            <th>{{ t('roasting.tableHeaders.altitude') }}</th>
            <th>{{ t('roasting.tableHeaders.supplier') }}</th>
            <th class="actions-header"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="profile in filteredProfiles" :key="profile.id">
            <td>{{ profile.name }}</td>
            <td>{{ profile.type }}</td>
            <td>{{ profile.altitude }}</td>
            <td>{{ profile.supplier }}</td>
            <td class="actions-column">
              <div class="action-buttons">
                <button
                    class="action-button checkbox"
                    :class="{ 'selected': isProfileSelected(profile.id) }"
                    @click="toggleProfileSelection(profile.id)"
                    :title="isProfileSelected(profile.id) ? 'Deselect' : 'Select for comparison'"
                >
                  <i :class="isProfileSelected(profile.id) ? 'pi pi-check-square' : 'pi pi-square'"></i>
                </button>

                <button
                    class="action-button star"
                    :class="{ 'favorite': profile.isFavorite }"
                    @click="toggleFavorite(profile.id)"
                    :title="profile.isFavorite ? t('roasting.actions.unfavorite') : t('roasting.actions.favorite')"
                >
                  <i class="pi pi-star"></i>
                </button>

                <button
                    class="action-button duplicate"
                    @click="duplicateProfile(profile.id)"
                    :title="t('roasting.actions.duplicate')"
                >
                  <i class="pi pi-copy"></i>
                </button>

                <button
                    class="action-button edit"
                    @click="openEditModal(profile.id)"
                    :title="t('roasting.actions.edit')"
                >
                  <i class="pi pi-pencil"></i>
                </button>

                <button
                    class="action-button view"
                    @click="viewProfileDetails(profile.id)"
                    :title="t('roasting.actions.view')"
                >
                  <i class="pi pi-search"></i>
                </button>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Register New Profile -->
    <div class="modal-overlay" v-if="showRegisterModal" @click.self="closeModals">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ t('roasting.registerForm.title') }}</h2>
          <button class="close-button" @click="closeModals">×</button>
        </div>

        <div class="modal-content">
          <div class="form-section">
            <h3>{{ t('roasting.registerForm.information') }}</h3>

            <div class="form-grid">
              <div class="form-group">
                <label>{{ t('roasting.registerForm.name') }}</label>
                <input type="text" v-model="currentProfile.name" />
              </div>

              <div class="form-group">
                <label>{{ t('roasting.registerForm.type') }}</label>
                <select v-model="currentProfile.type">
                  <option value="">{{ t('roasting.filter.allTypes') }}</option>
                  <option v-for="type in typeOptions" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>{{ t('roasting.registerForm.altitude') }}</label>
                <select v-model="currentProfile.altitude">
                  <option value="">{{ t('roasting.filter.allAltitudes') }}</option>
                  <option v-for="altitude in altitudeOptions" :key="altitude" :value="altitude">
                    {{ altitude }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>{{ t('roasting.registerForm.supplier') }}</label>
                <select v-model="currentProfile.supplier">
                  <option value="">{{ t('roasting.filter.allSuppliers') }}</option>
                  <option v-for="supplier in supplierOptions" :key="supplier" :value="supplier">
                    {{ supplier }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-button" @click="closeModals">{{ t('roasting.registerForm.back') }}</button>
          <button class="save-button" @click="saveProfile">{{ t('roasting.registerForm.register') }}</button>
        </div>
      </div>
    </div>

    <!-- Modal for Edit Profile -->
    <div class="modal-overlay" v-if="showEditModal" @click.self="closeModals">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ t('roasting.editForm.title') }}</h2>
          <button class="close-button" @click="closeModals">×</button>
        </div>

        <div class="modal-content">
          <div class="form-section">
            <h3>{{ t('roasting.registerForm.information') }}</h3>

            <div class="form-grid">
              <div class="form-group">
                <label>{{ t('roasting.registerForm.name') }}</label>
                <input type="text" v-model="currentProfile.name" />
              </div>

              <div class="form-group">
                <label>{{ t('roasting.registerForm.type') }}</label>
                <select v-model="currentProfile.type">
                  <option value="">{{ t('roasting.filter.allTypes') }}</option>
                  <option v-for="type in typeOptions" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>{{ t('roasting.registerForm.altitude') }}</label>
                <select v-model="currentProfile.altitude">
                  <option value="">{{ t('roasting.filter.allAltitudes') }}</option>
                  <option v-for="altitude in altitudeOptions" :key="altitude" :value="altitude">
                    {{ altitude }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label>{{ t('roasting.registerForm.supplier') }}</label>
                <select v-model="currentProfile.supplier">
                  <option value="">{{ t('roasting.filter.allSuppliers') }}</option>
                  <option v-for="supplier in supplierOptions" :key="supplier" :value="supplier">
                    {{ supplier }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-button" @click="closeModals">{{ t('roasting.registerForm.back') }}</button>
          <button class="save-button" @click="saveProfile">{{ t('roasting.editForm.update') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.roasting-container {
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

.top-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.search-filter-container {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.search-container {
  flex: 1;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.filter-container {
  position: relative;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.filter-dropdown {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 300px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.filter-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.filter-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.filter-content {
  padding: 1rem;
}

.filter-row {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-row label {
  font-weight: 600;
  color: #555;
}

.filter-row select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 1px solid #eee;
}

.filter-clear-button {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.filter-apply-button {
  padding: 0.5rem 1rem;
  background-color: #4a634b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.action-buttons-container {
  display: flex;
  gap: 1rem;
}

.compare-button {
  padding: 0.75rem 1.5rem;
  background-color: #5a7a6f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.register-button {
  padding: 0.75rem 1.5rem;
  background-color: #4a634b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.table-container {
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  width: 100%;
}

.roasting-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
}

.roasting-table th {
  text-align: left;
  padding: 1rem;
  background-color: #5A7A6F;
  color: white;
  font-weight: normal;
}

.roasting-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.roasting-table th:nth-child(1) {
  width: 25%;
}

.roasting-table th:nth-child(2) {
  width: 20%;
}

.roasting-table th:nth-child(3) {
  width: 20%;
}

.roasting-table th:nth-child(4) {
  width: 20%;
}

.roasting-table th:nth-child(5) {
  width: 15%;
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
  color: #4a634b;
}

.action-button:hover {
  color: #2a432b;
}

.action-button.selected {
  color: #4a634b;
  font-weight: bold;
}

.action-button.star.favorite {
  color: #f0ad4e;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #4a634b;
  font-size: 1.5rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
}

.modal-content {
  padding: 1.5rem;
  flex-grow: 1;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #eee;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.save-button {
  padding: 0.75rem 1.5rem;
  background-color: #4a634b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.form-section h3 {
  color: #5a7a6f;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: bold;
  color: #555;
}

.form-group input, .form-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .top-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-filter-container {
    flex-direction: column;
  }

  .search-container {
    max-width: 100%;
  }

  .action-buttons-container {
    justify-content: flex-end;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>