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

  /**
   * Helper to get current user ID from localStorage or throw an error.
   * @private
   */
  getCurrentUserIdOrThrow() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser?.id) {
      throw new Error('Usuario no autenticado o sin ID');
    }
    return currentUser.id;
  }

  // Getters de estado
  getRecipes() { return recipes; }
  getRecipesWithoutPortfolio() { return recipesWithoutPortfolio; }
  getCurrentRecipe() { return currentRecipe; }
  getIsLoading() { return isLoading; }
  getError() { return error; }
  
  /**
   * Obtiene todas las recetas del usuario autenticado
   * @returns {Promise<Recipe[]>} Lista de recetas
   */
  async getAllRecipes() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      const result = await this.getAll();
      // Filtrar solo las recetas del usuario actual
      const userRecipes = result.filter(recipe => recipe.userId === userId);
      recipes.value = userRecipes.map(recipe => new Recipe(recipe));
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
   * Obtiene todas las recetas del usuario que no están asociadas a un portafolio
   * @returns {Promise<Recipe[]>} Lista de recetas sin portafolio
   */
  async getRecipesWithoutPortfolio() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      console.log('Buscando recetas sin portafolio...');
      
      const allRecipes = await this.getAll();
      // Filtrar por usuario y sin portafolio
      const filteredRecipes = allRecipes.filter(recipe => 
        recipe.userId === userId && !recipe.portfolioId
      );
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
   * Obtiene una receta por su ID (verifica que pertenezca al usuario)
   * @param {number} id - ID de la receta
   * @returns {Promise<Recipe>} La receta encontrada
   */
  async getRecipeById(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      const recipe = await this.getById(id);
      
      // Verificar que la receta pertenezca al usuario actual
      if (recipe.userId !== userId) {
        throw new Error('No tienes permisos para acceder a esta receta');
      }
      
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
   * Obtiene todas las recetas asociadas a un portafolio del usuario
   * @param {number} portfolioId - ID del portafolio
   * @returns {Promise<Recipe[]>} Lista de recetas del portafolio
   */
  async getRecipesByPortfolioId(portfolioId) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      const allRecipes = await this.getAll();
      // Filtrar por usuario y portafolio
      const filteredRecipes = allRecipes.filter(recipe => 
        recipe.userId === userId && recipe.portfolioId === portfolioId
      );
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
   * Crea una nueva receta para el usuario autenticado
   * @param {Object} recipeData - Datos de la receta a crear
   * @returns {Promise<Recipe>} La receta creada
   */
  async createRecipe(recipeData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      
      // Separar los ingredientes temporalmente
      const { ingredients, ...recipeDetails } = recipeData;

      const newRecipe = {
        ...recipeDetails,
        userId: userId, // Asignar el ID del usuario autenticado
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
   * Actualiza una receta existente (verifica que pertenezca al usuario)
   * @param {number} id - ID de la receta
   * @param {Object} recipeData - Datos a actualizar
   * @returns {Promise<Recipe>} La receta actualizada
   */
  async updateRecipe(id, recipeData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      
      // Verificar que la receta pertenezca al usuario antes de actualizar
      const existingRecipe = await this.getById(id);
      if (existingRecipe.userId !== userId) {
        throw new Error('No tienes permisos para modificar esta receta');
      }
      
      // Asegurarse de que los ingredientes tengan el recipeId correcto
      const ingredients = Array.isArray(recipeData.ingredients) 
        ? recipeData.ingredients.map(ingredient => ({
            ...ingredient,
            recipeId: id
          }))
        : [];

      // Añadir timestamp de actualización y asegurar que portfolioId sea número
      // No modificar el userId original
      const updateData = {
        ...recipeData,
        ingredients,
        userId: existingRecipe.userId, // Mantener el userId original
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
   * Elimina una receta (verifica que pertenezca al usuario)
   * @param {number} id - ID de la receta a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deleteRecipe(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      
      // Verificar que la receta pertenezca al usuario antes de eliminar
      const existingRecipe = await this.getById(id);
      if (existingRecipe.userId !== userId) {
        throw new Error('No tienes permisos para eliminar esta receta');
      }
      
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
   * Asigna una receta a un portafolio (verifica que ambos pertenezcan al usuario)
   * @param {number} recipeId - ID de la receta
   * @param {number} portfolioId - ID del portafolio
   * @returns {Promise<Recipe>} La receta actualizada
   */
  async assignToPortfolio(recipeId, portfolioId) {
    try {
      const userId = this.getCurrentUserIdOrThrow();
      
      // Verificar que la receta pertenezca al usuario
      const recipe = await this.getById(recipeId);
      if (recipe.userId !== userId) {
        throw new Error('No tienes permisos para modificar esta receta');
      }
      
      return await this.updateRecipe(recipeId, { ...recipe, portfolioId });
    } catch (err) {
      console.error(`Error al asignar la receta ${recipeId} al portafolio ${portfolioId}:`, err);
      throw err;
    }
  }

  /**
   * Remueve una receta de un portafolio (verifica que pertenezca al usuario)
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Recipe>} La receta actualizada
   */
  async removeFromPortfolio(recipeId) {
    try {
      const userId = this.getCurrentUserIdOrThrow();
      
      // Verificar que la receta pertenezca al usuario
      const recipe = await this.getById(recipeId);
      if (recipe.userId !== userId) {
        throw new Error('No tienes permisos para modificar esta receta');
      }
      
      return await this.updateRecipe(recipeId, { ...recipe, portfolioId: null });
    } catch (err) {
      console.error(`Error al remover la receta ${recipeId} del portafolio:`, err);
      throw err;
    }
  }
} 