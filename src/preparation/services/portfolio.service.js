import { Portfolio } from '../model/portfolio.entity';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../../config/api.config';

/**
 * Servicio para gestionar los portafolios
 */
export class PortfolioService {
  constructor() {
    this.apiService = new ApiService();
    this.endpoint = API_ENDPOINTS.portfolios;
    this.recipeEndpoint = API_ENDPOINTS.recipes;
  }
  
  /**
   * Obtiene todos los portafolios
   * @returns {Promise<Portfolio[]>} Lista de portafolios
   */
  async getAllPortfolios() {
    try {
      const portfolios = await this.apiService.get(this.endpoint);
      return portfolios.map(portfolio => new Portfolio(portfolio));
    } catch (error) {
      console.error('Error al obtener portafolios:', error);
      throw error;
    }
  }

  /**
   * Obtiene un portafolio por su ID
   * @param {number} id - ID del portafolio
   * @returns {Promise<Portfolio>} El portafolio encontrado
   */
  async getPortfolioById(id) {
    try {
      // Obtener los datos del portafolio
      const portfolioData = await this.apiService.get(`${this.endpoint}/${id}`);
      
      // Crear el objeto Portfolio
      const portfolio = new Portfolio(portfolioData);
      
      try {
        // Intentar obtener las recetas asociadas a este portafolio
        const recipes = await this.apiService.get(`${this.recipeEndpoint}?portfolioId=${id}`);
        // Asegurarnos de que recipes siempre sea un array, incluso si está vacío
        portfolio.recipes = recipes || [];
      } catch (recipeError) {
        // Si falla al obtener las recetas, establecer un array vacío
        console.warn(`No se pudieron cargar recetas para el portafolio ${id}:`, recipeError);
        portfolio.recipes = [];
      }
      
      return portfolio;
    } catch (error) {
      console.error(`Error al obtener el portafolio ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea un nuevo portafolio
   * @param {Object} portfolioData - Datos del portafolio a crear
   * @returns {Promise<Portfolio>} El portafolio creado
   */
  async createPortfolio(portfolioData) {
    try {
      // Preparar los datos del portafolio
      const newPortfolio = {
        name: portfolioData.name,
        createdAt: new Date().toISOString(),
        recipeIds: portfolioData.recipeIds || []
      };
      
      // Crear el portafolio a través de la API
      const createdPortfolio = await this.apiService.post(this.endpoint, newPortfolio);
      return new Portfolio(createdPortfolio);
    } catch (error) {
      console.error('Error al crear el portafolio:', error);
      throw error;
    }
  }

  /**
   * Actualiza un portafolio existente
   * @param {number} id - ID del portafolio
   * @param {Object} portfolioData - Datos a actualizar
   * @returns {Promise<Portfolio>} El portafolio actualizado
   */
  async updatePortfolio(id, portfolioData) {
    try {
      // Añadir timestamp de actualización
      const updateData = {
        ...portfolioData,
        updatedAt: new Date().toISOString()
      };
      
      // Actualizar el portafolio a través de la API
      const updatedPortfolio = await this.apiService.put(`${this.endpoint}/${id}`, updateData);
      return new Portfolio(updatedPortfolio);
    } catch (error) {
      console.error(`Error al actualizar el portafolio ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un portafolio
   * @param {number} id - ID del portafolio a eliminar
   * @returns {Promise<boolean>} True si se eliminó correctamente
   */
  async deletePortfolio(id) {
    try {
      return await this.apiService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error(`Error al eliminar el portafolio ${id}:`, error);
      throw error;
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
      const portfolio = await this.apiService.get(`${this.endpoint}/${numPortfolioId}`);
      
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
        const updatedPortfolio = await this.apiService.put(`${this.endpoint}/${numPortfolioId}`, portfolio);
        
        // Actualizar la receta para referenciar al portafolio
        const recipe = await this.apiService.get(`${this.recipeEndpoint}/${numRecipeId}`);
        recipe.portfolioId = numPortfolioId;
        await this.apiService.put(`${this.recipeEndpoint}/${numRecipeId}`, recipe);
        
        console.log('Portafolio actualizado:', updatedPortfolio);
        
        return new Portfolio(updatedPortfolio);
      }
      
      return new Portfolio(portfolio);
    } catch (error) {
      console.error(`Error al añadir la receta ${recipeId} al portafolio ${portfolioId}:`, error);
      throw error;
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
      const portfolio = await this.apiService.get(`${this.endpoint}/${numPortfolioId}`);
      
      // Asegurarse de que recipeIds exista y sea un array
      if (!portfolio.recipeIds) {
        portfolio.recipeIds = [];
        return new Portfolio(portfolio);
      }
      
      // Eliminar la receta del portafolio
      portfolio.recipeIds = portfolio.recipeIds.filter(id => Number(id) !== numRecipeId);
      
      console.log(`RecipeIds actualizados: ${JSON.stringify(portfolio.recipeIds)}`);
      
      // Actualizar el portafolio
      const updatedPortfolio = await this.apiService.put(`${this.endpoint}/${numPortfolioId}`, portfolio);
      
      // Actualizar la receta para quitar la referencia al portafolio
      const recipe = await this.apiService.get(`${this.recipeEndpoint}/${numRecipeId}`);
      recipe.portfolioId = null;
      await this.apiService.put(`${this.recipeEndpoint}/${numRecipeId}`, recipe);
      
      console.log('Portafolio actualizado después de eliminar receta:', updatedPortfolio);
      
      return new Portfolio(updatedPortfolio);
    } catch (error) {
      console.error(`Error al eliminar la receta ${recipeId} del portafolio ${portfolioId}:`, error);
      throw error;
    }
  }
} 