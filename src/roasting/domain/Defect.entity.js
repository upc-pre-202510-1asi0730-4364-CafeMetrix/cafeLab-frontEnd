// Entidad de dominio para Defectos
// Define la estructura y propiedades principales de un defecto de café
// Se utiliza en la capa de dominio para representar el objeto de negocio puro
export class Defect {
  constructor({ id, peso, cafe, defecto, porcentaje, causas, soluciones, user_id }) {
    this.id = id;
    this.peso = peso;
    this.cafe = cafe;
    this.defecto = defecto;
    this.porcentaje = porcentaje;
    this.causas = causas;
    this.soluciones = soluciones;
    this.user_id = user_id;
  }
} 