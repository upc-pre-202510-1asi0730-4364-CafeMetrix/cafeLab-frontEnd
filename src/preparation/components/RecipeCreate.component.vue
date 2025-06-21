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
            Extracción de café
          </button>
          <button 
            :class="['type-button', { active: recipeType === 'espresso' }]" 
            @click="recipeType = 'espresso'"
          >
            Método de Espresso
          </button>
        </div>
        
        <div class="recipe-form">
          <div class="form-row">
            <div class="form-section">
              <label for="recipeName">Nombre de Receta</label>
              <input 
                id="recipeName"
                type="text"
                v-model="newRecipe.name"
                placeholder="Latte"
              />
            </div>
          </div>
          
          <div class="form-row two-columns">
            <div class="form-section">
              <label for="lotSelector">Lote Vinculado</label>
              <select id="lotSelector" v-model="newRecipe.lotId">
                <option value="">Lote ABC</option>
                <option value="lote-b">Lote B</option>
                <option value="lote-c">Lote C</option>
              </select>
            </div>
            
            <div class="form-section" v-if="recipeType === 'extraction'">
              <label for="extractionMethod">Método de extracción (French press, Cold Brew, etc.)</label>
              <select id="extractionMethod" v-model="newRecipe.extractionMethod">
                <option value="french-press">French Press</option>
                <option value="cold-brew">Cold Brew</option>
                <option value="pour-over">Pour Over</option>
                <option value="aeropress">Aeropress</option>
                <option value="chemex">Chemex</option>
              </select>
            </div>
            
            <div class="form-section" v-if="recipeType === 'espresso'">
              <label for="grindSize">Molienda (muy fino, medio, etc.)</label>
              <select id="grindSize" v-model="newRecipe.grindSize">
                <option value="fino">Fino</option>
                <option value="medio">Medio</option>
                <option value="grueso">Grueso</option>
              </select>
            </div>
          </div>
          
          <div class="form-row two-columns">
            <div class="form-section">
              <label for="roastProfile">Tueste Vinculado</label>
              <select id="roastProfile" v-model="newRecipe.roastProfileId">
                <option value="perfil-a">Perfil Cafe A</option>
                <option value="perfil-f">Perfil Cafe F</option>
              </select>
            </div>
            
            <div class="form-section" v-if="recipeType === 'extraction'">
              <label for="ratio">Ratio (1:12, 1:14, etc.)</label>
              <select id="ratio" v-model="newRecipe.ratio">
                <option value="1:12">1:12</option>
                <option value="1:14">1:14</option>
                <option value="1:16">1:16</option>
                <option value="1:18">1:18</option>
              </select>
            </div>
            
            <div class="form-section" v-if="recipeType === 'espresso'">
              <label for="ratioEspresso">Ratio (1:12, 1:14, etc.)</label>
              <select id="ratioEspresso" v-model="newRecipe.ratio">
                <option value="1:1">1:1</option>
                <option value="1:2">1:2</option>
                <option value="1:3">1:3</option>
                <option value="1:4">1:4</option>
              </select>
            </div>
          </div>
          
          <div class="form-row two-columns">
            <div class="form-section">
              <label for="cuppingSession">Cata Vinculada</label>
              <select id="cuppingSession" v-model="newRecipe.cuppingSessionId">
                <option value="">Selecciona una cata</option>
                <option value="sesion-x">Sesión Cata X</option>
                <option value="sesion-z">Sesión Cata Z</option>
              </select>
            </div>
            
            <div class="form-section">
              <label for="portfolio">Portafolio</label>
              <select id="portfolio" v-model="newRecipe.portfolioId">
                <option value="">Sin portafolio</option>
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
          
          <div class="form-row" v-if="recipeType === 'extraction'">
            <div class="form-section ingredient-section">
              <label>Agua</label>
              <div class="ingredient-input-group">
                <input 
                  type="number"
                  v-model="newRecipe.waterAmount"
                  placeholder="250"
                  class="quantity-input"
                />
                <select v-model="newRecipe.waterUnit" class="unit-select">
                  <option value="ml">ml</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            </div>
            
            <div class="form-section ingredient-section">
              <label>Café</label>
              <div class="ingredient-input-group">
                <input 
                  type="number"
                  v-model="newRecipe.coffeeAmount"
                  placeholder="20"
                  class="quantity-input"
                />
                <select v-model="newRecipe.coffeeUnit" class="unit-select">
                  <option value="gr">gr</option>
                  <option value="oz">oz</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="form-row" v-if="recipeType === 'espresso'">
            <div class="form-section ingredient-section">
              <label>Ingrediente</label>
              <div class="ingredient-input-group">
                <select v-model="newRecipe.ingredientType" class="ingredient-select">
                  <option value="leche-entera">Leche Entera</option>
                  <option value="leche-descremada">Leche Descremada</option>
                  <option value="leche-almendra">Leche de Almendra</option>
                </select>
                <input 
                  type="number"
                  v-model="newRecipe.ingredientAmount"
                  placeholder="14"
                  class="quantity-input"
                />
                <select v-model="newRecipe.ingredientUnit" class="unit-select">
                  <option value="gr">gr</option>
                  <option value="oz">oz</option>
                  <option value="ml">ml</option>
                </select>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-section">
              <label for="preparationTime">Tiempo</label>
              <div class="time-input-group">
                <input 
                  id="preparationTime"
                  type="number"
                  v-model="newRecipe.preparationTime"
                  placeholder="20"
                />
                <span class="time-unit">min</span>
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <label for="recipeImage">Imagen</label>
            <div class="image-upload-container">
              <img 
                :src="newRecipe.image || 'https://via.placeholder.com/300x200?text=Café'"
                alt="Preview"
                class="image-preview"
              />
              <input 
                id="recipeImage"
                type="text"
                v-model="newRecipe.image"
                placeholder="URL de la imagen"
                class="image-url-input"
              />
            </div>
          </div>
          
          <div class="recipe-sections-container">
            <div class="form-section">
              <label for="preparationSteps">Pasos de preparación</label>
              <textarea
                id="preparationSteps"
                v-model="newRecipe.steps"
                placeholder="1. Calentar agua a 90°C&#10;2. Moler café a ajuste medio&#10;3. Añadir café molido al filtro&#10;4. Verter agua lentamente en forma circular"
                rows="8"
              ></textarea>
            </div>
            
            <div class="form-section">
              <label for="tips">Consejos</label>
              <textarea
                id="tips"
                v-model="newRecipe.tips"
                placeholder="- Utilizar agua filtrada mejora el sabor&#10;- La temperatura ideal está entre 90°C y 95°C&#10;- Dejar reposar por 30 segundos después del bloom"
                rows="8"
              ></textarea>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="cancel-btn" @click="cancel">
              Cancelar
            </button>
            <button type="button" class="save-btn" @click="saveRecipe">
              Agregar receta
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import BreadcrumbNavigation from '../../shared/components/BreadcrumbNavigation.component.vue';
import { RecipeService } from '../services/recipe.service';
import { PortfolioService } from '../services/portfolio.service';
import HeaderBar from "../../public/components/headerBar.vue";

const router = useRouter();

// Servicios
const recipeService = new RecipeService();
const portfolioService = new PortfolioService();

// Estados
const recipeType = ref('extraction');
const newRecipe = ref({
  name: '',
  type: 'extraction',
  image: '',
  preparationTime: '',
  lotId: '',
  roastProfileId: '',
  extractionMethod: 'french-press',
  grindSize: 'fino',
  ratio: '',
  cuppingSessionId: '',
  portfolioId: '',
  waterAmount: '',
  waterUnit: 'ml',
  coffeeAmount: '',
  coffeeUnit: 'gr',
  ingredientType: '',
  ingredientAmount: '',
  ingredientUnit: 'ml',
  steps: [],
  tips: ''
});

// Estados computados
const isLoading = computed(() => recipeService.getIsLoading().value);
const error = computed(() => recipeService.getError().value);
const portfolios = computed(() => portfolioService.getPortfolios().value);

// Datos para el breadcrumb
const breadcrumbItems = [
  { label: 'Inicio', path: '/dashboard' },
  { label: 'Recetas', path: '/recetas' },
  { label: 'Nueva Receta', path: '/recetas/crear' }
];

// Cargar datos iniciales
const loadData = async () => {
  await portfolioService.getAllPortfolios();
};

// Crear receta
const createRecipe = async () => {
  try {
    const recipeData = {
      ...newRecipe.value,
      type: recipeType.value,
      created: new Date().toISOString()
    };
    
    await recipeService.createRecipe(recipeData);
    router.push('/recetas');
  } catch (error) {
    console.error('Error al crear la receta:', error);
  }
};

// Añadir paso
const addStep = () => {
  newRecipe.value.steps.push('');
};

// Eliminar paso
const removeStep = (index) => {
  newRecipe.value.steps.splice(index, 1);
};

// Cargar datos al montar el componente
onMounted(() => {
  loadData();
});

const saveRecipe = async () => {
  try {
    // Procesar los pasos de preparación
    const stepsArray = newRecipe.steps
      .split('\n')
      .map(step => step.trim())
      .filter(step => step.length > 0);
    
    const recipeData = {
      ...newRecipe,
      type: recipeType.value,
      steps: stepsArray
    };
    
    await recipeService.createRecipe(recipeData);
    router.push('/recetas');
  } catch (error) {
    console.error('Error al guardar la receta:', error);
  }
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
</style> 