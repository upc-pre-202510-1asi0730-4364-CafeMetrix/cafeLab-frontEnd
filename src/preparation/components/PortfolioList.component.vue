<template>
  <div class="portfolio-list-container">
    <!-- Debug Info para desarrollo (oculto) -->
    <div v-if="debug" class="debug-info">
      <h3>Información de Depuración</h3>
      <button @click="debug = false" class="close-debug">Cerrar</button>
      <div>
        <h4>API URL</h4>
        <code>{{ apiBaseUrl }}</code>
      </div>
      <div>
        <h4>Portafolios Cargados ({{ portfolios.length }})</h4>
        <pre>{{ JSON.stringify(portfolios, null, 2) }}</pre>
      </div>
    </div>

    <!-- Mensaje de carga o error -->
    <div v-if="loading" class="loading-message">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
      <p>Cargando datos...</p>
    </div>
    
    <div v-if="errorMessage" class="error-message">
      <i class="pi pi-exclamation-triangle" style="font-size: 1.5rem"></i>
      <p>{{ errorMessage }}</p>
      <button @click="loadData" class="retry-btn">Reintentar</button>
    </div>

    <!-- Sección de Portafolios -->
    <div v-if="!loading && !errorMessage" class="section-header">
      <h2>{{ $t('recipes.portfolios') }}</h2>
      <button class="create-btn" @click="showNewPortfolioModal = true">
        {{ $t('recipes.createPortfolio') }}
      </button>
    </div>

    <div v-if="!loading && !errorMessage" class="portfolios-container">
      <div v-if="filteredPortfolios.length === 0" class="empty-message">
        <p>No hay portafolios disponibles</p>
      </div>
      <div 
        v-for="portfolio in filteredPortfolios" 
        :key="portfolio.id" 
        class="portfolio-item"
        @click="navigateToPortfolio(portfolio.id)"
      >
        <div class="portfolio-content">
          <h3>{{ portfolio.name }}</h3>
        </div>
      </div>
    </div>

    <!-- Modal para crear nuevo portafolio -->
    <div v-if="showNewPortfolioModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ isEditingPortfolio ? 'Editar Portafolio' : $t('recipes.newPortfolio') }}</h2>
          <button class="close-btn" @click="closePortfolioModal">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <label>{{ $t('recipes.portfolioName') }}</label>
          <input 
            type="text" 
            v-model="currentPortfolio.name"
            :placeholder="$t('recipes.portfolioNamePlaceholder')"
            class="white-background-input"
          />
        </div>

        <div class="modal-footer">
          <button class="create-modal-btn" @click="savePortfolio">
            {{ isEditingPortfolio ? 'Actualizar' : $t('recipes.create') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmación para eliminar -->
    <div v-if="showDeleteConfirmation" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Confirmar Eliminación</h2>
          <button class="close-btn" @click="showDeleteConfirmation = false">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="modal-body confirmation-content">
          <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #d32f2f;"></i>
          <p class="confirmation-message">{{ deleteConfirmationMessage }}</p>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="showDeleteConfirmation = false">
            Cancelar
          </button>
          <button class="delete-confirm-btn" @click="deleteConfirmed">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { PortfolioService } from '../services/portfolio.service';
import { Portfolio } from '../model/portfolio.entity';

const router = useRouter();

// Instancia de servicios
const portfolioService = new PortfolioService();

// Debug info
const debug = ref(false);
const apiBaseUrl = import.meta.env.VITE_MOCKAPI_URL_4 || 'https://6824c85c0f0188d7e72ac99e.mockapi.io/api/v1';

// Props para la búsqueda
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
});

// Estados para el manejo de datos
const portfolios = ref([]);
const loading = ref(false);
const errorMessage = ref('');

// Estados para modales
const showNewPortfolioModal = ref(false);
const showDeleteConfirmation = ref(false);
const isEditingPortfolio = ref(false);
const currentPortfolio = ref(new Portfolio({}));
const deleteConfirmationMessage = ref('');
const itemToDelete = ref(null);

// Cargar datos de la API
const loadData = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    console.log('Cargando portafolios...');
    portfolios.value = await portfolioService.getAllPortfolios();
    console.log('Portafolios cargados:', portfolios.value);
  } catch (error) {
    console.error('Error al cargar datos:', error);
    errorMessage.value = 'No se pudieron cargar los datos. Verifica que el servicio MockAPI esté disponible.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

// Filtrado de portfolios basado en la búsqueda
const filteredPortfolios = computed(() => {
  if (!props.searchQuery) return portfolios.value;
  return portfolios.value.filter(p => 
    p.name.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});

// Métodos para navegación
const navigateToPortfolio = (id) => {
  router.push(`/recetas/portfolio/${id}`);
};

// Métodos para modales
const openEditPortfolioModal = (portfolio) => {
  currentPortfolio.value = { ...portfolio };
  isEditingPortfolio.value = true;
  showNewPortfolioModal.value = true;
};

const closePortfolioModal = () => {
  showNewPortfolioModal.value = false;
  currentPortfolio.value = new Portfolio({});
  isEditingPortfolio.value = false;
};

// Método para crear/actualizar un portafolio
const savePortfolio = async () => {
  if (currentPortfolio.value.name.trim() === '') return;
  
  loading.value = true;
  try {
    if (isEditingPortfolio.value) {
      await portfolioService.updatePortfolio(currentPortfolio.value.id, currentPortfolio.value);
    } else {
      await portfolioService.createPortfolio({ name: currentPortfolio.value.name });
    }
    
    // Recargar portafolios
    portfolios.value = await portfolioService.getAllPortfolios();
    closePortfolioModal();
  } catch (error) {
    console.error('Error al guardar el portafolio:', error);
  } finally {
    loading.value = false;
  }
};

// Métodos para confirmación de eliminación
const confirmDeletePortfolio = (portfolio) => {
  itemToDelete.value = portfolio;
  deleteConfirmationMessage.value = `¿Estás seguro de que deseas eliminar el portafolio "${portfolio.name}"?`;
  showDeleteConfirmation.value = true;
};

const deleteConfirmed = async () => {
  if (!itemToDelete.value) return;
  
  loading.value = true;
  try {
    await portfolioService.deletePortfolio(itemToDelete.value.id);
    
    // Cerrar el diálogo primero
    showDeleteConfirmation.value = false;
    
    // Luego recargar datos
    setTimeout(async () => {
      portfolios.value = await portfolioService.getAllPortfolios();
      itemToDelete.value = null;
    }, 100);
  } catch (error) {
    console.error('Error al eliminar:', error);
    showDeleteConfirmation.value = false;
  } finally {
    loading.value = false;
  }
};

// Exponer método para recargar desde el componente padre
defineExpose({
  loadData
});
</script>

<style scoped>
.portfolio-list-container {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 15px;
}

.section-header h2 {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.create-btn {
  background-color: #3C4B3A;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.portfolios-container {
  margin-bottom: 30px;
}

.portfolio-item {
  background-color: #c38757;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.portfolio-item:hover {
  transform: translateY(-2px);
}

.portfolio-content {
  flex: 1;
}

.portfolio-item h3 {
  margin: 0;
  font-size: 18px;
}

.loading-message,
.error-message,
.empty-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background-color: #f8f8f8;
  border-radius: 8px;
  margin: 1rem 0;
}

.loading-message {
  color: #3C4B3A;
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background-color: #f8d7da;
  border: 2px solid #d32f2f;
  border-radius: 8px;
  margin: 1rem 0;
  color: #333;
  gap: 0.5rem;
}

.error-message i {
  color: #d32f2f;
  font-size: 1.5rem;
}

.error-message p {
  font-weight: 500;
  font-size: 16px;
}

.retry-btn {
  background-color: #3C4B3A;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-top: 0.5rem;
  cursor: pointer;
}

.empty-message {
  font-style: italic;
  color: #666;
  padding: 1rem;
}

.debug-info {
  background-color: #f0f9ff;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  position: relative;
  border: 1px solid #bde0fe;
  max-height: 500px;
  overflow-y: auto;
}

.debug-info h3 {
  margin-top: 0;
  color: #0c4a6e;
}

.debug-info h4 {
  margin-bottom: 0.5rem;
  color: #0369a1;
}

.debug-info pre {
  background-color: #ffffff;
  padding: 0.5rem;
  border-radius: 4px;
  overflow: auto;
  border: 1px solid #ddd;
  max-height: 200px;
}

.close-debug {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: #f87171;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

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
  z-index: 100;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #666;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-body label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.create-modal-btn {
  background-color: #3C4B3A;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.cancel-btn {
  background-color: #f3f4f6;
  color: #4b5563;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.delete-confirm-btn {
  background-color: #dc2626;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}

.confirmation-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  text-align: center;
  padding: 10px;
}

.confirmation-message {
  color: #333;
  font-weight: 500;
  font-size: 16px;
  margin: 0;
}

.white-background-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: white !important;
  color: #333 !important;
}
</style> 