<template>
  <div class="portfolio-page">
    <HeaderBar />
    <BreadcrumbNavigation :items="breadcrumbItems" />
    
    <div class="search-container">
      <div class="search-box">
        <i class="pi pi-search"></i>
        <pv-inputtext 
          type="text" 
          v-model="searchQuery" 
          placeholder="Buscar..." 
          @input="filterItems"
        />
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
      <div>
        <h4>Recetas Sin Portafolio ({{ beveragesWithoutPortfolio.length }})</h4>
        <pre>{{ JSON.stringify(beveragesWithoutPortfolio, null, 2) }}</pre>
      </div>
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

    <!-- Sección de Bebidas sin portfolio -->
    <div v-if="!loading && !errorMessage" class="section-header">
      <h2>{{ $t('recipes.beveragesWithoutPortfolio') }}</h2>
      <button class="create-btn" @click="navigateToNewRecipe()">
        {{ $t('recipes.createBeverage') }}
      </button>
    </div>

    <div v-if="!loading && !errorMessage" class="beverages-grid">
      <div v-if="filteredBeverages.length === 0" class="empty-message">
        <p>No hay recetas sin portafolio</p>
      </div>
      <div 
        v-for="beverage in filteredBeverages" 
        :key="beverage.id" 
        class="beverage-card"
      >
        <img :src="beverage.image || '/placeholder-coffee.jpg'" :alt="beverage.name" />
        <div class="beverage-content">
          <h4>{{ beverage.name }}</h4>
          <p>{{ beverage.preparationTime }}</p>
        </div>
        <div v-if="getPortfolioName(beverage.portfolioId)" class="recipe-portfolio-badge">
          <i class="pi pi-folder"></i> {{ getPortfolioName(beverage.portfolioId) }}
        </div>
        <div class="beverage-actions">
          <button @click.stop="navigateToRecipeDetail(beverage.id)" class="action-btn view-btn">
            <i class="pi pi-eye"></i>
          </button>
          <button @click.stop="openAssignPortfolioModal(beverage)" class="action-btn assign-btn">
            <i class="pi pi-link"></i>
          </button>
          <button @click.stop="confirmDeleteRecipe(beverage)" class="action-btn delete-btn">
            <i class="pi pi-trash"></i>
          </button>
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
    
    <!-- Modal para asignar receta a portafolio -->
    <div v-if="showAssignPortfolioModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Asignar Receta a Portafolio</h2>
          <button class="close-btn" @click="showAssignPortfolioModal = false">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <label>Seleccionar Portafolio</label>
          <select v-model="selectedPortfolioId" class="portfolio-select white-background-input">
            <option value="">Selecciona un portafolio</option>
            <option v-for="portfolio in portfolios" :key="portfolio.id" :value="portfolio.id">
              {{ portfolio.name }}
            </option>
          </select>
        </div>

        <div class="modal-footer">
          <button class="create-modal-btn" @click="assignToPortfolio" :disabled="!selectedPortfolioId">
            Asignar
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
import { useRouter, useRoute } from 'vue-router';
import BreadcrumbNavigation from '../../shared/components/BreadcrumbNavigation.component.vue';
import HeaderBar from "../../public/components/headerBar.vue";
import { PortfolioService } from '../services/portfolio.service';
import { RecipeService } from '../services/recipe.service';
import { Portfolio } from '../model/portfolio.entity';

const router = useRouter();
const route = useRoute();

// Instancia de servicios
const portfolioService = new PortfolioService();
const recipeService = new RecipeService();

// Debug info
const debug = ref(false);
const apiBaseUrl = 'https://6824c85c0f0188d7e72ac99e.mockapi.io/api/v1';

// Datos para el breadcrumb
const breadcrumbItems = [
  { label: 'Inicio', path: '/dashboard' },
  { label: 'Recetas', path: '/recetas' }
];

// Estados para el manejo de datos
const searchQuery = ref('');
const portfolios = ref([]);
const beveragesWithoutPortfolio = ref([]);
const loading = ref(false);
const errorMessage = ref('');

// Estados para modales
const showNewPortfolioModal = ref(false);
const showAssignPortfolioModal = ref(false);
const showDeleteConfirmation = ref(false);
const isEditingPortfolio = ref(false);
const currentPortfolio = ref(new Portfolio({}));
const selectedPortfolioId = ref('');
const selectedRecipe = ref(null);
const deleteConfirmationMessage = ref('');
const itemToDelete = ref(null);
const deleteType = ref('');

// Cargar datos de la API
const loadData = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    console.log('Cargando portafolios y recetas...');
    portfolios.value = await portfolioService.getAllPortfolios();
    console.log('Portafolios cargados:', portfolios.value);
    
    // Obtener recetas sin portafolio usando el método actualizado
    beveragesWithoutPortfolio.value = await recipeService.getRecipesWithoutPortfolio();
    console.log('Recetas sin portafolio cargadas:', beveragesWithoutPortfolio.value);
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

// Filtrado de items
const filteredPortfolios = computed(() => {
  if (!searchQuery.value) return portfolios.value;
  return portfolios.value.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredBeverages = computed(() => {
  if (!searchQuery.value) return beveragesWithoutPortfolio.value;
  return beveragesWithoutPortfolio.value.filter(b => 
    b.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Métodos para navegación
const navigateToPortfolio = (id) => {
  router.push(`/recetas/portfolio/${id}`);
};

const navigateToNewRecipe = () => {
  router.push('/recetas/nueva');
};

const navigateToRecipeDetail = (id) => {
  router.push(`/recetas/detalle/${id}`);
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

const openAssignPortfolioModal = (recipe) => {
  selectedRecipe.value = recipe;
  showAssignPortfolioModal.value = true;
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

// Método para asignar una receta a un portafolio
const assignToPortfolio = async () => {
  if (!selectedRecipe.value || !selectedPortfolioId.value) return;
  
  loading.value = true;
  try {
    await recipeService.assignToPortfolio(selectedRecipe.value.id, selectedPortfolioId.value);
    
    // Recargar datos
    beveragesWithoutPortfolio.value = await recipeService.getRecipesWithoutPortfolio();
    portfolios.value = await portfolioService.getAllPortfolios();
    
    showAssignPortfolioModal.value = false;
    selectedPortfolioId.value = '';
  } catch (error) {
    console.error('Error al asignar la receta al portafolio:', error);
  } finally {
    loading.value = false;
  }
};

// Métodos para confirmación de eliminación
const confirmDeletePortfolio = (portfolio) => {
  itemToDelete.value = portfolio;
  deleteType.value = 'portfolio';
  deleteConfirmationMessage.value = `¿Estás seguro de que deseas eliminar el portafolio "${portfolio.name}"?`;
  showDeleteConfirmation.value = true;
};

const confirmDeleteRecipe = (recipe) => {
  itemToDelete.value = recipe;
  deleteType.value = 'recipe';
  deleteConfirmationMessage.value = `¿Estás seguro de que deseas eliminar la receta "${recipe.name}"?`;
  showDeleteConfirmation.value = true;
};

const deleteConfirmed = async () => {
  if (!itemToDelete.value) return;
  
  loading.value = true;
  try {
    if (deleteType.value === 'portfolio') {
      await portfolioService.deletePortfolio(itemToDelete.value.id);
      // Cerrar el diálogo primero
      showDeleteConfirmation.value = false;
      showAssignPortfolioModal.value = false;
      
      // Luego recargar datos
      setTimeout(async () => {
        portfolios.value = await portfolioService.getAllPortfolios();
        itemToDelete.value = null;
      }, 100);
    } else if (deleteType.value === 'recipe') {
      await recipeService.deleteRecipe(itemToDelete.value.id);
      // Cerrar el diálogo primero
      showDeleteConfirmation.value = false;
      showAssignPortfolioModal.value = false;
      
      // Luego recargar datos
      setTimeout(async () => {
        beveragesWithoutPortfolio.value = await recipeService.getRecipesWithoutPortfolio();
        itemToDelete.value = null;
      }, 100);
    }
  } catch (error) {
    console.error('Error al eliminar:', error);
    showDeleteConfirmation.value = false;
    showAssignPortfolioModal.value = false;
  } finally {
    loading.value = false;
  }
};

const filterItems = () => {
  // Esta función se llama cuando el usuario escribe en el campo de búsqueda
  // El filtrado ya está implementado mediante los computed
};

// Método para obtener el nombre del portafolio por ID
const getPortfolioName = (portfolioId) => {
  if (!portfolioId) return null;
  const numPortfolioId = Number(portfolioId);
  const portfolio = portfolios.value.find(p => Number(p.id) === numPortfolioId);
  return portfolio ? portfolio.name : null;
};
</script>

<style scoped>
.portfolio-page {
  padding: 20px;
  padding-top: 100px; /* Espacio para el header */
  max-width: 1200px;
  margin: 0 auto;
}

.search-container {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-box {
  position: relative;
  max-width: 400px;
  flex: 1;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-box input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
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

.recipe-count {
  font-size: 12px;
  opacity: 0.8;
}

.portfolio-actions {
  display: flex;
  gap: 5px;
}

.beverages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.beverage-card {
  background-color: #f8f8f8;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  text-align: center;
  padding-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  position: relative;
}

.beverage-card:hover {
  transform: translateY(-5px);
}

.beverage-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.beverage-content {
  padding: 10px;
  text-align: left;
}

.beverage-content h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.beverage-content p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.recipe-portfolio-badge {
  background-color: #c38757;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  margin: 0 10px 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.beverage-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 0 10px 10px;
}

.action-btn {
  border: none;
  background-color: #f5f5f5;
  cursor: pointer;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn {
  color: #3C4B3A;
}

.edit-btn {
  color: #2563eb;
}

.assign-btn {
  color: #059669;
}

.delete-btn {
  color: #dc2626;
}

.action-btn:hover {
  background-color: rgba(0,0,0,0.1);
}

/* Estilos para los inputs y selects */
.modal-body input,
.portfolio-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: #fff;
}

/* Clase para inputs con fondo blanco */
.white-background-input {
  background-color: #fff !important;
  color: #333 !important;
}

.search-box input {
  background-color: #fff;
  color: #333;
}


/* Estilos para el modal */
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
</style> 