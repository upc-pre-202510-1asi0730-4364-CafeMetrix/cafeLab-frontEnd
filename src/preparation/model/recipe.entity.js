/**
 * Recipe Entity
 * Representa una receta de bebida
 */
export class Recipe {
  /**
   * Crea una instancia de Recipe
   * @param {Object} data - Los datos de la receta
   * @param {number} data.id - ID único de la receta
   * @param {number} data.userId - ID del usuario que creó la receta
   * @param {string} data.name - Nombre de la receta
   * @param {string} data.imageUrl - URL de la imagen de la receta
   * @param {string} data.extractionMethod - Método de extracción
   * @param {string} data.ratio - Ratio de la receta
   * @param {number} data.cuppingSessionId - ID de la sesión de cata
   * @param {number} data.portfolioId - ID del portafolio al que pertenece
   * @param {number} data.preparationTime - Tiempo de preparación en minutos
   * @param {string} data.steps - Pasos de preparación
   * @param {string} data.tips - Consejos adicionales
   * @param {string} data.cupping - Notas de cata
   * @param {string} data.grindSize - Tamaño de molienda
   * @param {Date} data.createdAt - Fecha de creación
   * @param {Array} data.ingredients - Lista de ingredientes
   */
  constructor(data) {
    this.id = data.id;
    this.userId = data.userId;
    this.name = data.name;
    this.imageUrl = data.imageUrl || data.image_url;
    this.extractionMethod = data.extractionMethod || data.extraction_method;
    this.ratio = data.ratio;
    this.cuppingSessionId = data.cuppingSessionId || data.cupping_session_id;
    this.portfolioId = data.portfolioId || data.portfolio_id ? Number(data.portfolioId || data.portfolio_id) : null;
    this.preparationTime = data.preparationTime || data.preparation_time;
    this.steps = data.steps;
    this.tips = data.tips;
    this.cupping = data.cupping;
    this.grindSize = data.grindSize || data.grind_size;
    this.createdAt = data.createdAt || data.created_at;
    this.ingredients = Array.isArray(data.ingredients) ? data.ingredients : [];
  }

  /**
   * Validar la entidad
   * @returns {boolean} - True si la entidad es válida
   * @throws {Error} - Si la entidad no es válida
   */
  validate() {
    if (!this.name || this.name.trim() === '') {
      throw new Error('El nombre de la receta es obligatorio');
    }
    
    if (!this.userId) {
      throw new Error('El ID de usuario es obligatorio');
    }
    
    return true;
  }

  /**
   * Serializar la entidad para enviarla a la API
   * @returns {Object} - Objeto serializado
   */
  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      imageUrl: this.imageUrl,
      extractionMethod: this.extractionMethod,
      ratio: this.ratio,
      cuppingSessionId: this.cuppingSessionId,
      portfolioId: this.portfolioId,
      preparationTime: this.preparationTime,
      steps: this.steps,
      tips: this.tips,
      cupping: this.cupping,
      grindSize: this.grindSize,
      createdAt: this.createdAt,
      ingredients: this.ingredients
    };
  }

  /**
   * Asignar a un portafolio
   * @param {number} portfolioId - ID del portafolio
   */
  assignToPortfolio(portfolioId) {
    this.portfolioId = portfolioId ? Number(portfolioId) : null;
  }

  /**
   * Remueve la receta de cualquier portafolio
   */
  removeFromPortfolio() {
    this.portfolioId = null;
  }

  /**
   * Verifica si la receta está en un portafolio
   * @returns {boolean} True si está asignada a un portafolio
   */
  isInPortfolio() {
    return this.portfolioId !== null;
  }

  /**
   * Añade un ingrediente a la receta
   * @param {string} name - Nombre del ingrediente
   * @param {number} amount - Cantidad del ingrediente
   * @param {string} unit - Unidad de medida
   */
  addIngredient(name, amount, unit) {
    this.ingredients.push({ name, amount, unit });
  }

  /**
   * Elimina un ingrediente de la receta
   * @param {number} index - Índice del ingrediente a eliminar
   */
  removeIngredient(index) {
    if (index >= 0 && index < this.ingredients.length) {
      this.ingredients.splice(index, 1);
    }
  }
} 