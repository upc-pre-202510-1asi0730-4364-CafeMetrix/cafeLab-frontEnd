<template>
  <div class="defect-details">
    <!-- Agregar HeaderBar (CuppingHeader.vue) -->
    <HeaderBar />

    <div class="defect-card">
      <h2>Ficha de defecto</h2>
      <div class="details">
        <p><strong>Café:</strong> {{ defect.cafe }}</p>
        <p><strong>Peso:</strong> {{ defect.peso }} kg</p>
        <p><strong>Porcentaje:</strong> {{ defect.porcentaje }}%</p>
      </div>

      <!-- Causas y soluciones -->
      <div class="additional-info">
        <div class="info-item">
          <h4>Causas probables:</h4>
          <p>{{ defect.causas || 'No disponible' }}</p>
        </div>
        <div class="info-item">
          <h4>Soluciones recomendadas:</h4>
          <p>{{ defect.soluciones || 'No disponible' }}</p>
        </div>
      </div>
    </div>
    <button @click="closeDetails">Cerrar</button>
  </div>
</template>

<script>
// Importa HeaderBar (CuppingHeader.vue)
import HeaderBar from '../../shared/components/CuppingHeader.vue';
import { defectApi } from '../api/defectApi.js';

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
        const response = await defectApi.getById(defectId);
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

.details p {
  margin: 8px 0;
}

.additional-info {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.info-item {
  width: 48%;
}

.info-item h4 {
  font-weight: bold;
  margin-bottom: 5px;
  color: #414535;
}

button {
  background-color: #414535;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}

button:hover {
  background-color: #3c3f31;
}
</style>
