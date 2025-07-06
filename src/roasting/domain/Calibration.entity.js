// Entidad de dominio para Calibraciones
// Define la estructura y propiedades principales de una calibración de molienda
// Se utiliza en la capa de dominio para representar el objeto de negocio puro
export class Calibration {
  constructor({ id, nombre, method, equipment, opening, user_id }) {
    this.id = id;
    this.nombre = nombre;
    this.method = method;
    this.equipment = equipment;
    this.opening = opening;
    this.user_id = user_id;
  }
} 