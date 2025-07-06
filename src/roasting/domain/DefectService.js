// Servicio de dominio para Defectos
// Contiene la lógica de negocio y reglas del dominio para defectos
// Orquesta las operaciones del repositorio y puede incluir validaciones o procesos adicionales
import { DefectRepository } from './DefectRepository';

export class DefectService {
  constructor() {
    this.repository = new DefectRepository();
  }
  async listDefects(userId) {
    return this.repository.getAll(userId);
  }
  async getDefect(id) {
    return this.repository.getById(id);
  }
  async addDefect(defect) {
    // Aquí puedes agregar lógica de validación de dominio
    return this.repository.save(defect);
  }
  async updateDefect(id, defect) {
    return this.repository.update(id, defect);
  }
  async removeDefect(id) {
    return this.repository.delete(id);
  }
} 