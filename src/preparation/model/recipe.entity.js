/**
 * Recipe Entity
 * Representa una receta de bebida
 */
export class Recipe {
  /**
   * Crea una instancia de Recipe
   * @param {Object} data - Los datos de la receta
   * @param {number} data.id - ID único de la receta
   * @param {string} data.name - Nombre de la receta
   * @param {string} data.image - URL de la imagen de la receta
   * @param {number|null} data.portfolioId - ID del portafolio al que pertenece (o null)
   * @param {string} data.preparationTime - Tiempo de preparación
   * @param {Array} data.ingredients - Ingredientes de la receta
   * @param {Array<string>} data.steps - Pasos de preparación
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.image = data.image;
    this.portfolioId = data.portfolioId;
    this.preparationTime = data.preparationTime || '';
    this.ingredients = data.ingredients || [];
    
    // Procesar los pasos de preparación
    if (Array.isArray(data.steps)) {
      this.steps = data.steps;
    } else if (typeof data.steps === 'string') {
      this.steps = data.steps.split('\n').map(step => step.trim()).filter(step => step.length > 0);
    } else {
      this.steps = [];
    }
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
    
    return true;
  }

  /**
   * Serializar la entidad para enviarla a la API
   * @returns {Object} - Objeto serializado
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      image: this.image,
      portfolioId: this.portfolioId,
      preparationTime: this.preparationTime,
      ingredients: this.ingredients,
      steps: Array.isArray(this.steps) ? this.steps : []
    };
  }

  /**
   * Asignar a un portafolio
   * @param {number} portfolioId - ID del portafolio
   */
  assignToPortfolio(portfolioId) {
    this.portfolioId = portfolioId;
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
   * Añadir un ingrediente
   * @param {string} name - Nombre del ingrediente
   * @param {string} quantity - Cantidad
   * @param {string} unit - Unidad de medida
   */
  addIngredient(name, quantity, unit) {
    this.ingredients.push({ name, quantity, unit });
  }

  /**
   * Añadir un paso de preparación
   * @param {string} step - Instrucción del paso
   */
  addStep(step) {
    if (typeof step === 'string' && step.trim().length > 0) {
      this.steps.push(step.trim());
    }
  }
} 