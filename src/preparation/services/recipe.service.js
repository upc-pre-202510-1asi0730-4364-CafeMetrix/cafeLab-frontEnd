import { Recipe } from '../model/recipe.entity';
import BaseService from '../../shared/services/base.service';
import { ref } from 'vue';

// Estado reactivo
const recipes = ref([]);
const recipesWithoutPortfolio = ref([]);
const isLoading = ref(false);
const error = ref(null);
const currentRecipe = ref(null);

/**
 * Servicio para gestionar las recetas
 */
export class RecipeService extends BaseService {
  constructor() {
    super('recipes');
  }

  // Getters de estado
  getRecipes() { return recipes; }
  getRecipesWithoutPortfolio() { return recipesWithoutPortfolio; }
  getCurrentRecipe() { return currentRecipe; }
  getIsLoading() { return isLoading; }
  getError() { return error; }
  
  /**
   * Obtiene todas las recetas
   * @returns {Promise<Recipe[]>} Lista de recetas
   */
  async getAllRecipes() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const result = await this.getAll();
      recipes.value = result.map(recipe => new Recipe(recipe));
      return recipes.value;
    } catch (err) {
      error.value = err.message;
      console.error('Error al obtener recetas:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Obtiene todas las recetas que no están asociadas a un portafolio
   * @returns {Promise<Recipe[]>} Lista de recetas sin portafolio
   */
  async getRecipesWithoutPortfolio() {
    isLoading.value = true;
    error.value = null;
    
    try {
      console.log('Buscando recetas sin portafolio...');
      
      const allRecipes = await this.getAll();
      const filteredRecipes = allRecipes.filter(recipe => !recipe.portfolioId);
      recipesWithoutPortfolio.value = filteredRecipes.map(recipe => new Recipe(recipe));
      
      console.log(`Recetas sin portafolio obtenidas: ${recipesWithoutPortfolio.value.length}`);
      return recipesWithoutPortfolio.value;
    } catch (err) {
      error.value = err.message;
      console.error('Error al obtener recetas sin portafolio:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Obtiene una receta por su ID
   * @param {number} id - ID de la receta
   * @returns {Promise<Recipe>} La receta encontrada
   */
  async getRecipeById(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const recipe = await this.getById(id);
      currentRecipe.value = new Recipe(recipe);
      return currentRecipe.value;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al obtener la receta ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Obtiene todas las recetas asociadas a un portafolio
   * @param {number} portfolioId - ID del portafolio
   * @returns {Promise<Recipe[]>} Lista de recetas del portafolio
   */
  async getRecipesByPortfolioId(portfolioId) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const allRecipes = await this.getAll();
      const filteredRecipes = allRecipes.filter(recipe => recipe.portfolioId === portfolioId);
      recipes.value = filteredRecipes.map(recipe => new Recipe(recipe));
      return recipes.value;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al obtener recetas del portafolio ${portfolioId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Crea una nueva receta
   * @param {Object} recipeData - Datos de la receta a crear
   * @returns {Promise<Recipe>} La receta creada
   */
  async createRecipe(recipeData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Preparar los datos de la receta
      const steps = Array.isArray(recipeData.steps) 
        ? recipeData.steps 
        : typeof recipeData.steps === 'string'
          ? recipeData.steps.split('\n').map(step => step.trim()).filter(step => step.length > 0)
          : [];

      const newRecipe = {
        ...recipeData,
        steps,
        portfolioId: recipeData.portfolioId || null,
        created: new Date().toISOString()
      };
      
      // Crear la receta a través de la API
      const createdRecipe = await this.create(newRecipe);
      const recipe = new Recipe(createdRecipe);
      
      // Agregar la nueva receta a la lista correspondiente
      if (recipe.portfolioId === null) {
        recipesWithoutPortfolio.value.push(recipe);
      } else {
        recipes.value.push(recipe);
      }
      
      return recipe;
    } catch (err) {
      error.value = err.message;
      console.error('Error al crear la receta:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Actualiza una receta existente
   * @param {number} id - ID de la receta
   * @param {Object} recipeData - Datos a actualizar
   * @returns {Promise<Recipe>} La receta actualizada
   */
  async updateRecipe(id, recipeData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Procesar los pasos
      const steps = Array.isArray(recipeData.steps) 
        ? recipeData.steps 
        : typeof recipeData.steps === 'string'
          ? recipeData.steps.split('\n').map(step => step.trim()).filter(step => step.length > 0)
          : [];

      // Añadir timestamp de actualización
      const updateData = {
        ...recipeData,
        steps,
        updated: new Date().toISOString()
      };
      
      // Actualizar la receta a través de la API
      const updatedRecipe = await this.update(id, updateData);
      const recipe = new Recipe(updatedRecipe);
      
      // Actualizar la receta en la lista correspondiente
      const indexInRecipes = recipes.value.findIndex(r => r.id === id);
      if (indexInRecipes !== -1) {
        recipes.value[indexInRecipes] = recipe;
      }
      
      const indexInWithoutPortfolio = recipesWithoutPortfolio.value.findIndex(r => r.id === id);
      if (indexInWithoutPortfolio !== -1) {
        // Si la receta ahora tiene un portafolio, eliminarla de la lista sin portafolio
        if (recipe.portfolioId !== null) {
          recipesWithoutPortfolio.value.splice(indexInWithoutPortfolio, 1);
        } else {
          recipesWithoutPortfolio.value[indexInWithoutPortfolio] = recipe;
        }
      }
      
      if (currentRecipe.value?.id === id) {
        currentRecipe.value = recipe;
      }
      
      return recipe;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al actualizar la receta ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Elimina una receta
   * @param {number} id - ID de la receta a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deleteRecipe(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      await this.delete(id);
      
      // Eliminar la receta de las listas
      recipes.value = recipes.value.filter(r => r.id !== id);
      recipesWithoutPortfolio.value = recipesWithoutPortfolio.value.filter(r => r.id !== id);
      
      if (currentRecipe.value?.id === id) {
        currentRecipe.value = null;
      }
      
      return true;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al eliminar la receta ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Asigna una receta a un portafolio
   * @param {number} recipeId - ID de la receta
   * @param {number} portfolioId - ID del portafolio
   * @returns {Promise<Recipe>} La receta actualizada
   */
  async assignToPortfolio(recipeId, portfolioId) {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Convertir IDs a números para asegurar consistencia
      const numRecipeId = Number(recipeId);
      const numPortfolioId = portfolioId ? Number(portfolioId) : null;
      
      console.log(`Asignando receta ${numRecipeId} al portafolio ${numPortfolioId}`);
      
      // Obtener la receta actual
      const recipe = await this.getById(numRecipeId);
      
      // Actualizar el campo portfolioId
      recipe.portfolioId = numPortfolioId;
      
      // Enviar la actualización
      const updatedRecipe = await this.update(numRecipeId, recipe);
      const recipeInstance = new Recipe(updatedRecipe);
      
      // Actualizar la receta en las listas
      const indexInRecipes = recipes.value.findIndex(r => r.id === numRecipeId);
      if (indexInRecipes !== -1) {
        recipes.value[indexInRecipes] = recipeInstance;
      }
      
      // Remover de la lista sin portafolio si ahora tiene un portafolio
      if (numPortfolioId !== null) {
        recipesWithoutPortfolio.value = recipesWithoutPortfolio.value.filter(r => r.id !== numRecipeId);
      }
      
      if (currentRecipe.value?.id === numRecipeId) {
        currentRecipe.value = recipeInstance;
      }
      
      return recipeInstance;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al asignar la receta ${recipeId} al portafolio ${portfolioId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Remueve una receta de cualquier portafolio
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Recipe>} La receta actualizada
   */
  async removeFromPortfolio(recipeId) {
    try {
      // Asignar a portfolioId null es equivalente a remover del portafolio
      return await this.assignToPortfolio(recipeId, null);
    } catch (err) {
      error.value = err.message;
      console.error(`Error al remover la receta ${recipeId} del portafolio:`, err);
      throw err;
    }
  }

  /**
   * Reinicia los datos cargando desde data.json
   * Útil para sincronizar con el archivo original durante desarrollo
   */
  async resetToOriginalData() {
    try {
      const response = await fetch('/server/data.json');
      const data = await response.json();
      localStorage.setItem(STORAGE_KEY_RECIPES, JSON.stringify(data.recipes));
      console.log('Datos de recetas reiniciados desde data.json');
      return true;
    } catch (error) {
      console.error('Error al reiniciar datos de recetas:', error);
      throw error;
    }
  }
} 