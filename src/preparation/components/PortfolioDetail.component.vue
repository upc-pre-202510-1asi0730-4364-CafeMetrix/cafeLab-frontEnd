<template>
  <div class="portfolio-detail">
    <HeaderBar />
    <BreadcrumbNavigation :items="breadcrumbItems" />
    
    <div v-if="isLoading" class="loading-container">
      <i class="pi pi-spinner pi-spin"></i>
      <span>{{ $t('common.loading') }}</span>
    </div>
    
    <div v-else-if="error" class="error-container">
      <i class="pi pi-exclamation-triangle"></i>
      <p>{{ error }}</p>
      <button @click="loadData">{{ $t('common.retry') }}</button>
    </div>
    
    <div v-else class="content-container">
      <div class="portfolio-header">
        <h1>{{ portfolio?.name }}</h1>
        <div class="actions">
          <button class="primary-btn" @click="showAddRecipeModal = true">
            <i class="pi pi-plus"></i>
            {{ $t('recipes.addRecipe') }}
          </button>
          <button class="edit-btn" @click="showEditModal = true">
            <i class="pi pi-pencil"></i>
            {{ $t('common.edit') }}
          </button>
          <button class="delete-btn" @click="confirmDelete">
            <i class="pi pi-trash"></i>
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
      
      <div v-if="!portfolio?.recipes || portfolio?.recipes?.length === 0" class="empty-state">
        <p>{{ $t('recipes.noRecipesInPortfolio') }}</p>
        <button @click="showAddRecipeModal = true">
          {{ $t('recipes.addFirstRecipe') }}
        </button>
      </div>
      
      <div v-else class="recipes-grid">
        <div 
          v-for="recipe in portfolio?.recipes" 
          :key="recipe.id" 
          class="recipe-card"
          @click="navigateToRecipeDetail(recipe.id)"
        >
          <div class="recipe-image">
            <img :src="recipe.image" :alt="recipe.name" />
            <button 
              class="remove-btn" 
              @click.stop="confirmRemoveRecipe(recipe.id)"
            >
              <i class="pi pi-times"></i>
            </button>
          </div>
          <div class="recipe-info">
            <h3>{{ recipe.name }}</h3>
            <p v-if="recipe.preparationTime">
              <i class="pi pi-clock"></i>
              {{ recipe.preparationTime }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Modal de edición de portafolio -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ $t('recipes.editPortfolio') }}</h2>
          <button class="close-btn" @click="showEditModal = false">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <label>{{ $t('recipes.portfolioName') }}</label>
          <input 
            type="text" 
            v-model="editedName"
            :placeholder="$t('recipes.portfolioNamePlaceholder')"
          />
        </div>

        <div class="modal-footer">
          <button class="secondary-btn" @click="showEditModal = false">
            {{ $t('common.cancel') }}
          </button>
          <button class="primary-btn" @click="savePortfolio">
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal para añadir receta -->
    <div v-if="showAddRecipeModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ $t('recipes.addRecipeToPortfolio') }}</h2>
          <button class="close-btn" @click="showAddRecipeModal = false">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="isLoadingRecipes" class="loading-container">
            <i class="pi pi-spinner pi-spin"></i>
            <span>{{ $t('common.loading') }}</span>
          </div>
          
          <div v-else-if="availableRecipes.length === 0" class="empty-state">
            <p>{{ $t('recipes.noAvailableRecipes') }}</p>
            <button @click="navigateToNewRecipe">
              {{ $t('recipes.createNewRecipe') }}
            </button>
          </div>
          
          <div v-else class="recipe-list">
            <div 
              v-for="recipe in availableRecipes" 
              :key="recipe.id" 
              class="recipe-list-item"
              @click="selectRecipe(recipe.id)"
            >
              <img 
                :src="recipe.image" 
                :alt="recipe.name" 
                class="recipe-thumbnail"
              />
              <span>{{ recipe.name }}</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="secondary-btn" @click="showAddRecipeModal = false">
            {{ $t('common.cancel') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteConfirmation" class="modal-overlay">
      <div class="modal-container delete-modal">
        <div class="modal-header">
          <h2>{{ $t('common.confirmDelete') }}</h2>
          <button class="close-btn" @click="showDeleteConfirmation = false">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #d32f2f;"></i>
            <p class="confirmation-message">{{ $t('recipes.deletePortfolioConfirmation') }}</p>
          </div>
          <p class="warning">{{ $t('recipes.deletePortfolioWarning') }}</p>
        </div>

        <div class="modal-footer">
          <button class="secondary-btn" @click="showDeleteConfirmation = false">
            {{ $t('common.cancel') }}
          </button>
          <button class="delete-btn" @click="deletePortfolio">
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmación para quitar receta -->
    <div v-if="showRemoveRecipeConfirmation" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ $t('common.confirmRemove') }}</h2>
          <button class="close-btn" @click="showRemoveRecipeConfirmation = false">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #d32f2f;"></i>
            <p class="confirmation-message">{{ $t('recipes.removeRecipeConfirmation') }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="secondary-btn" @click="showRemoveRecipeConfirmation = false">
            {{ $t('common.cancel') }}
          </button>
          <button class="primary-btn" @click="removeRecipe">
            {{ $t('common.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BreadcrumbNavigation from '../../shared/components/BreadcrumbNavigation.component.vue';
import { PortfolioManager } from '../stores/portfolioManager';
import { RecipeManager } from '../stores/recipeManager';
import HeaderBar from "../../public/components/headerBar.vue";
const router = useRouter();
const route = useRoute();

// Estados
const showEditModal = ref(false);
const showAddRecipeModal = ref(false);
const showDeleteConfirmation = ref(false);
const showRemoveRecipeConfirmation = ref(false);
const editedName = ref('');
const selectedRecipeId = ref(null);
const isLoadingRecipes = ref(false);
const availableRecipes = ref([]);

// Obtener el ID del portafolio de la ruta
const portfolioId = computed(() => parseInt(route.params.id));

// Estados computados
const portfolio = computed(() => PortfolioManager.getCurrentPortfolio());
const isLoading = computed(() => PortfolioManager.getIsLoading());
const error = computed(() => PortfolioManager.getError());

// Datos para el breadcrumb
const breadcrumbItems = computed(() => [
  { label: 'Inicio', path: '/dashboard' },
  { label: 'Recetas', path: '/recetas' },
  { label: portfolio.value?.name || 'Portafolio', path: `/recetas/portfolio/${portfolioId.value}` }
]);

// Cargar datos del portafolio
const loadData = async () => {
  if (portfolioId.value) {
    await PortfolioManager.fetchPortfolioById(portfolioId.value);
    
    if (portfolio.value) {
      editedName.value = portfolio.value.name;
    }
  }
};

// Cargar recetas disponibles para añadir
const loadAvailableRecipes = async () => {
  isLoadingRecipes.value = true;
  try {
    await RecipeManager.fetchRecipesWithoutPortfolio();
    availableRecipes.value = RecipeManager.getRecipesWithoutPortfolio();
  } catch (error) {
    console.error('Error al cargar recetas disponibles:', error);
  } finally {
    isLoadingRecipes.value = false;
  }
};

// Navegación a detalles de receta
const navigateToRecipeDetail = (recipeId) => {
  router.push(`/recetas/detalle/${recipeId}`);
};

// Navegación para crear nueva receta
const navigateToNewRecipe = () => {
  router.push('/recetas/nueva');
};

// Guardar cambios en el portafolio
const savePortfolio = async () => {
  if (editedName.value.trim() === '') return;
  
  try {
    await PortfolioManager.updatePortfolio(portfolioId.value, { name: editedName.value });
    showEditModal.value = false;
  } catch (error) {
    console.error('Error al actualizar el portafolio:', error);
  }
};

// Confirmar eliminación de portafolio
const confirmDelete = () => {
  showDeleteConfirmation.value = true;
};

// Eliminar portafolio
const deletePortfolio = async () => {
  try {
    await PortfolioManager.deletePortfolio(portfolioId.value);
    // Cerrar el diálogo primero
    showDeleteConfirmation.value = false;
    
    // Pequeño retraso para asegurar que el diálogo se cierra visualmente antes de redirigir
    setTimeout(() => {
      router.push('/recetas');
    }, 100);
  } catch (error) {
    console.error('Error al eliminar el portafolio:', error);
    showDeleteConfirmation.value = false;
  }
};

// Seleccionar receta para añadir al portafolio
const selectRecipe = async (recipeId) => {
  try {
    await RecipeManager.assignToPortfolio(recipeId, portfolioId.value);
    await PortfolioManager.fetchPortfolioById(portfolioId.value);
    showAddRecipeModal.value = false;
  } catch (error) {
    console.error('Error al asignar la receta al portafolio:', error);
  }
};

// Confirmar eliminación de receta del portafolio
const confirmRemoveRecipe = (recipeId) => {
  selectedRecipeId.value = recipeId;
  showRemoveRecipeConfirmation.value = true;
};

// Quitar receta del portafolio
const removeRecipe = async () => {
  if (!selectedRecipeId.value) return;
  
  try {
    await RecipeManager.removeFromPortfolio(selectedRecipeId.value);
    await PortfolioManager.fetchPortfolioById(portfolioId.value);
    showRemoveRecipeConfirmation.value = false;
  } catch (error) {
    console.error('Error al quitar la receta del portafolio:', error);
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  loadData();
});

// Observar cambios en la modal para cargar recetas cuando se muestra
watch(showAddRecipeModal, (newValue) => {
  if (newValue) {
    loadAvailableRecipes();
  }
});
</script>

<style scoped>
.portfolio-detail {
  padding: 20px;
  padding-top: 100px; /* Espacio para el header */
  max-width: 1200px;
  margin: 0 auto;
}

.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 50px 0;
  text-align: center;
  background-color: #f8d7da;
  border: 2px solid #d32f2f;
  border-radius: 8px;
  padding: 20px;
}

.loading-container i, .error-container i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #3C4B3A;
}

.error-container i {
  color: #d32f2f;
}

.error-container p {
  color: #333;
  font-weight: 500;
  font-size: 16px;
}

.error-container button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #3C4B3A;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.portfolio-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
}

.portfolio-header h1 {
  margin: 0;
  color: #333;
  font-size: 32px;
}

.actions {
  display: flex;
  gap: 10px;
}

.primary-btn, .edit-btn, .delete-btn, .secondary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.primary-btn {
  background-color: #3C4B3A;
  color: white;
}

.edit-btn {
  background-color: #A9C6C3;
  color: #333;
}

.delete-btn {
  background-color: #d32f2f;
  color: white;
}

.secondary-btn {
  background-color: #e0e0e0;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 30px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.empty-state p {
  font-size: 16px;
  color: #333;
}

.empty-state button {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #3C4B3A;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.recipe-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.recipe-card:hover {
  transform: translateY(-5px);
}

.recipe-image {
  position: relative;
  height: 150px;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.remove-btn:hover {
  background-color: white;
}

.recipe-info {
  padding: 16px;
}

.recipe-info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #333;
}

.recipe-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Estilos para modales */
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
  color: #333;
}

.delete-modal {
  max-width: 400px;
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
  color: #666;
}

/* Input fields with better contrast */
input[type="text"],
select,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333 !important;
  background-color: #fff !important;
}

.modal-body input {
  color: #333 !important;
  background-color: #fff !important;
  border: 1px solid #ccc;
}

.modal-body p {
  margin: 0 0 16px;
}

.modal-body .warning {
  color: #d32f2f;
  font-weight: 500;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.recipe-list {
  max-height: 300px;
  overflow-y: auto;
}

.recipe-list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.recipe-list-item:hover {
  background-color: #f5f5f5;
}

.recipe-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
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

.modal-body {
  margin-bottom: 20px;
}

.modal-body p {
  margin: 0 0 16px;
  color: #333;
}

.modal-body .warning {
  color: #d32f2f;
  font-weight: 500;
}
</style> 