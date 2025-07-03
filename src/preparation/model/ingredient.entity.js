/**
 * Ingredient Entity
 * Representa un ingrediente de una receta
 */
export class Ingredient {
  /**
   * Crea una instancia de Ingredient
   * @param {Object} data - Los datos del ingrediente
   * @param {number} data.id - ID único del ingrediente
   * @param {number} data.recipeId - ID de la receta a la que pertenece
   * @param {string} data.name - Nombre del ingrediente
   * @param {number} data.amount - Cantidad del ingrediente
   * @param {string} data.unit - Unidad de medida
   */
  constructor(data) {
    this.id = data.id;
    this.recipeId = data.recipeId || data.recipe_id;
    this.name = data.name;
    this.amount = data.amount;
    this.unit = data.unit;
  }

  /**
   * Validar la entidad
   * @returns {boolean} - True si la entidad es válida
   * @throws {Error} - Si la entidad no es válida
   */
  validate() {
    if (!this.name || this.name.trim() === '') {
      throw new Error('El nombre del ingrediente es obligatorio');
    }
    
    if (!this.recipeId) {
      throw new Error('El ID de la receta es obligatorio');
    }
    
    if (this.amount === undefined || this.amount === null) {
      throw new Error('La cantidad es obligatoria');
    }
    
    if (!this.unit || this.unit.trim() === '') {
      throw new Error('La unidad de medida es obligatoria');
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
      recipeId: this.recipeId,
      name: this.name,
      amount: this.amount,
      unit: this.unit
    };
  }
} 