<template>
  <div class="defect-details">
    <!-- Agregar HeaderBar (CuppingHeader.vue) -->
    <HeaderBar />

    <div class="defect-card">
      <h2>Ficha de defecto</h2>
      <div class="defect-info">
        <div class="causes-block">
          <span class="block-title">Causas probables</span>
          <div class="block-content">{{ defect.causas || defect.description || 'No disponible' }}</div>
        </div>
        <div class="solutions-block">
          <span class="block-title">Soluciones recomendadas</span>
          <div class="block-content">{{ defect.soluciones || defect.solution || 'No disponible' }}</div>
        </div>
      </div>
      <button @click="closeDetails" class="close-btn">Cerrar</button>
    </div>
  </div>
</template>

<script>
// Importa HeaderBar (CuppingHeader.vue)
import HeaderBar from '../../shared/components/CuppingHeader.vue';
import { getDefectById } from '../service';

export default {
  components: {
    HeaderBar, // Registra el componente HeaderBar
  },
  data() {
    return {
      defect: {}, // Contendrá los detalles del defecto
    };
  },
  async created() {
    // Obtener el ID del defecto desde la URL
    const defectId = this.$route.params.defectId;
    if (defectId) {
      try {
        const response = await getDefectById(defectId);
        this.defect = response.data;
      } catch (error) {
        console.error('Error al cargar el defecto:', error);
      }
    }
  },
  methods: {
    closeDetails() {
      // Redirigir a la página anterior o de defectos
      this.$router.push('/defects');
    },
  },
};
</script>

<style scoped>
.defect-details {
  padding: 20px;
  background-color: #F8F7F2;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  color: #414535;
}

.defect-card {
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.defect-info {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 30px;
  margin-bottom: 30px;
}

.causes-block, .solutions-block {
  flex: 1;
  background: #f5f5f5;
  border-radius: 20px;
  margin: 0 20px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 180px;
}

.block-title {
  font-size: 1.3em;
  font-weight: 500;
  margin-bottom: 20px;
}

.block-content {
  font-size: 1.1em;
  color: #414535;
  text-align: center;
}

.close-btn {
  background-color: #414535;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

.close-btn:hover {
  background-color: #3c3f31;
}
</style>
