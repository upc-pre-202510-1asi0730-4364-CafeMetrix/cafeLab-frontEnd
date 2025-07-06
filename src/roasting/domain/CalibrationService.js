// Servicio de dominio para Calibraciones
// Contiene la lógica de negocio y reglas del dominio para calibraciones
// Orquesta las operaciones del repositorio y puede incluir validaciones o procesos adicionales
import { CalibrationRepository } from './CalibrationRepository';

export class CalibrationService {
  constructor() {
    this.repository = new CalibrationRepository();
  }
  async listCalibrations(userId) {
    return this.repository.getAll(userId);
  }
  async addCalibration(calibration) {
    // Aquí puedes agregar lógica de validación de dominio
    return this.repository.save(calibration);
  }
  async removeCalibration(id) {
    return this.repository.delete(id);
  }
} 