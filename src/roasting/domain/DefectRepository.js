// Repositorio de dominio para Defectos
// Encapsula la lógica de acceso a datos para la entidad Defect
// Permite obtener, guardar, actualizar y eliminar defectos sin exponer detalles de la API
import { defectApi } from '../infrastructure/defectApi';

export class DefectRepository {
  async getAll(userId) {
    return defectApi.fetchDefects(userId);
  }
  async getById(id) {
    return defectApi.fetchDefectById(id);
  }
  async save(defect) {
    return defectApi.saveDefect(defect);
  }
  async update(id, defect) {
    return defectApi.updateDefect(id, defect);
  }
  async delete(id) {
    return defectApi.deleteDefect(id);
  }
} 