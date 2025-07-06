// Repositorio de dominio para Calibraciones
// Encapsula la lógica de acceso a datos para la entidad Calibration
// Permite obtener, guardar y eliminar calibraciones sin exponer detalles de la API
import { calibrationApi } from '../infrastructure/calibrationApi';

export class CalibrationRepository {
  async getAll(userId) {
    return calibrationApi.fetchCalibrations(userId);
  }
  async save(calibration) {
    return calibrationApi.saveCalibration(calibration);
  }
  async delete(id) {
    return calibrationApi.deleteCalibration(id);
  }
} 