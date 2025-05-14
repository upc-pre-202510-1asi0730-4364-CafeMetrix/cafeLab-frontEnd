<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import RoastingProfileService from '../service/RoastingProfileService';
import Header from '../../shared/components/Header.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const allProfiles = ref([]);
const selectedProfileIds = ref([]);
const showProfileSelector = ref(false);

onMounted(() => {
  // Obtener todos los perfiles disponibles
  allProfiles.value = RoastingProfileService.getProfiles().value;
  
  // Si hay IDs en la ruta, seleccionar esos perfiles
  if (route.params.ids) {
    selectedProfileIds.value = route.params.ids.split(',').map(id => Number(id));
  }
});

// Perfiles seleccionados completos
const selectedProfiles = computed(() => {
  return selectedProfileIds.value.map(id => 
    allProfiles.value.find(profile => profile.id === id)
  ).filter(profile => profile !== undefined);
});

// Agregar un perfil a la comparación
const addProfileToComparison = () => {
  showProfileSelector.value = true;
};

// Seleccionar un perfil
const selectProfile = (profileId) => {
  if (!selectedProfileIds.value.includes(profileId)) {
    selectedProfileIds.value.push(profileId);
  }
  showProfileSelector.value = false;
};

// Volver a la lista de perfiles
const goBack = () => {
  router.push('/roasting');
};
</script>

<template>
  <div class="compare-container">
    <Header />
    
    <div class="breadcrumbs">
      <router-link to="/" class="breadcrumb-item clickable">{{ t('roasting.home') }}</router-link>
      <span class="breadcrumb-separator">></span>
      <router-link to="/roasting" class="breadcrumb-item clickable">{{ t('roasting.title') }}</router-link>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">Comparación de Tuestes</span>
    </div>
    
    <div class="content-container">
      <div class="profiles-selection">
        <div class="profile-selector" v-for="(profile, index) in selectedProfiles" :key="index">
          <div class="selector-label">Tueste {{ index + 1 }}</div>
          <div class="selector-input">
            <input type="text" :value="profile.name" disabled />
          </div>
        </div>
        
        <div class="add-profile-button" @click="addProfileToComparison">
          <i class="pi pi-plus-circle"></i>
        </div>
      </div>
      
      <!-- Gráfica de comparación -->
      <div class="comparison-graph">
        <img src="/placeholder-comparison.png" alt="Gráfica de comparación" class="comparison-image" />
      </div>
      
      <!-- Dropdown para seleccionar perfil -->
      <div class="profile-selector-dropdown" v-if="showProfileSelector">
        <div class="dropdown-header">
          <h3>Seleccionar perfil</h3>
          <button class="close-button" @click="showProfileSelector = false">×</button>
        </div>
        <div class="dropdown-content">
          <div 
            v-for="profile in allProfiles" 
            :key="profile.id" 
            class="profile-option"
            :class="{ 'selected': selectedProfileIds.includes(profile.id) }"
            @click="selectProfile(profile.id)"
          >
            {{ profile.name }}
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button class="back-button" @click="goBack">{{ t('roasting.registerForm.back') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compare-container {
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
  position: relative;
}

.profiles-selection {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.profile-selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
}

.selector-label {
  font-weight: 600;
  color: #333;
}

.selector-input input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #fff;
}

.add-profile-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #4a634b;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1.5rem;
  margin-top: 1.5rem;
}

.comparison-graph {
  width: 100%;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.comparison-image {
  width: 100%;
  height: auto;
  display: block;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.back-button {
  padding: 0.75rem 1.5rem;
  background-color: #4a634b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
}

.profile-selector-dropdown {
  position: absolute;
  top: 6rem;
  right: 3rem;
  width: 300px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #888;
}

.dropdown-content {
  max-height: 300px;
  overflow-y: auto;
}

.profile-option {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.profile-option:hover {
  background-color: #f5f5f5;
}

.profile-option.selected {
  background-color: #e7efe8;
  color: #4a634b;
  font-weight: bold;
}

@media (max-width: 768px) {
  .profiles-selection {
    flex-direction: column;
    align-items: stretch;
  }
  
  .profile-selector {
    min-width: 100%;
  }
  
  .add-profile-button {
    align-self: flex-end;
    margin-top: 0.5rem;
  }
  
  .profile-selector-dropdown {
    width: 90%;
    right: 5%;
    left: 5%;
  }
}
</style> 