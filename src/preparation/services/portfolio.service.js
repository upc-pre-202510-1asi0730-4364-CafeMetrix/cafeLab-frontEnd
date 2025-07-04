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

  /**
   * Helper to get current user ID from localStorage or throw an error.
   * @private
   */
  getCurrentUserIdOrThrow() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser?.id) {
      throw new Error('Usuario no autenticado o sin ID');
    }
    return Number(currentUser.id);
  }

  // Getters de estado
  getPortfolios() { return portfolios; }
  getCurrentPortfolio() { return currentPortfolio; }
  getIsLoading() { return isLoading; }
  getError() { return error; }
  
  /**
   * Obtiene todos los portafolios del usuario autenticado
   * @returns {Promise<Portfolio[]>} Lista de portafolios
   */
  async getAllPortfolios() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      const result = await this.getAll();
      // Filtrar solo los portafolios del usuario actual y asegurar que userId sea número
      const userPortfolios = result.filter(portfolio => Number(portfolio.userId) === userId);
      portfolios.value = userPortfolios.map(portfolio => new Portfolio(portfolio));
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
   * Obtiene un portafolio por su ID (verifica que pertenezca al usuario)
   * @param {number} id - ID del portafolio
   * @returns {Promise<Portfolio>} El portafolio encontrado
   */
  async getPortfolioById(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      
      // Obtener los datos del portafolio
      const portfolioData = await this.getById(id);
      
      // Verificar que el portafolio pertenezca al usuario actual
      if (Number(portfolioData.userId) !== userId) {
        throw new Error('No tienes permisos para acceder a este portafolio');
      }
      
      // Obtener las recetas asociadas a este portafolio (solo del usuario)
      const allRecipes = await this.recipeService.getAll();
      const recipes = allRecipes.filter(recipe => 
        recipe.portfolioId === id && Number(recipe.userId) === userId
      );
      
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
   * Crea un nuevo portafolio para el usuario autenticado
   * @param {Object} portfolioData - Datos del portafolio a crear
   * @returns {Promise<Portfolio>} El portafolio creado
   */
  async createPortfolio(portfolioData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      
      // Preparar los datos del portafolio
      const newPortfolio = {
        name: portfolioData.name,
        userId: userId,
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
   * Actualiza un portafolio existente (verifica que pertenezca al usuario)
   * @param {number} id - ID del portafolio
   * @param {Object} portfolioData - Datos a actualizar
   * @returns {Promise<Portfolio>} El portafolio actualizado
   */
  async updatePortfolio(id, portfolioData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      
      // Verificar que el portafolio pertenezca al usuario antes de actualizar
      const existingPortfolio = await this.getById(id);
      if (Number(existingPortfolio.userId) !== userId) {
        throw new Error('No tienes permisos para modificar este portafolio');
      }
      
      // Añadir timestamp de actualización
      // No modificar el userId original
      const updateData = {
        ...portfolioData,
        userId: Number(existingPortfolio.userId), // Mantener el userId original como número
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
   * Elimina un portafolio (verifica que pertenezca al usuario)
   * @param {number} id - ID del portafolio a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deletePortfolio(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const userId = this.getCurrentUserIdOrThrow();
      
      // Verificar que el portafolio pertenezca al usuario antes de eliminar
      const existingPortfolio = await this.getById(id);
      if (Number(existingPortfolio.userId) !== userId) {
        throw new Error('No tienes permisos para eliminar este portafolio');
      }
      
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
   * Añade una receta a un portafolio (verifica que ambos pertenezcan al usuario)
   * @param {number} portfolioId - ID del portafolio
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Portfolio>} El portafolio actualizado
   */
  async addRecipeToPortfolio(portfolioId, recipeId) {
    try {
      const userId = this.getCurrentUserIdOrThrow();
      
      // Convertir IDs a números para asegurar consistencia
      const numPortfolioId = Number(portfolioId);
      const numRecipeId = Number(recipeId);
      
      console.log(`Añadiendo receta ${numRecipeId} al portafolio ${numPortfolioId}`);
      
      // Verificar que el portafolio pertenezca al usuario
      const portfolio = await this.getById(numPortfolioId);
      if (Number(portfolio.userId) !== userId) {
        throw new Error('No tienes permisos para modificar este portafolio');
      }
      
      // Verificar que la receta pertenezca al usuario
      const recipe = await this.recipeService.getById(numRecipeId);
      if (Number(recipe.userId) !== userId) {
        throw new Error('No tienes permisos para usar esta receta');
      }
      
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
   * Elimina una receta de un portafolio (verifica que ambos pertenezcan al usuario)
   * @param {number} portfolioId - ID del portafolio
   * @param {number} recipeId - ID de la receta
   * @returns {Promise<Portfolio>} El portafolio actualizado
   */
  async removeRecipeFromPortfolio(portfolioId, recipeId) {
    try {
      const userId = this.getCurrentUserIdOrThrow();
      
      // Convertir IDs a números para asegurar consistencia
      const numPortfolioId = Number(portfolioId);
      const numRecipeId = Number(recipeId);
      
      console.log(`Eliminando receta ${numRecipeId} del portafolio ${numPortfolioId}`);
      
      // Verificar que el portafolio pertenezca al usuario
      const portfolio = await this.getById(numPortfolioId);
      if (Number(portfolio.userId) !== userId) {
        throw new Error('No tienes permisos para modificar este portafolio');
      }
      
      // Verificar que la receta pertenezca al usuario
      const recipe = await this.recipeService.getById(numRecipeId);
      if (Number(recipe.userId) !== userId) {
        throw new Error('No tienes permisos para modificar esta receta');
      }
      
      // Asegurarse de que recipeIds exista y sea un array
      if (!portfolio.recipeIds) {
        portfolio.recipeIds = [];
      }
      
      // Eliminar la receta del portafolio
      portfolio.recipeIds = portfolio.recipeIds.filter(id => id !== numRecipeId);
      
      console.log(`RecipeIds actualizados: ${JSON.stringify(portfolio.recipeIds)}`);
      
      // Actualizar el portafolio
      const updatedPortfolio = await this.update(numPortfolioId, portfolio);
      
      // Actualizar la receta para quitar la referencia al portafolio
      recipe.portfolioId = null;
      await this.recipeService.update(numRecipeId, recipe);
      
      const portfolioInstance = new Portfolio(updatedPortfolio);
      
      // Actualizar el estado local
      const index = portfolios.value.findIndex(p => p.id === numPortfolioId);
      if (index !== -1) {
        portfolios.value[index] = portfolioInstance;
      }
      
      if (currentPortfolio.value?.id === numPortfolioId) {
        // Recargar el portafolio actual para obtener las recetas actualizadas
        await this.getPortfolioById(numPortfolioId);
      }
      
      return portfolioInstance;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al eliminar la receta ${recipeId} del portafolio ${portfolioId}:`, err);
      throw err;
    }
  }
} 