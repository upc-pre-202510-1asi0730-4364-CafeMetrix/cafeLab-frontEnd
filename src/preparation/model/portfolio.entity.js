/**
 * Portfolio Entity
 * Representa un portafolio de recetas de café
 */
export class Portfolio {
  /**
   * Crea una instancia de Portfolio
   * @param {Object} data - Los datos del portafolio
   * @param {number} data.id - ID único del portafolio
   * @param {string} data.name - Nombre del portafolio
   * @param {string} data.createdAt - Fecha de creación en formato ISO
   * @param {number[]} data.recipeIds - Lista de IDs de recetas asociadas
   */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.createdAt = data.createdAt;
    this.recipeIds = data.recipeIds || [];
    this.recipes = Array.isArray(data.recipes) ? data.recipes : [];
  }

  /**
   * Validar la entidad
   * @returns {boolean} - True si la entidad es válida
   * @throws {Error} - Si la entidad no es válida
   */
  validate() {
    if (!this.name || this.name.trim() === '') {
      throw new Error('El nombre del portafolio es obligatorio');
    }
    
    return true;
  }

  /**
   * Retorna el portafolio en formato JSON para la API
   * @returns {Object} Objeto para enviar a la API
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      recipeIds: this.recipeIds
    };
  }

  /**
   * Agrega una receta al portafolio
   * @param {number} recipeId - ID de la receta a agregar
   */
  addRecipe(recipeId) {
    if (!this.recipeIds.includes(recipeId)) {
      this.recipeIds.push(recipeId);
    }
  }

  /**
   * Elimina una receta del portafolio
   * @param {number} recipeId - ID de la receta a eliminar
   */
  removeRecipe(recipeId) {
    this.recipeIds = this.recipeIds.filter(id => id !== recipeId);
  }

  /**
   * Valida si el portafolio contiene una receta
   * @param {number} recipeId - ID de la receta a validar
   * @returns {boolean} True si la receta está en el portafolio
   */
  hasRecipe(recipeId) {
    return this.recipeIds.includes(recipeId);
  }
} 