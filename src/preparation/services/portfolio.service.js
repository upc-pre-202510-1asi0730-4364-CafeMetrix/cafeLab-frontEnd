import { Portfolio } from '../model/portfolio.entity';
import BaseService from '../../shared/services/base.service';
import { ref } from 'vue';

// Estado reactivo
const portfolios = ref([]);
const isLoading = ref(false);
const error = ref(null);
const currentPortfolio = ref(null);

/**
 * Servicio para gestionar los portafolios
 */
export class PortfolioService extends BaseService {
  constructor() {
    super(import.meta.env.VITE_PORTFOLIOS_ENDPOINT_PATH?.replace('/', '') || 'portfolios');
    this.recipeService = new BaseService('recipes');
  }

  // Getters de estado
  getPortfolios() { return portfolios; }
  getCurrentPortfolio() { return currentPortfolio; }
  getIsLoading() { return isLoading; }
  getError() { return error; }
  
  /**
   * Obtiene todos los portafolios
   * @returns {Promise<Portfolio[]>} Lista de portafolios
   */
  async getAllPortfolios() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const result = await this.getAll();
      portfolios.value = result.map(portfolio => new Portfolio(portfolio));
      return portfolios.value;
    } catch (err) {
      error.value = err.message;
      console.error('Error al obtener portafolios:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Obtiene un portafolio por su ID
   * @param {number} id - ID del portafolio
   * @returns {Promise<Portfolio>} El portafolio encontrado
   */
  async getPortfolioById(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Obtener los datos del portafolio
      const portfolioData = await this.getById(id);
      
      // Obtener las recetas asociadas a este portafolio
      const allRecipes = await this.recipeService.getAll();
      const recipes = allRecipes.filter(recipe => recipe.portfolioId === id);
      
      // Crear el objeto Portfolio y añadir las recetas
      const portfolio = new Portfolio(portfolioData);
      // Asegurarnos de que recipes siempre sea un array, incluso si está vacío
      portfolio.recipes = recipes || [];
      
      currentPortfolio.value = portfolio;
      return portfolio;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al obtener el portafolio ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Crea un nuevo portafolio
   * @param {Object} portfolioData - Datos del portafolio a crear
   * @returns {Promise<Portfolio>} El portafolio creado
   */
  async createPortfolio(portfolioData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Preparar los datos del portafolio
      const newPortfolio = {
        name: portfolioData.name,
        createdAt: new Date().toISOString(),
        recipeIds: portfolioData.recipeIds || []
      };
      
      // Crear el portafolio a través de la API
      const createdPortfolio = await this.create(newPortfolio);
      const portfolio = new Portfolio(createdPortfolio);
      portfolios.value.push(portfolio);
      return portfolio;
    } catch (err) {
      error.value = err.message;
      console.error('Error al crear el portafolio:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Actualiza un portafolio existente
   * @param {number} id - ID del portafolio
   * @param {Object} portfolioData - Datos a actualizar
   * @returns {Promise<Portfolio>} El portafolio actualizado
   */
  async updatePortfolio(id, portfolioData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Añadir timestamp de actualización
      const updateData = {
        ...portfolioData,
        updatedAt: new Date().toISOString()
      };
      
      // Actualizar el portafolio a través de la API
      const updatedPortfolio = await this.update(id, updateData);
      const portfolio = new Portfolio(updatedPortfolio);
      
      const index = portfolios.value.findIndex(p => p.id === id);
      if (index !== -1) {
        portfolios.value[index] = portfolio;
      }
      
      if (currentPortfolio.value?.id === id) {
        currentPortfolio.value = portfolio;
      }
      
      return portfolio;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al actualizar el portafolio ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Elimina un portafolio
   * @param {number} id - ID del portafolio a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deletePortfolio(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      await this.delete(id);
      portfolios.value = portfolios.value.filter(p => p.id !== id);
      
      if (currentPortfolio.value?.id === id) {
        currentPortfolio.value = null;
      }
      
      return true;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al eliminar el portafolio ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Añade una receta a un portafolio
   * @param {number} portfolioId - ID del portafolio
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Portfolio>} El portafolio actualizado
   */
  async addRecipeToPortfolio(portfolioId, recipeId) {
    try {
      // Convertir IDs a números para asegurar consistencia
      const numPortfolioId = Number(portfolioId);
      const numRecipeId = Number(recipeId);
      
      console.log(`Añadiendo receta ${numRecipeId} al portafolio ${numPortfolioId}`);
      
      // Primero, obtener el portafolio actual
      const portfolio = await this.getById(numPortfolioId);
      
      // Asegurarse de que recipeIds exista y sea un array
      if (!portfolio.recipeIds) {
        portfolio.recipeIds = [];
      }
      
      // Verificar si la receta ya está en el portafolio
      if (!portfolio.recipeIds.includes(numRecipeId)) {
        // Añadir la receta al portafolio
        portfolio.recipeIds.push(numRecipeId);
        
        console.log(`RecipeIds actualizados: ${JSON.stringify(portfolio.recipeIds)}`);
        
        // Actualizar el portafolio
        const updatedPortfolio = await this.update(numPortfolioId, portfolio);
        
        // Actualizar la receta para referenciar al portafolio
        const recipe = await this.recipeService.getById(numRecipeId);
        recipe.portfolioId = numPortfolioId;
        await this.recipeService.update(numRecipeId, recipe);
        
        const portfolioInstance = new Portfolio(updatedPortfolio);
        
        // Actualizar el estado local
        const index = portfolios.value.findIndex(p => p.id === numPortfolioId);
        if (index !== -1) {
          portfolios.value[index] = portfolioInstance;
        }
        
        if (currentPortfolio.value?.id === numPortfolioId) {
          currentPortfolio.value = portfolioInstance;
        }
        
        return portfolioInstance;
      }
      
      return new Portfolio(portfolio);
    } catch (err) {
      error.value = err.message;
      console.error(`Error al añadir la receta ${recipeId} al portafolio ${portfolioId}:`, err);
      throw err;
    }
  }

  /**
   * Elimina una receta de un portafolio
   * @param {number} portfolioId - ID del portafolio
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Portfolio>} El portafolio actualizado
   */
  async removeRecipeFromPortfolio(portfolioId, recipeId) {
    try {
      // Convertir IDs a números para asegurar consistencia
      const numPortfolioId = Number(portfolioId);
      const numRecipeId = Number(recipeId);
      
      console.log(`Eliminando receta ${numRecipeId} del portafolio ${numPortfolioId}`);
      
      // Primero, obtener el portafolio actual
      const portfolio = await this.getById(numPortfolioId);
      
      // Asegurarse de que recipeIds exista y sea un array
      if (!portfolio.recipeIds) {
        portfolio.recipeIds = [];
        return new Portfolio(portfolio);
      }
      
      // Eliminar la receta del portafolio
      portfolio.recipeIds = portfolio.recipeIds.filter(id => Number(id) !== numRecipeId);
      
      console.log(`RecipeIds actualizados: ${JSON.stringify(portfolio.recipeIds)}`);
      
      // Actualizar el portafolio
      const updatedPortfolio = await this.update(numPortfolioId, portfolio);
      
      // Actualizar la receta para quitar la referencia al portafolio
      const recipe = await this.recipeService.getById(numRecipeId);
      recipe.portfolioId = null;
      await this.recipeService.update(numRecipeId, recipe);
      
      const portfolioInstance = new Portfolio(updatedPortfolio);
      
      // Actualizar el estado local
      const index = portfolios.value.findIndex(p => p.id === numPortfolioId);
      if (index !== -1) {
        portfolios.value[index] = portfolioInstance;
      }
      
      if (currentPortfolio.value?.id === numPortfolioId) {
        currentPortfolio.value = portfolioInstance;
      }
      
      return portfolioInstance;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al eliminar la receta ${recipeId} del portafolio ${portfolioId}:`, err);
      throw err;
    }
  }
} 