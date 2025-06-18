export class Defect {
  constructor({ id, peso, cafe, defecto, porcentaje, causas, soluciones }) {
    this.id = id;
    this.peso = peso;
    this.cafe = cafe;
    this.defecto = defecto;
    this.porcentaje = porcentaje;
    this.causas = causas;
    this.soluciones = soluciones;
  }
}

export class Calibration {
  constructor({ id, nombre, method, equipment, opening }) {
    this.id = id;
    this.nombre = nombre;
    this.method = method;
    this.equipment = equipment;
    this.opening = opening;
  }
}
// Agrega aquí otras entidades SOLO si realmente se usan en el contexto de roasting. 