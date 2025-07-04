<template>
  <div class="recipe-create">
    <HeaderBar/>
    <BreadcrumbNavigation :items="breadcrumbItems" />
    
    <div class="recipe-form-container">
      <div class="white-card">
        <div class="recipe-type-selector">
          <button 
            :class="['type-button', { active: recipeType === 'extraction' }]" 
            @click="recipeType = 'extraction'"
          >
            {{ $t('recipes.coffeeExtraction') }}
          </button>
          <button 
            :class="['type-button', { active: recipeType === 'espresso' }]" 
            @click="recipeType = 'espresso'"
          >
            {{ $t('recipes.espressoMethod') }}
          </button>
        </div>
        
        <div class="recipe-form">
          <div class="form-row">
            <div class="form-section">
              <label for="recipeName">{{ $t('recipes.name') }}</label>
              <input 
                id="recipeName"
                type="text"
                v-model="newRecipe.name"
                :placeholder="$t('recipes.namePlaceholder')"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-section" v-if="recipeType === 'extraction'">
              <label for="extractionMethod">{{ $t('recipes.extractionMethod') }}</label>
              <select id="extractionMethod" v-model="newRecipe.extractionMethod">
                <option value="french-press">French Press</option>
                <option value="cold-brew">Cold Brew</option>
                <option value="pour-over">Pour Over</option>
                <option value="aeropress">Aeropress</option>
                <option value="chemex">Chemex</option>
              </select>
            </div>
            
            <div class="form-section" v-if="recipeType === 'espresso'">
              <label for="grindSize">{{ $t('recipes.grindSize') }}</label>
              <select id="grindSize" v-model="newRecipe.grindSize">
                <option value="fino">{{ $t('recipes.grindFine') }}</option>
                <option value="medio">{{ $t('recipes.grindMedium') }}</option>
                <option value="grueso">{{ $t('recipes.grindCoarse') }}</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-section">
              <label for="ratio">{{ $t('recipes.ratio') }}</label>
              <select id="ratio" v-model="newRecipe.ratio">
                <template v-if="recipeType === 'extraction'">
                  <option value="1:12">1:12</option>
                  <option value="1:14">1:14</option>
                  <option value="1:16">1:16</option>
                  <option value="1:18">1:18</option>
                </template>
                <template v-else>
                  <option value="1:1">1:1</option>
                  <option value="1:2">1:2</option>
                  <option value="1:3">1:3</option>
                  <option value="1:4">1:4</option>
                </template>
              </select>
            </div>
          </div>
          
          <div class="form-row two-columns">
            <div class="form-section">
              <label for="cuppingSession">{{ $t('recipes.cuppingSession') }}</label>
              <select id="cuppingSession" v-model="newRecipe.cuppingSessionId">
                <option value="">{{ $t('recipes.selectCupping') }}</option>
                <option 
                  v-for="session in cuppingSessions" 
                  :key="session.id" 
                  :value="session.id"
                >
                  {{ session.name }}
                </option>
              </select>
            </div>
            
            <div class="form-section">
              <label for="portfolio">{{ $t('recipes.portfolio') }}</label>
              <select id="portfolio" v-model="newRecipe.portfolioId">
                <option value="">{{ $t('recipes.noPortfolio') }}</option>
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
          
          <div class="form-row">
            <div class="form-section">
              <div class="section-header">
                <label>{{ $t('recipes.ingredients') }}</label>
                <button 
                  v-if="recipeType === 'espresso'" 
                  type="button" 
                  class="add-btn" 
                  @click="addIngredient"
                >
                  <i class="pi pi-plus"></i>
                  {{ $t('recipes.addIngredient') }}
                </button>
              </div>
              
              <div 
                v-for="(ingredient, index) in newRecipe.ingredients" 
                :key="index"
                class="ingredient-row"
              >
                <input 
                  type="text"
                  v-model="ingredient.name"
                  :placeholder="$t('recipes.ingredientName')"
                  class="ingredient-name-input"
                  :disabled="recipeType === 'extraction'"
                />
                <input 
                  type="number"
                  v-model="ingredient.amount"
                  :placeholder="$t('recipes.quantity')"
                  class="ingredient-amount-input"
                />
                <select v-model="ingredient.unit" class="ingredient-unit-select">
                  <option value="gr">gr</option>
                  <option value="ml">ml</option>
                  <option value="oz">oz</option>
                  <option value="unidad">{{ $t('recipes.unitPiece') }}</option>
                </select>
                <button 
                  v-if="recipeType === 'espresso'"
                  type="button" 
                  class="remove-btn" 
                  @click="removeIngredient(index)"
                >
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-section">
              <label for="preparationTime">{{ $t('recipes.preparationTime') }}</label>
              <div class="time-input-group">
                <input 
                  id="preparationTime"
                  type="number"
                  v-model="newRecipe.preparationTime"
                  placeholder="20"
                />
                <span class="time-unit">{{ $t('recipes.minutes') }}</span>
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <label for="recipeImage">{{ $t('recipes.image') }}</label>
            <div class="image-upload-container">
              <img 
                :src="newRecipe.imageUrl || 'https://via.placeholder.com/300x200?text=Café'"
                alt="Preview"
                class="image-preview"
              />
              <input 
                id="recipeImage"
                type="text"
                v-model="newRecipe.imageUrl"
                :placeholder="$t('recipes.imageUrlPlaceholder')"
                class="image-url-input"
              />
            </div>
          </div>
          
          <div class="recipe-sections-container">
            <div class="form-section">
              <label for="preparationSteps">{{ $t('recipes.preparationSteps') }}</label>
              <textarea
                id="preparationSteps"
                v-model="newRecipe.steps"
                :placeholder="$t('recipes.stepsPlaceholder')"
                rows="8"
              ></textarea>
            </div>
            
            <div class="form-section">
              <label for="tips">{{ $t('recipes.tips') }}</label>
              <textarea
                id="tips"
                v-model="newRecipe.tips"
                :placeholder="$t('recipes.tipsPlaceholder')"
                rows="8"
              ></textarea>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="cancel">
              {{ $t('common.cancel') }}
            </button>
            <button type="button" class="save-btn" @click="saveRecipe">
              {{ isEditing ? $t('common.save') : $t('recipes.addRecipe') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthService } from '../../auth/services/authService.js';
import BreadcrumbNavigation from '../../shared/components/BreadcrumbNavigation.component.vue';
import { RecipeService } from '../services/recipe.service';
import { PortfolioService } from '../services/portfolio.service';
import { getCuppingSessions } from '../../sensory-evaluation/services/cuppingService.js';
import HeaderBar from "../../public/components/headerBar.vue";

const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const auth = useAuthService();

// Servicios
const recipeService = new RecipeService();
const portfolioService = new PortfolioService();

// Estados
const recipeType = ref('extraction');
const isEditing = ref(false);
const cuppingSessions = ref([]);
const newRecipe = ref({
  id: '',
  name: '',
  type: 'extraction',
  imageUrl: '',
  preparationTime: '',
  extractionMethod: 'french-press',
  grindSize: null,
  ratio: '',
  cuppingSessionId: '',
  cupping: '',
  portfolioId: '',
  steps: '',
  tips: '',
  ingredients: []
});

// Estados computados
const isLoading = computed(() => recipeService.getIsLoading().value);
const error = computed(() => recipeService.getError().value);
const portfolios = computed(() => portfolioService.getPortfolios().value);

// Datos para el breadcrumb
const breadcrumbItems = computed(() => [
  { label: 'Inicio', path: '/dashboard' },
  { label: 'Recetas', path: '/recetas' },
  { label: isEditing.value ? 'Editar Receta' : 'Nueva Receta', path: '#' }
]);

// Observar cambios en el tipo de receta
watch(recipeType, (newType) => {
  // Actualizar tipo y campos específicos
  newRecipe.value.type = newType;
  
  if (newType === 'extraction') {
    // Para extracción de café
    newRecipe.value.extractionMethod = 'french-press';
    newRecipe.value.grindSize = null;
    newRecipe.value.ingredients = [
      { name: 'Café', amount: '', unit: 'gr' },
      { name: 'Agua', amount: '', unit: 'ml' }
    ];
  } else {
    // Para método espresso
    newRecipe.value.extractionMethod = 'espresso';
    newRecipe.value.grindSize = 'fino';
    newRecipe.value.ingredients = [];
  }
  
  // Reiniciar ratio según el tipo
  newRecipe.value.ratio = '';
});

// Observar cambios en la selección de cupping para actualizar el nombre
watch(() => newRecipe.value.cuppingSessionId, (newCuppingId) => {
  if (newCuppingId) {
    const selectedSession = cuppingSessions.value.find(session => session.id == newCuppingId);
    if (selectedSession) {
      newRecipe.value.cupping = selectedSession.name;
    }
  } else {
    newRecipe.value.cupping = '';
  }
});

// Método para añadir ingrediente (solo disponible para espresso)
const addIngredient = () => {
  if (recipeType.value === 'espresso') {
    newRecipe.value.ingredients.push({
      name: '',
      amount: '',
      unit: ''
    });
  }
};

// Método para eliminar ingrediente (solo disponible para espresso)
const removeIngredient = (index) => {
  if (recipeType.value === 'espresso') {
    newRecipe.value.ingredients.splice(index, 1);
  }
};

// Cargar datos iniciales
const loadData = async () => {
  try {
    // Cargar portafolios
    await portfolioService.getAllPortfolios();
    
    // Cargar sesiones de cupping
    console.log('Cargando sesiones de cupping...');
    const sessions = await getCuppingSessions();
    console.log('Sesiones de cupping cargadas:', sessions);
    cuppingSessions.value = sessions;
    
    // Si estamos en modo edición, cargar la receta
    if (route.params.id) {
      isEditing.value = true;
      try {
        const recipe = await recipeService.getRecipeById(route.params.id);
        newRecipe.value = {
          ...recipe,
          ingredients: recipe.ingredients || []
        };
        recipeType.value = recipe.type || 'extraction';
      } catch (error) {
        console.error('Error al cargar la receta:', error);
      }
    } else {
      // Si es una nueva receta, inicializar los ingredientes para extracción
      newRecipe.value.ingredients = [
        { name: 'Café', amount: '', unit: 'gr' },
        { name: 'Agua', amount: '', unit: 'ml' }
      ];
    }
  } catch (error) {
    console.error('Error al cargar datos:', error);
    // Si hay error al cargar sesiones de cupping, inicializar como array vacío
    cuppingSessions.value = [];
  }
};

// Cargar datos al montar el componente
onMounted(() => {
  loadData();
});

const saveRecipe = async () => {
  try {
    const recipeData = {
      ...newRecipe.value,
      type: recipeType.value,
      userId: auth.getCurrentUserId(),
      cuppingSessionId: newRecipe.value.cuppingSessionId ? Number(newRecipe.value.cuppingSessionId) : null
    };
    
    if (isEditing.value) {
      await recipeService.updateRecipe(recipeData.id, recipeData);
    } else {
      await recipeService.createRecipe(recipeData);
    }
    
    router.push('/recetas');
  } catch (error) {
    console.error('Error al guardar la receta:', error);
  }
};

const cancel = () => {
  router.push('/recetas');
};
</script>

<style scoped>
.recipe-create {
  min-height: calc(100vh - 70px);
  background-color: #F8F7F2;
  padding: 2rem;
  margin-top: 70px;
}

.recipe-form-container {
  background-color: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.white-card {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  color: #333; /* Asegurar que todo el texto sea oscuro */
}

.recipe-type-selector {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.type-button {
  padding: 8px 16px;
  border: none;
  border-radius: 20px;
  background-color: #f1f1f1;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: #333;
}

.type-button.active {
  background-color: #3C4B3A;
  color: white;
}

.recipe-form {
  max-width: 900px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;
}

.form-row.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.form-section {
  flex: 1;
  margin-bottom: 20px;
}

.form-section label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-section input, 
.form-section select, 
.form-section textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff !important;
  color: #333 !important;
}

.form-section textarea {
  resize: vertical;
  min-height: 120px;
  color: #333 !important;
  background-color: #fff !important;
}

.ingredient-section {
  flex: 0.5;
}

.ingredient-input-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.quantity-input {
  flex: 1;
}

.unit-select {
  width: 80px !important;
}

.ingredient-select {
  flex: 2;
}

.time-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-unit {
  font-size: 14px;
  color: #666;
}

.image-upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.image-preview {
  width: 100%;
  max-width: 300px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.image-url-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: #F8F7F2;
  color: #333 !important;
}

.recipe-sections-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 40px;
}

.save-btn, .cancel-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  min-width: 150px;
}

.save-btn {
  background-color: #3C4B3A;
  color: white;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

@media (max-width: 768px) {
  .form-row.two-columns {
    grid-template-columns: 1fr;
  }
  
  .recipe-sections-container {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
}

.modal-container {
  background-color: white;
  color: #333;
}

.modal-body label {
  color: #333;
}

.modal-body input {
  color: #333;
}

.ingredient-name {
  color: #333;
}

.ingredient-type, .ingredient-amount, .step-description {
  color: #333;
}

.modal-header h2 {
  color: #333;
}

.ingredient-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.ingredient-name-input {
  flex: 2;
}

.ingredient-amount-input {
  flex: 1;
  min-width: 80px;
}

.ingredient-unit-select {
  width: 100px !important;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: #3C4B3A;
  color: white;
  cursor: pointer;
  font-size: 14px;
}

.add-btn:hover {
  background-color: #2a362a;
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  background-color: #f44336;
  color: white;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
}

.remove-btn:hover {
  background-color: #d32f2f;
}
</style> 