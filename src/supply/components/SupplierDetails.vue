<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import SupplierService from '../service/SupplierService';
import Header from '../../shared/components/Header.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// Allow the prop to come either from route params or direct prop
const props = defineProps({
  supplierId: {
    type: [Number, String],
    required: false
  }
});

const supplier = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  location: '',
  coffeeType: '',
  coffeeTypes: [],
  altitudes: []
});

// Cargar datos del proveedor al montar el componente
onMounted(() => {
  // Get the ID either from props or route params
  const id = props.supplierId || route.params.id;
  console.log('Supplier ID:', id);

  const supplierData = SupplierService.getSupplierById(Number(id));
  console.log('Supplier Data:', supplierData);

  if (supplierData) {
    supplier.value = supplierData;
  } else {
    // Si no se encuentra el proveedor, redirigir a la lista
    router.push('/suppliers');
  }
});

// Navegación
const goToSuppliersList = () => {
  router.push('/suppliers');
};
</script>

<template>
  <div class="supplier-details-container">
    <Header />

    <div class="breadcrumbs">
      <span class="breadcrumb-item clickable" @click="goToSuppliersList">{{ t('supply.home') }}</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item clickable" @click="goToSuppliersList">{{ t('supply.title') }}</span>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item">{{ supplier.name }}</span>
    </div>

    <div class="content-container">
      <div class="details-section">
        <h2 class="section-header">{{ t('supply.details.contactInfo') }}</h2>

        <div class="details-grid">
          <div class="detail-row">
            <div class="detail-label">{{ t('supply.details.supplierName') }}:</div>
            <div class="detail-value">{{ supplier.name }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">{{ t('supply.details.email') }}:</div>
            <div class="detail-value">{{ supplier.email }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">{{ t('supply.details.contactNumber') }}:</div>
            <div class="detail-value">{{ supplier.phone }}</div>
          </div>

          <div class="detail-row">
            <div class="detail-label">{{ t('supply.details.location') }}:</div>
            <div class="detail-value">{{ supplier.location }}</div>
          </div>
        </div>
      </div>

      <div class="details-section">
        <h2 class="section-header">{{ t('supply.details.productInfo') }}</h2>

        <div class="details-grid">
          <div class="detail-row">
            <div class="detail-label">{{ t('supply.details.coffeeTypes') }}:</div>
            <div class="detail-value">
              <div v-if="supplier.coffeeTypes && supplier.coffeeTypes.length > 0">
                <div v-for="(type, index) in supplier.coffeeTypes" :key="index" class="detail-list-item">
                  -{{ type }}
                </div>
              </div>
              <div v-else>{{ t('supply.details.noDataAvailable') }}</div>
            </div>
          </div>

          <div class="detail-row">
            <div class="detail-label">{{ t('supply.details.altitude') }}:</div>
            <div class="detail-value">
              <div v-if="supplier.altitudes && supplier.altitudes.length > 0">
                <div v-for="(altitude, index) in supplier.altitudes" :key="index" class="detail-list-item">
                  {{ altitude }}
                </div>
              </div>
              <div v-else v-for="altitude in [supplier.altitude]" :key="altitude" class="detail-list-item">
                {{ altitude }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.supplier-details-container {
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

.detail-list-item {
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