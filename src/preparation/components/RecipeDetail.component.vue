<template>
  <div>
    <HeaderBar />
    <div class="toolbar">
      <BreadcrumbNavigation :items="breadcrumbItems" />
    </div>
    
    <div class="recipe-detail">
      <div v-if="recipe" class="content-container">
        <div class="recipe-header">
          <h2>{{ recipe.name }}</h2>
          <div class="actions" v-if="userCanEdit">
            <button class="edit-btn" @click="editRecipe">
              <i class="pi pi-pencil"></i>
              {{ $t('common.edit') }}
            </button>
            <button class="delete-btn" @click="confirmDelete">
              <i class="pi pi-trash"></i>
              {{ $t('common.delete') }}
            </button>
          </div>
        </div>

        <!-- Imagen de la receta -->
        <div class="recipe-image-container" v-if="recipe.imageUrl">
          <img :src="recipe.imageUrl" :alt="recipe.name" class="recipe-image"/>
        </div>
        
        <!-- Información básica -->
        <div class="recipe-info">
          <div v-if="recipe.extractionMethod" class="detail-item">
            <strong>{{ $t('recipes.extractionMethod') }}:</strong> {{ recipe.extractionMethod }}
          </div>
          <div v-if="recipe.ratio" class="detail-item">
            <strong>{{ $t('recipes.ratio') }}:</strong> {{ recipe.ratio }}
          </div>
          <div v-if="recipe.preparationTime" class="detail-item">
            <strong>{{ $t('recipes.preparationTime') }}:</strong> {{ recipe.preparationTime }} {{ $t('recipes.minutes') }}
          </div>
          <div v-if="recipe.grindSize" class="detail-item">
            <strong>{{ $t('recipes.grindSize') }}:</strong> {{ recipe.grindSize }}
          </div>
        </div>

        <!-- Ingredientes -->
        <div class="recipe-ingredients">
          <h3>{{ $t('recipes.ingredients') }}</h3>
          <ul>
            <li v-for="(ingredient, index) in recipe.ingredients" :key="index">
              {{ ingredient.name }} - {{ ingredient.amount }} {{ ingredient.unit }}
            </li>
          </ul>
        </div>

        <!-- Pasos de preparación -->
        <div class="recipe-steps">
          <h3>{{ $t('recipes.preparationSteps') }}</h3>
          <div class="steps-content">{{ recipe.steps }}</div>
        </div>

        <!-- Tips -->
        <div v-if="recipe.tips" class="recipe-tips">
          <h3>{{ $t('recipes.tips') }}</h3>
          <div class="tips-content">{{ recipe.tips }}</div>
        </div>

        <!-- Notas de cata -->
        <div v-if="recipe.cupping" class="recipe-cupping">
          <h3>{{ $t('recipes.cuppingNotes') }}</h3>
          <div class="cupping-content">{{ recipe.cupping }}</div>
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
            <p class="warning">{{ $t('common.thisCannotBeUndone') }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="showDeleteConfirmation = false">
            {{ $t('common.cancel') }}
          </button>
          <button class="delete-confirm-btn" @click="deleteRecipe">
            {{ $t('common.delete') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from "../../public/components/headerBar.vue";
import BreadcrumbNavigation from '../../shared/components/BreadcrumbNavigation.component.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthService } from '../../auth/services/authService.js';
import { RecipeService } from '../services/recipe.service';

export default {
  name: 'RecipeDetail',
  components: {
    HeaderBar,
    BreadcrumbNavigation
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { t } = useI18n();
    const auth = useAuthService();
    const recipe = ref(null);
    const userId = auth.getCurrentUserId();
    const recipeService = new RecipeService();
    const showDeleteConfirmation = ref(false);

    const userCanEdit = computed(() => {
      return recipe.value && recipe.value.userId === userId;
    });

    const breadcrumbItems = computed(() => [
      { label: 'Inicio', path: '/dashboard' },
      { label: 'Recetas', path: '/recetas' },
      { label: recipe.value?.name || 'Detalle de Receta', path: '#' }
    ]);

    const loadRecipe = async () => {
      try {
        const recipeId = route.params.id;
        const loadedRecipe = await recipeService.getRecipeById(recipeId);
        recipe.value = loadedRecipe;
      } catch (error) {
        console.error('Error al cargar la receta:', error);
      }
    };

    const editRecipe = () => {
      router.push(`/recetas/editar/${recipe.value.id}`);
    };

    const confirmDelete = () => {
      showDeleteConfirmation.value = true;
    };

    const deleteRecipe = async () => {
      try {
        await recipeService.deleteRecipe(recipe.value.id);
        showDeleteConfirmation.value = false;
        router.push('/recetas');
      } catch (error) {
        console.error('Error al eliminar la receta:', error);
      }
    };

    onMounted(() => {
      loadRecipe();
    });

    return {
      recipe,
      userCanEdit,
      editRecipe,
      confirmDelete,
      deleteRecipe,
      showDeleteConfirmation,
      breadcrumbItems,
      t
    };
  }
};
</script>

<style scoped>
.toolbar {
  background-color: #F8F7F2;
  padding: 1rem 2rem;
  margin-top: 70px;
  border-bottom: 1px solid #e0e0e0;
}

.recipe-detail {
  min-height: calc(100vh - 70px);
  background-color: #F8F7F2;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.recipe-header h2 {
  color: #2C3E50;
  margin: 0;
  font-size: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.edit-btn, .delete-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.edit-btn {
  background-color: #42b983;
  color: white;
}

.edit-btn:hover {
  background-color: #3aa876;
}

.delete-btn {
  background-color: #dc3545;
  color: white;
}

.delete-btn:hover {
  background-color: #c82333;
}

.recipe-image-container {
  margin: 0 auto 2rem auto;
  text-align: center;
  width: 300px;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  border: 4px solid white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recipe-info {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.detail-item {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #2C3E50;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.recipe-ingredients, .recipe-steps, .recipe-tips, .recipe-cupping {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.recipe-ingredients h3, .recipe-steps h3, .recipe-tips h3, .recipe-cupping h3 {
  color: #2C3E50;
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.recipe-ingredients ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.recipe-ingredients li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  color: #2C3E50;
}

.recipe-ingredients li:last-child {
  border-bottom: none;
}

.steps-content, .tips-content, .cupping-content {
  line-height: 1.6;
  color: #2C3E50;
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
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  padding: 2rem;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  color: #2C3E50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
}

.confirmation-content {
  text-align: center;
  margin-bottom: 2rem;
}

.confirmation-message {
  margin: 1rem 0;
  font-size: 1.1rem;
  color: #2C3E50;
}

.warning {
  color: #d32f2f;
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-btn, .delete-confirm-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.cancel-btn {
  background-color: #e0e0e0;
  color: #333;
}

.delete-confirm-btn {
  background-color: #dc3545;
  color: white;
}

.cancel-btn:hover {
  background-color: #d0d0d0;
}

.delete-confirm-btn:hover {
  background-color: #c82333;
}
</style> 