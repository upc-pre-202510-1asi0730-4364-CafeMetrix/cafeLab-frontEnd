<template>
  <div class="recipe-list-container">
    <!-- Sección de Bebidas sin portfolio -->
    <div v-if="!loading && !errorMessage" class="section-header">
      <h2>{{ $t('recipes.beveragesWithoutPortfolio') }}</h2>
      <button class="create-btn" @click="navigateToNewRecipe()">
        {{ $t('recipes.createBeverage') }}
      </button>
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

    <div v-if="!loading && !errorMessage" class="beverages-grid">
      <div v-if="filteredBeverages.length === 0" class="empty-message">
        <p>No hay recetas sin portafolio</p>
      </div>
      <RecipeCard
        v-for="beverage in filteredBeverages"
        :key="beverage.id"
        :recipe="beverage"
        :portfolioName="getPortfolioName(beverage.portfolioId)"
        :showActions="true"
        :showView="true"
        :showAssign="true"
        :showDelete="true"
        :showRemove="false"
        @click="navigateToRecipeDetail(beverage.id)"
        @view="navigateToRecipeDetail"
        @assign="openAssignPortfolioModal"
        @delete="confirmDeleteRecipe"
      />
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
import { useRouter } from 'vue-router';
import RecipeCard from './RecipeCard.component.vue';
import { PortfolioService } from '../services/portfolio.service';
import { RecipeService } from '../services/recipe.service';

const router = useRouter();

// Instancia de servicios
const portfolioService = new PortfolioService();
const recipeService = new RecipeService();

// Props para la búsqueda
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
});

// Estados para el manejo de datos
const portfolios = ref([]);
const beveragesWithoutPortfolio = ref([]);
const loading = ref(false);
const errorMessage = ref('');

// Estados para modales
const showAssignPortfolioModal = ref(false);
const showDeleteConfirmation = ref(false);
const selectedPortfolioId = ref('');
const selectedRecipe = ref(null);
const deleteConfirmationMessage = ref('');
const itemToDelete = ref(null);

// Cargar datos de la API
const loadData = async () => {
  loading.value = true;
  errorMessage.value = '';
  
  try {
    console.log('Cargando recetas sin portafolio...');
    
    // Cargar portfolios para el selector
    portfolios.value = await portfolioService.getAllPortfolios();
    
    // Obtener recetas sin portafolio
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

// Filtrado de recetas basado en la búsqueda
const filteredBeverages = computed(() => {
  if (!props.searchQuery) return beveragesWithoutPortfolio.value;
  return beveragesWithoutPortfolio.value.filter(b => 
    b.name.toLowerCase().includes(props.searchQuery.toLowerCase())
  );
});

// Métodos para navegación
const navigateToNewRecipe = () => {
  router.push('/recetas/nueva');
};

const navigateToRecipeDetail = (id) => {
  router.push(`/recetas/detalle/${id}`);
};

// Métodos para modales
const openAssignPortfolioModal = (recipe) => {
  selectedRecipe.value = recipe;
  showAssignPortfolioModal.value = true;
};

// Método para asignar una receta a un portafolio
const assignToPortfolio = async () => {
  if (!selectedRecipe.value || !selectedPortfolioId.value) return;
  
  loading.value = true;
  try {
    await recipeService.assignToPortfolio(selectedRecipe.value.id, selectedPortfolioId.value);
    
    // Recargar datos
    beveragesWithoutPortfolio.value = await recipeService.getRecipesWithoutPortfolio();
    
    showAssignPortfolioModal.value = false;
    selectedPortfolioId.value = '';
  } catch (error) {
    console.error('Error al asignar la receta al portafolio:', error);
  } finally {
    loading.value = false;
  }
};

// Métodos para confirmación de eliminación
const confirmDeleteRecipe = (recipe) => {
  itemToDelete.value = recipe;
  deleteConfirmationMessage.value = `¿Estás seguro de que deseas eliminar la receta "${recipe.name}"?`;
  showDeleteConfirmation.value = true;
};

const deleteConfirmed = async () => {
  if (!itemToDelete.value) return;
  
  loading.value = true;
  try {
    await recipeService.deleteRecipe(itemToDelete.value.id);
    
    // Cerrar el diálogo primero
    showDeleteConfirmation.value = false;
    showAssignPortfolioModal.value = false;
    
    // Luego recargar datos
    setTimeout(async () => {
      beveragesWithoutPortfolio.value = await recipeService.getRecipesWithoutPortfolio();
      itemToDelete.value = null;
    }, 100);
  } catch (error) {
    console.error('Error al eliminar:', error);
    showDeleteConfirmation.value = false;
    showAssignPortfolioModal.value = false;
  } finally {
    loading.value = false;
  }
};

// Método para obtener el nombre del portafolio por ID
const getPortfolioName = (portfolioId) => {
  if (!portfolioId) return null;
  const numPortfolioId = Number(portfolioId);
  const portfolio = portfolios.value.find(p => Number(p.id) === numPortfolioId);
  return portfolio ? portfolio.name : null;
};

// Exponer método para recargar desde el componente padre
defineExpose({
  loadData
});
</script>

<style scoped>
.recipe-list-container {
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

.beverages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
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

.portfolio-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: white;
}

.white-background-input {
  background-color: white !important;
  color: #333 !important;
}
</style> 