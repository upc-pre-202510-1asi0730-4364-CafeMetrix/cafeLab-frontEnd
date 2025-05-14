<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import RoastingProfileService from '../service/RoastingProfileService';
import Header from '../../shared/components/Header.vue';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const profileId = Number(route.params.id);
const profile = ref(null);

// Datos adicionales para la vista detallada
const additionalData = ref({
  duration: '20 minutos',
  initialTemp: '40 °C',
  finalTemp: '150 °C',
  linkedLot: 'Lote X'
});

onMounted(() => {
  profile.value = RoastingProfileService.getProfileById(profileId);
  if (!profile.value) {
    router.push('/roasting');
  }
});

const goBack = () => {
  router.push('/roasting');
};
</script>

<template>
  <div class="details-container" v-if="profile">
    <Header />
    
    <div class="breadcrumbs">
      <router-link to="/" class="breadcrumb-item clickable">{{ t('roasting.home') }}</router-link>
      <span class="breadcrumb-separator">></span>
      <router-link to="/roasting" class="breadcrumb-item clickable">{{ t('roasting.title') }}</router-link>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">{{ profile.name }}</span>
    </div>
    
    <div class="content-container">
      <div class="roast-curve-section">
        <h2>Curva de proceso de tostado:</h2>
        <div class="roast-curve-container">
          <div class="roast-curve-placeholder">
            <img src="/placeholder-curve.png" alt="Curva de tueste simulada" class="roast-curve-image" />
          </div>
        </div>
      </div>
      
      <div class="profile-details-section">
        <div class="profile-detail-item">
          <h3>Tipo de Café: {{ profile.type }}</h3>
        </div>
        
        <div class="profile-detail-item">
          <h3>Duración total: {{ additionalData.duration }}</h3>
        </div>
        
        <div class="profile-detail-item">
          <h3>Temp. Inicial: {{ additionalData.initialTemp }}</h3>
        </div>
        
        <div class="profile-detail-item">
          <h3>Temp. final: {{ additionalData.finalTemp }}</h3>
        </div>
        
        <div class="profile-detail-item">
          <h3>Lote vinculado: {{ additionalData.linkedLot }}</h3>
        </div>
      </div>
      
      <div class="actions">
        <button class="back-button" @click="goBack">{{ t('roasting.registerForm.back') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-container {
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
  display: flex;
  flex-direction: column;
}

.roast-curve-section {
  margin-bottom: 2rem;
}

.roast-curve-section h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.4rem;
  font-weight: bold;
}

.roast-curve-container {
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.roast-curve-placeholder {
  width: 100%;
  max-width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.roast-curve-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.profile-details-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.profile-detail-item {
  padding: 1rem;
}

.profile-detail-item h3 {
  color: #333;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
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

@media (max-width: 768px) {
  .content-container {
    padding: 0 1rem 1rem;
  }
  
  .roast-curve-placeholder {
    height: 200px;
  }
}
</style> 