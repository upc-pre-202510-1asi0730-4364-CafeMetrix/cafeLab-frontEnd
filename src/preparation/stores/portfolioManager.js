import { ref } from 'vue';
import { PortfolioService } from '../services/portfolio.service';

// Crear instancia del servicio
const portfolioService = new PortfolioService();

// Estado reactivo
const portfolios = ref([]);
const isLoading = ref(false);
const error = ref(null);
const currentPortfolio = ref(null);

/**
 * Gestor de portfolios que proporciona estado reactivo y métodos para manipular portfolios
 */
export const PortfolioManager = {
  // Getters de estado
  getPortfolios: () => portfolios.value,
  getCurrentPortfolio: () => currentPortfolio.value,
  getIsLoading: () => isLoading.value,
  getError: () => error.value,
  
  // Acciones
  async fetchPortfolios() {
    isLoading.value = true;
    error.value = null;
    
    try {
      portfolios.value = await portfolioService.getAllPortfolios();
      return portfolios.value;
    } catch (err) {
      error.value = err.message;
      console.error('Error al cargar portfolios:', err);
    } finally {
      isLoading.value = false;
    }
  },
  
  async fetchPortfolioById(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      currentPortfolio.value = await portfolioService.getPortfolioById(id);
      return currentPortfolio.value;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al cargar el portfolio ${id}:`, err);
    } finally {
      isLoading.value = false;
    }
  },
  
  async createPortfolio(portfolioData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const newPortfolio = await portfolioService.createPortfolio(portfolioData);
      portfolios.value.push(newPortfolio);
      return newPortfolio;
    } catch (err) {
      error.value = err.message;
      console.error('Error al crear el portfolio:', err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  },
  
  async updatePortfolio(id, portfolioData) {
    isLoading.value = true;
    error.value = null;
    
    try {
      const updatedPortfolio = await portfolioService.updatePortfolio(id, portfolioData);
      const index = portfolios.value.findIndex(p => p.id === id);
      
      if (index !== -1) {
        portfolios.value[index] = updatedPortfolio;
      }
      
      if (currentPortfolio.value && currentPortfolio.value.id === id) {
        currentPortfolio.value = updatedPortfolio;
      }
      
      return updatedPortfolio;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al actualizar el portfolio ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  },
  
  async deletePortfolio(id) {
    isLoading.value = true;
    error.value = null;
    
    try {
      await portfolioService.deletePortfolio(id);
      portfolios.value = portfolios.value.filter(p => p.id !== id);
      
      if (currentPortfolio.value && currentPortfolio.value.id === id) {
        currentPortfolio.value = null;
      }
      
      return true;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al eliminar el portfolio ${id}:`, err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  },
  
  async addRecipeToPortfolio(portfolioId, recipeId) {
    try {
      const updatedPortfolio = await portfolioService.addRecipeToPortfolio(portfolioId, recipeId);
      
      const index = portfolios.value.findIndex(p => p.id === portfolioId);
      if (index !== -1) {
        portfolios.value[index] = updatedPortfolio;
      }
      
      if (currentPortfolio.value && currentPortfolio.value.id === portfolioId) {
        currentPortfolio.value = updatedPortfolio;
      }
      
      return updatedPortfolio;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al añadir la receta ${recipeId} al portfolio ${portfolioId}:`, err);
      throw err;
    }
  },
  
  async removeRecipeFromPortfolio(portfolioId, recipeId) {
    try {
      const updatedPortfolio = await portfolioService.removeRecipeFromPortfolio(portfolioId, recipeId);
     
      const index = portfolios.value.findIndex(p => p.id === portfolioId);
      if (index !== -1) {
        portfolios.value[index] = updatedPortfolio;
      }
      
      if (currentPortfolio.value && currentPortfolio.value.id === portfolioId) {
        currentPortfolio.value = updatedPortfolio;
      }
      
      return updatedPortfolio;
    } catch (err) {
      error.value = err.message;
      console.error(`Error al eliminar la receta ${recipeId} del portfolio ${portfolioId}:`, err);
      throw err;
    }
  }
}; 