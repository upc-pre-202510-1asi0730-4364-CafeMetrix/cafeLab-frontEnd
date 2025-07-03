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
      // Separar los ingredientes temporalmente
      const { ingredients, ...recipeDetails } = recipeData;

      const newRecipe = {
        ...recipeDetails,
        portfolioId: recipeDetails.portfolioId ? Number(recipeDetails.portfolioId) : null,
        createdAt: new Date().toISOString()
      };
      
      // Crear la receta a través de la API
      const createdRecipe = await this.create(newRecipe);
      
      // Ahora que tenemos el ID de la receta, asignarlo a los ingredientes
      if (Array.isArray(ingredients) && ingredients.length > 0) {
        createdRecipe.ingredients = ingredients.map(ingredient => ({
          ...ingredient,
          recipeId: createdRecipe.id
        }));
      } else {
        createdRecipe.ingredients = [];
      }

      // Actualizar la receta con los ingredientes
      const finalRecipe = await this.update(createdRecipe.id, createdRecipe);
      const recipe = new Recipe(finalRecipe);
      
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
      // Asegurarse de que los ingredientes tengan el recipeId correcto
      const ingredients = Array.isArray(recipeData.ingredients) 
        ? recipeData.ingredients.map(ingredient => ({
            ...ingredient,
            recipeId: id
          }))
        : [];

      // Añadir timestamp de actualización y asegurar que portfolioId sea número
      const updateData = {
        ...recipeData,
        ingredients,
        portfolioId: recipeData.portfolioId ? Number(recipeData.portfolioId) : null,
        updatedAt: new Date().toISOString()
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
    return this.updateRecipe(recipeId, { portfolioId });
  }

  /**
   * Remueve una receta de su portafolio actual
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Recipe>} La receta actualizada
   */
  async removeFromPortfolio(recipeId) {
    return this.updateRecipe(recipeId, { portfolioId: null });
  }
} 