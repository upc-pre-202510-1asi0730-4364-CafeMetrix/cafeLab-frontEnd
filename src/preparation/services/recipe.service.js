import { Recipe } from '../model/recipe.entity';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../../config/api.config';

/**
 * Servicio para gestionar las recetas
 */
export class RecipeService {
  constructor() {
    this.apiService = new ApiService();
    this.endpoint = API_ENDPOINTS.recipes;
  }
  
  /**
   * Obtiene todas las recetas
   * @returns {Promise<Recipe[]>} Lista de recetas
   */
  async getAllRecipes() {
    try {
      const recipes = await this.apiService.get(this.endpoint);
      return recipes.map(recipe => new Recipe(recipe));
    } catch (error) {
      console.error('Error al obtener recetas:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las recetas que no están asociadas a un portafolio
   * @returns {Promise<Recipe[]>} Lista de recetas sin portafolio
   */
  async getRecipesWithoutPortfolio() {
    try {
      console.log('Buscando recetas sin portafolio...');
      
      // MockAPI permite filtrar por portfolioId=null directamente
      const recipesWithoutPortfolio = await this.apiService.get(`${this.endpoint}?portfolioId=null`);
      console.log(`Recetas sin portafolio obtenidas: ${recipesWithoutPortfolio.length}`);
      
      return recipesWithoutPortfolio.map(recipe => new Recipe(recipe));
    } catch (error) {
      console.error('Error al obtener recetas sin portafolio:', error);
      throw error;
    }
  }

  /**
   * Obtiene una receta por su ID
   * @param {number} id - ID de la receta
   * @returns {Promise<Recipe>} La receta encontrada
   */
  async getRecipeById(id) {
    try {
      const recipe = await this.apiService.get(`${this.endpoint}/${id}`);
      return new Recipe(recipe);
    } catch (error) {
      console.error(`Error al obtener la receta ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene todas las recetas asociadas a un portafolio
   * @param {number} portfolioId - ID del portafolio
   * @returns {Promise<Recipe[]>} Lista de recetas del portafolio
   */
  async getRecipesByPortfolioId(portfolioId) {
    try {
      const recipes = await this.apiService.get(`${this.endpoint}?portfolioId=${portfolioId}`);
      return recipes.map(recipe => new Recipe(recipe));
    } catch (error) {
      console.error(`Error al obtener recetas del portafolio ${portfolioId}:`, error);
      throw error;
    }
  }

  /**
   * Crea una nueva receta
   * @param {Object} recipeData - Datos de la receta a crear
   * @returns {Promise<Recipe>} La receta creada
   */
  async createRecipe(recipeData) {
    try {
      // Preparar los datos de la receta
      const newRecipe = {
        ...recipeData,
        portfolioId: recipeData.portfolioId || null,
        created: new Date().toISOString()
      };
      
      // Crear la receta a través de la API
      const createdRecipe = await this.apiService.post(this.endpoint, newRecipe);
      return new Recipe(createdRecipe);
    } catch (error) {
      console.error('Error al crear la receta:', error);
      throw error;
    }
  }

  /**
   * Actualiza una receta existente
   * @param {number} id - ID de la receta
   * @param {Object} recipeData - Datos a actualizar
   * @returns {Promise<Recipe>} La receta actualizada
   */
  async updateRecipe(id, recipeData) {
    try {
      // Añadir timestamp de actualización
      const updateData = {
        ...recipeData,
        updated: new Date().toISOString()
      };
      
      // Actualizar la receta a través de la API
      const updatedRecipe = await this.apiService.put(`${this.endpoint}/${id}`, updateData);
      return new Recipe(updatedRecipe);
    } catch (error) {
      console.error(`Error al actualizar la receta ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una receta
   * @param {number} id - ID de la receta a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deleteRecipe(id) {
    try {
      return await this.apiService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error al eliminar la receta ${id}:`, error);
      throw error;
    }
  }

  /**
   * Asigna una receta a un portafolio
   * @param {number} recipeId - ID de la receta
   * @param {number} portfolioId - ID del portafolio
   * @returns {Promise<Recipe>} La receta actualizada
   */
  async assignToPortfolio(recipeId, portfolioId) {
    try {
      // Convertir IDs a números para asegurar consistencia
      const numRecipeId = Number(recipeId);
      const numPortfolioId = portfolioId ? Number(portfolioId) : null;
      
      console.log(`Asignando receta ${numRecipeId} al portafolio ${numPortfolioId}`);
      
      // Obtener la receta actual
      const recipe = await this.apiService.get(`${this.endpoint}/${numRecipeId}`);
      
      // Actualizar el campo portfolioId
      recipe.portfolioId = numPortfolioId;
      
      // Enviar la actualización
      const updatedRecipe = await this.apiService.put(`${this.endpoint}/${numRecipeId}`, recipe);
      
      return new Recipe(updatedRecipe);
    } catch (error) {
      console.error(`Error al asignar la receta ${recipeId} al portafolio ${portfolioId}:`, error);
      throw error;
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
    } catch (error) {
      console.error(`Error al remover la receta ${recipeId} del portafolio:`, error);
      throw error;
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