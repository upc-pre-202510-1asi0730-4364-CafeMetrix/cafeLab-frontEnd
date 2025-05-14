import { ref } from 'vue';
import { RecipeService } from '../services/recipe.service';

// Crear instancia del servicio
const recipeService = new RecipeService();

// Estado reactivo
const recipes = ref([]);
const recipesWithoutPortfolio = ref([]);
const isLoading = ref(false);
const error = ref(null);
const currentRecipe = ref(null);

/**
 * Gestor de recetas que proporciona estado reactivo y métodos para manipular recetas
 */
export const RecipeManager = {
  // Getters de estado
  getRecipes: () => recipes.value,
  getRecipesWithoutPortfolio: () => recipesWithoutPortfolio.value,
  getCurrentRecipe: () => currentRecipe.value,
  getIsLoading: () => isLoading.value,
  getError: () => error.value,
  
  // Acciones
  async fetchAllRecipes() {
    isLoading.value = true;
    error.value = null;
    
    try {
      recipes.value = await recipeService.getAllRecipes();
      return recipes.value;
    } catch (err) {
      error.value = err.message;
      console.error('Error al cargar recetas:', err);
    } finally {
      isLoading.value = false;
    }
  },
  
  async fetchRecipesWithoutPortfolio() {
    isLoading.value = true;
    error.value = null;
    
    try {
      recipesWithoutPortfolio.value = await recipeService.getRecipesWithoutPortfolio();
      return recipesWithoutPortfolio.value;
    } catch (err) {
      error.value = err.message;
      console.error('Error al cargar recetas sin portafolio:', err);
    } finally {
      isLoading.value = false;
    }
  },
  
  async fetchRecipeById(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      currentRecipe.value = await recipeService.getRecipeById(id);
      return currentRecipe.value;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al cargar la receta ${id}:`, err);
    } finally {
      isLoading.value = false;
    }
  },
  
  async fetchRecipesByPortfolioId(portfolioId) {
    isLoading.value = true;
    error.value = null;
    
    try {
      recipes.value = await recipeService.getRecipesByPortfolioId(portfolioId);
      return recipes.value;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al cargar recetas del portafolio ${portfolioId}:`, err);
    } finally {
      isLoading.value = false;
    }
  },
  
  async createRecipe(recipeData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const newRecipe = await recipeService.createRecipe(recipeData);
      
      // Agregar la nueva receta a la lista correspondiente
      if (newRecipe.portfolioId === null) {
        recipesWithoutPortfolio.value.push(newRecipe);
      } else {
        recipes.value.push(newRecipe);
      }
      
      return newRecipe;
    } catch (err) {
      error.value = err.message;
      console.error('Error al crear la receta:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  },
  
  async updateRecipe(id, recipeData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const updatedRecipe = await recipeService.updateRecipe(id, recipeData);
      
      // Actualizar la receta en la lista correspondiente
      const indexInRecipes = recipes.value.findIndex(r => r.id === id);
      if (indexInRecipes !== -1) {
        recipes.value[indexInRecipes] = updatedRecipe;
      }
      
      const indexInWithoutPortfolio = recipesWithoutPortfolio.value.findIndex(r => r.id === id);
      if (indexInWithoutPortfolio !== -1) {
        // Si la receta ahora tiene un portafolio, eliminarla de la lista sin portafolio
        if (updatedRecipe.portfolioId !== null) {
          recipesWithoutPortfolio.value.splice(indexInWithoutPortfolio, 1);
        } else {
          recipesWithoutPortfolio.value[indexInWithoutPortfolio] = updatedRecipe;
        }
      }
      
      if (currentRecipe.value && currentRecipe.value.id === id) {
        currentRecipe.value = updatedRecipe;
      }
      
      return updatedRecipe;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al actualizar la receta ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  },
  
  async deleteRecipe(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      await recipeService.deleteRecipe(id);
      
      // Eliminar la receta de las listas
      recipes.value = recipes.value.filter(r => r.id !== id);
      recipesWithoutPortfolio.value = recipesWithoutPortfolio.value.filter(r => r.id !== id);
      
      if (currentRecipe.value && currentRecipe.value.id === id) {
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
  },
  
  async assignToPortfolio(recipeId, portfolioId) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const updatedRecipe = await recipeService.assignToPortfolio(recipeId, portfolioId);
      
      // Actualizar la receta en las listas
      const indexInRecipes = recipes.value.findIndex(r => r.id === recipeId);
      if (indexInRecipes !== -1) {
        recipes.value[indexInRecipes] = updatedRecipe;
      }
      
      // Remover de la lista sin portafolio si ahora tiene un portafolio
      if (portfolioId !== null) {
        recipesWithoutPortfolio.value = recipesWithoutPortfolio.value.filter(r => r.id !== recipeId);
      }
      
      if (currentRecipe.value && currentRecipe.value.id === recipeId) {
        currentRecipe.value = updatedRecipe;
      }
      
      return updatedRecipe;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al asignar la receta ${recipeId} al portafolio ${portfolioId}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  },
  
  async removeFromPortfolio(recipeId) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const updatedRecipe = await recipeService.removeFromPortfolio(recipeId);
      
      // Agregar la receta a la lista sin portafolio
      const alreadyInWithoutPortfolio = recipesWithoutPortfolio.value.some(r => r.id === recipeId);
      if (!alreadyInWithoutPortfolio) {
        recipesWithoutPortfolio.value.push(updatedRecipe);
      }
      
      // Actualizar en la lista general si existe
      const indexInRecipes = recipes.value.findIndex(r => r.id === recipeId);
      if (indexInRecipes !== -1) {
        recipes.value[indexInRecipes] = updatedRecipe;
      }
      
      if (currentRecipe.value && currentRecipe.value.id === recipeId) {
        currentRecipe.value = updatedRecipe;
      }
      
      return updatedRecipe;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al remover la receta ${recipeId} del portafolio:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
}; 