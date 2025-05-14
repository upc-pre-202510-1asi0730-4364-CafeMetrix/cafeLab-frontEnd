<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import CoffeeLotService from '../service/CoffeeLotService';
import Header from '../../shared/components/Header.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// Allow the prop to come either from route params or direct prop
const props = defineProps({
  lotId: {
    type: [Number, String],
    required: false
  }
});

const lot = ref({
  id: null,
  name: '',
  type: '',
  process: '',
  altitude: '',
  weight: '',
  origin: '',
  certifications: [],
  productionDate: ''
});

// Load lot data when component is mounted
onMounted(() => {
  // Get the ID either from props or route params
  const id = props.lotId || route.params.id;
  
  const lotData = CoffeeLotService.getLotById(Number(id));
  
  if (lotData) {
    lot.value = lotData;
  } else {
    // If lot is not found, redirect to the lots list
    router.push('/lots');
  }
});

// Navigation
const goToLotsList = () => {
  router.push('/lots');
};
</script>

<template>
  <div class="lot-details-container">
    <Header />
    
    <div class="breadcrumbs">
      <span class="breadcrumb-item clickable" @click="goToLotsList">{{ t('coffee.home') }}</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item clickable" @click="goToLotsList">{{ t('coffee.title') }}</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">{{ lot.name }}</span>
    </div>
    
    <div class="content-container">
      <div class="details-section">
        <h2 class="section-header">{{ t('coffee.details.information') }}</h2>
        
        <div class="details-grid">
          <div class="detail-row">
            <div class="detail-label">{{ t('coffee.details.name') }}:</div>
            <div class="detail-value">{{ lot.name }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">{{ t('coffee.details.process') }}:</div>
            <div class="detail-value">{{ lot.process }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">{{ t('coffee.details.quantity') }}:</div>
            <div class="detail-value">{{ lot.weight }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">{{ t('coffee.details.origin') }}:</div>
            <div class="detail-value">{{ lot.origin }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">{{ t('coffee.details.productionDate') }}:</div>
            <div class="detail-value">{{ lot.productionDate }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">{{ t('coffee.details.type') }}:</div>
            <div class="detail-value">{{ lot.type }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">{{ t('coffee.details.altitude') }}:</div>
            <div class="detail-value">{{ lot.altitude }}</div>
          </div>
          
          <div class="detail-row">
            <div class="detail-label">{{ t('coffee.details.certifications') }}:</div>
            <div class="detail-value">
              <div v-if="lot.certifications && lot.certifications.length > 0">
                <div v-for="(cert, index) in lot.certifications" :key="index" class="certification-item">
                  -{{ cert }}
                </div>
              </div>
              <div v-else>{{ t('coffee.details.noDataAvailable') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lot-details-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  flex-grow: 1;
  padding: 0 2rem 2rem;
}

.details-section {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.section-header {
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #eee;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.detail-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
}

.detail-label {
  font-weight: 600;
  color: #555;
}

.detail-value {
  color: #333;
}

.certification-item {
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .detail-row {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
  
  .detail-label {
    margin-bottom: 0.25rem;
  }
}
</style> 