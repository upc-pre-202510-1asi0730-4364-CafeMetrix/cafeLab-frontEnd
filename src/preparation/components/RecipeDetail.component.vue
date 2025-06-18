<template>
  <div class="recipe-detail">
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
      <div class="recipe-header">
        <div class="recipe-title">
          <h1>{{ recipe?.name }}</h1>
          <span v-if="recipe?.portfolioId" class="portfolio-badge" @click="navigateToPortfolio(recipe.portfolioId)">
            {{ portfolioName }}
          </span>
        </div>
        <div class="actions">
          <button class="edit-btn" @click="enableEditMode">
            <i class="pi pi-pencil"></i>
            {{ $t('common.edit') }}
          </button>
          <button class="delete-btn" @click="confirmDelete">
            <i class="pi pi-trash"></i>
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
      
      <!-- Vista de lectura -->
      <div v-if="!editMode" class="recipe-view">
        <div class="recipe-image-container">
          <img :src="recipe?.image" :alt="recipe?.name" class="recipe-image" />
          <div class="recipe-meta">
            <p v-if="recipe?.preparationTime">
              <i class="pi pi-clock"></i>
              <span>{{ recipe.preparationTime }} min</span>
            </p>
            <p v-if="recipe?.type">
              <i class="pi pi-tag"></i>
              <span>{{ recipe.type === 'extraction' ? 'Extracción de café' : 'Método de Espresso' }}</span>
            </p>
            <p v-if="recipe?.lotId">
              <i class="pi pi-box"></i>
              <span>Lote: {{ recipe.lotId }}</span>
            </p>
            <p v-if="recipe?.roastProfileId">
              <i class="pi pi-chart-line"></i>
              <span>Perfil de tueste: {{ recipe.roastProfileId }}</span>
            </p>
            <p v-if="recipe?.extractionMethod && recipe.type === 'extraction'">
              <i class="pi pi-sliders-h"></i>
              <span>Método: {{ recipe.extractionMethod }}</span>
            </p>
            <p v-if="recipe?.grindSize && recipe.type === 'espresso'">
              <i class="pi pi-sliders-h"></i>
              <span>Molienda: {{ recipe.grindSize }}</span>
            </p>
            <p v-if="recipe?.ratio">
              <i class="pi pi-percentage"></i>
              <span>Ratio: {{ recipe.ratio }}</span>
            </p>
            <p v-if="recipe?.cuppingSessionId">
              <i class="pi pi-star"></i>
              <span>Sesión de cata: {{ recipe.cuppingSessionId }}</span>
            </p>
          </div>
        </div>
        
        <div class="recipe-content">
          <div class="ingredients-section">
            <h2>{{ $t('recipes.ingredients') }}</h2>
            <ul class="ingredients-list">
              <li v-for="(ingredient, index) in recipe?.ingredients" :key="index">
                <span class="ingredient-quantity">{{ ingredient.quantity }} {{ ingredient.unit }}</span>
                <span class="ingredient-name">{{ ingredient.name }}</span>
              </li>
            </ul>
          </div>
          
          <div class="steps-section">
            <h2>{{ $t('recipes.preparation') }}</h2>
            <ol class="steps-list">
              <li v-for="(step, index) in recipe?.steps" :key="index">
                {{ step }}
              </li>
            </ol>
          </div>
          
          <div v-if="recipe?.tips" class="tips-section">
            <h2>{{ $t('recipes.tips') || 'Consejos' }}</h2>
            <div class="tips-content">
              {{ recipe.tips }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- Formulario de edición -->
      <div v-else class="recipe-edit-form">
        <div class="form-section">
          <label for="recipeName">{{ $t('recipes.name') }}</label>
          <input 
            id="recipeName"
            type="text"
            v-model="editedRecipe.name"
            :placeholder="$t('recipes.namePlaceholder')"
          />
        </div>
        
        <div class="form-section">
          <label for="recipeImage">{{ $t('recipes.imageUrl') }}</label>
          <input 
            id="recipeImage"
            type="text"
            v-model="editedRecipe.image"
            :placeholder="$t('recipes.imageUrlPlaceholder')"
          />
        </div>
        
        <div class="form-row two-columns">
          <div class="form-section">
            <label for="recipeType">{{ $t('recipes.type') || 'Tipo de receta' }}</label>
            <select id="recipeType" v-model="editedRecipe.type">
              <option value="extraction">Extracción de café</option>
              <option value="espresso">Método de Espresso</option>
            </select>
          </div>
          
          <div class="form-section">
            <label for="recipeTime">{{ $t('recipes.preparationTime') }}</label>
            <input 
              id="recipeTime"
              type="text"
              v-model="editedRecipe.preparationTime"
              :placeholder="$t('recipes.preparationTimePlaceholder')"
            />
          </div>
        </div>
        
        <div class="form-row two-columns">
          <div class="form-section">
            <label for="lotSelector">{{ $t('recipes.lot') || 'Lote Vinculado' }}</label>
            <input 
              id="lotSelector"
              type="text"
              v-model="editedRecipe.lotId"
              placeholder="Identificador del lote"
            />
          </div>
          
          <div class="form-section">
            <label for="roastProfile">{{ $t('recipes.roastProfile') || 'Perfil de Tueste' }}</label>
            <input 
              id="roastProfile"
              type="text"
              v-model="editedRecipe.roastProfileId"
              placeholder="Identificador del perfil"
            />
          </div>
        </div>
        
        <div class="form-row two-columns">
          <div class="form-section" v-if="editedRecipe.type === 'extraction'">
            <label for="extractionMethod">{{ $t('recipes.extractionMethod') || 'Método de extracción' }}</label>
            <select id="extractionMethod" v-model="editedRecipe.extractionMethod">
              <option value="french-press">French Press</option>
              <option value="cold-brew">Cold Brew</option>
              <option value="pour-over">Pour Over</option>
              <option value="aeropress">Aeropress</option>
              <option value="chemex">Chemex</option>
            </select>
          </div>
          
          <div class="form-section" v-if="editedRecipe.type === 'espresso'">
            <label for="grindSize">{{ $t('recipes.grindSize') || 'Molienda' }}</label>
            <select id="grindSize" v-model="editedRecipe.grindSize">
              <option value="fino">Fino</option>
              <option value="medio">Medio</option>
              <option value="grueso">Grueso</option>
            </select>
          </div>
          
          <div class="form-section">
            <label for="ratio">{{ $t('recipes.ratio') || 'Ratio' }}</label>
            <input 
              id="ratio"
              type="text"
              v-model="editedRecipe.ratio"
              placeholder="1:12"
            />
          </div>
        </div>
        
        <div class="form-section">
          <label for="cuppingSession">{{ $t('recipes.cuppingSession') || 'Sesión de Cata' }}</label>
          <input 
            id="cuppingSession"
            type="text"
            v-model="editedRecipe.cuppingSessionId"
            placeholder="Identificador de la sesión"
          />
        </div>
        
        <div class="form-section">
          <label>{{ $t('recipes.portfolio') }}</label>
          <div class="portfolio-selector">
            <select v-model="editedRecipe.portfolioId">
              <option :value="null">{{ $t('recipes.noPortfolio') }}</option>
              <option 
                v-for="portfolio in portfolios" 
                :key="portfolio.id" 
                :value="portfolio.id"
              >
                {{ portfolio.name }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-section">
          <div class="section-header">
            <label>{{ $t('recipes.ingredients') }}</label>
            <button type="button" class="add-btn" @click="addIngredient">
              <i class="pi pi-plus"></i>
              {{ $t('recipes.addIngredient') }}
            </button>
          </div>
          
          <div 
            v-for="(ingredient, index) in editedRecipe.ingredients" 
            :key="`ingredient-${index}`"
            class="ingredient-row"
          >
            <input 
              type="text"
              v-model="ingredient.quantity"
              :placeholder="$t('recipes.quantity')"
              class="quantity-input"
            />
            <input 
              type="text"
              v-model="ingredient.unit"
              :placeholder="$t('recipes.unit')"
              class="unit-input"
            />
            <input 
              type="text"
              v-model="ingredient.name"
              :placeholder="$t('recipes.ingredientName')"
              class="name-input"
            />
            <button type="button" class="remove-btn" @click="removeIngredient(index)">
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
        
        <div class="form-section">
          <div class="section-header">
            <label>{{ $t('recipes.preparation') }}</label>
            <button type="button" class="add-btn" @click="addStep">
              <i class="pi pi-plus"></i>
              {{ $t('recipes.addStep') }}
            </button>
          </div>
          
          <div 
            v-for="(step, index) in editedRecipe.steps" 
            :key="`step-${index}`"
            class="step-row"
          >
            <span class="step-number">{{ index + 1 }}</span>
            <textarea 
              v-model="editedRecipe.steps[index]"
              :placeholder="$t('recipes.stepDescription')"
            ></textarea>
            <button type="button" class="remove-btn" @click="removeStep(index)">
              <i class="pi pi-times"></i>
            </button>
          </div>
        </div>
        
        <div class="form-section">
          <label for="tips">{{ $t('recipes.tips') || 'Consejos' }}</label>
          <textarea 
            id="tips"
            v-model="editedRecipe.tips"
            :placeholder="$t('recipes.tipsPlaceholder') || 'Escribe consejos útiles para esta receta...'"
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="cancelEdit">
            {{ $t('common.cancel') }}
          </button>
          <button type="button" class="save-btn" @click="saveRecipe">
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmación de eliminación -->
    <div v-if="showDeleteConfirmation" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>{{ $t('common.confirmDelete') }}</h2>
          <button class="close-btn" @click="showDeleteConfirmation = false">
            <i class="pi pi-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="confirmation-content">
            <i class="pi pi-exclamation-triangle" style="font-size: 2rem; color: #d32f2f;"></i>
            <p class="confirmation-message">{{ $t('recipes.deleteRecipeConfirmation') }}</p>
          </div>
          <p class="warning">{{ $t('common.thisCannotBeUndone') }}</p>
        </div>

        <div class="modal-footer">
          <button class="secondary-btn" @click="showDeleteConfirmation = false">
            {{ $t('common.cancel') }}
          </button>
          <button class="delete-btn" @click="deleteRecipe">
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BreadcrumbNavigation from '../../shared/components/BreadcrumbNavigation.component.vue';
import { RecipeManager } from '../stores/recipeManager';
import { PortfolioManager } from '../stores/portfolioManager';
import HeaderBar from "../../public/components/headerBar.vue";
const router = useRouter();
const route = useRoute();

// Estados
const editMode = ref(false);
const showDeleteConfirmation = ref(false);
const editedRecipe = ref({
  name: '',
  image: '',
  preparationTime: '',
  portfolioId: null,
  ingredients: [],
  steps: []
});

// Obtener el ID de la receta de la ruta
const recipeId = computed(() => parseInt(route.params.id));

// Estados computados
const recipe = computed(() => RecipeManager.getCurrentRecipe());
const isLoading = computed(() => RecipeManager.getIsLoading());
const error = computed(() => RecipeManager.getError());
const portfolios = computed(() => PortfolioManager.getPortfolios());
const portfolioName = computed(() => {
  if (!recipe.value?.portfolioId) return '';
  const portfolio = portfolios.value.find(p => p.id === recipe.value.portfolioId);
  return portfolio ? portfolio.name : '';
});

// Datos para el breadcrumb
const breadcrumbItems = computed(() => [
  { label: 'Inicio', path: '/dashboard' },
  { label: 'Recetas', path: '/recetas' },
  { label: recipe.value?.name || 'Receta', path: `/recetas/detalle/${recipeId.value}` }
]);

// Cargar datos
const loadData = async () => {
  if (recipeId.value) {
    await RecipeManager.fetchRecipeById(recipeId.value);
    await PortfolioManager.fetchPortfolios();
    
    if (recipe.value) {
      // Clonar para evitar modificar directamente el estado
      editedRecipe.value = JSON.parse(JSON.stringify({
        name: recipe.value.name,
        image: recipe.value.image,
        preparationTime: recipe.value.preparationTime,
        portfolioId: recipe.value.portfolioId,
        ingredients: recipe.value.ingredients || [],
        steps: recipe.value.steps || [],
        type: recipe.value.type || 'extraction',
        lotId: recipe.value.lotId || '',
        roastProfileId: recipe.value.roastProfileId || '',
        extractionMethod: recipe.value.extractionMethod || 'french-press',
        grindSize: recipe.value.grindSize || 'fino',
        ratio: recipe.value.ratio || '',
        cuppingSessionId: recipe.value.cuppingSessionId || '',
        tips: recipe.value.tips || ''
      }));
    }
  }
};

// Navegación a detalles de portafolio
const navigateToPortfolio = (portfolioId) => {
  router.push(`/recetas/portfolio/${portfolioId}`);
};

// Habilitar modo de edición
const enableEditMode = () => {
  editMode.value = true;
};

// Cancelar edición
const cancelEdit = () => {
  loadData(); // Recargar datos originales
  editMode.value = false;
};

// Guardar receta
const saveRecipe = async () => {
  try {
    await RecipeManager.updateRecipe(recipeId.value, editedRecipe.value);
    editMode.value = false;
  } catch (error) {
    console.error('Error al guardar la receta:', error);
  }
};

// Confirmar eliminación
const confirmDelete = () => {
  showDeleteConfirmation.value = true;
};

// Eliminar receta
const deleteRecipe = async () => {
  try {
    await RecipeManager.deleteRecipe(recipeId.value);
    // Cerrar el diálogo primero
    showDeleteConfirmation.value = false;
    
    // Pequeño retraso para asegurar que el diálogo se cierra visualmente antes de redirigir
    setTimeout(() => {
      router.push('/recetas');
    }, 100);
  } catch (error) {
    console.error('Error al eliminar la receta:', error);
    showDeleteConfirmation.value = false;
  }
};

// Añadir ingrediente
const addIngredient = () => {
  editedRecipe.value.ingredients.push({ 
    name: '', 
    quantity: '', 
    unit: '' 
  });
};

// Eliminar ingrediente
const removeIngredient = (index) => {
  editedRecipe.value.ingredients.splice(index, 1);
};

// Añadir paso
const addStep = () => {
  editedRecipe.value.steps.push('');
};

// Eliminar paso
const removeStep = (index) => {
  editedRecipe.value.steps.splice(index, 1);
};

// Cargar datos al montar el componente
onMounted(() => {
  loadData();
});
</script>

<style scoped>
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

.recipe-detail {
  padding: 20px;
  padding-top: 100px;
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

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;
}

.recipe-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.recipe-title h1 {
  margin: 0;
  color: #333;
  font-size: 32px;
}

.portfolio-badge {
  background-color: #A9C6C3;
  color: #333;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
}

.portfolio-badge:hover {
  background-color: #8db1ad;
}

.actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn, .add-btn, .remove-btn, .save-btn, .cancel-btn, .secondary-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn {
  background-color: #A9C6C3;
  color: #333;
}

.delete-btn {
  background-color: #d32f2f;
  color: white;
}

.add-btn {
  background-color: #3C4B3A;
  color: white;
  padding: 4px 12px;
  font-size: 12px;
}

.remove-btn {
  background-color: #f44336;
  color: white;
  padding: 4px;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.save-btn {
  background-color: #3C4B3A;
  color: white;
}

.cancel-btn, .secondary-btn {
  background-color: #e0e0e0;
  color: #333;
}

/* Vista de lectura */
.recipe-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

@media (max-width: 768px) {
  .recipe-view {
    grid-template-columns: 1fr;
  }
}

.recipe-image-container {
  position: relative;
}

.recipe-image {
  width: 100%;
  border-radius: 12px;
  object-fit: cover;
  aspect-ratio: 4/3;
}

.recipe-meta {
  margin-top: 16px;
}

.recipe-meta p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  margin-bottom: 8px;
  color: #333;
  font-weight: 400;
}

.recipe-meta i {
  color: #3C4B3A;
  font-size: 16px;
}

.ingredients-section, .steps-section, .tips-section {
  margin-bottom: 30px;
}

.ingredients-section h2, .steps-section h2, .tips-section h2 {
  color: #333;
  margin-bottom: 16px;
  font-size: 24px;
}

.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredients-list li {
  display: flex;
  align-items: baseline;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.ingredient-quantity {
  color: #333;
  margin-right: 12px;
  min-width: 80px;
}

.ingredient-name {
  color: #333;
}

.steps-list {
  padding-left: 20px;
}

.steps-list li {
  margin-bottom: 16px;
  line-height: 1.6;
  color: #333;
}

.tips-content {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #3C4B3A;
  color: #333;
  line-height: 1.6;
}

/* Formulario de edición */
.recipe-edit-form {
  margin-top: 30px;
}

.form-section {
  margin-bottom: 24px;
}

.form-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-section input, .form-section select, .form-section textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: #F8F7F2;
}

.form-section textarea {
  min-height: 100px;
  resize: vertical;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.ingredient-row, .step-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.quantity-input {
  width: 80px !important;
}

.unit-input {
  width: 80px !important;
}

.name-input {
  flex: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3C4B3A;
  color: white;
  border-radius: 50%;
  font-size: 14px;
}

.step-row textarea {
  flex: 1;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 40px;
}

/* Modal */
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

.modal-body p {
  margin: 0 0 16px;
  color: #333;
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
</style> 