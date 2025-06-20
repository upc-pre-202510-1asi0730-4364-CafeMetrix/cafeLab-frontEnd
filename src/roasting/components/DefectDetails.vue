<template>
  <div class="defect-details-modal">
    <div class="defect-card">
      <h2>Ficha de defecto</h2>
      <div class="defect-info">
        <div class="causes-block">
          <span class="block-title">Causas probables</span>
          <div class="block-content">{{ defect.causas || 'No disponible' }}</div>
        </div>
        <div class="solutions-block">
          <span class="block-title">Soluciones recomendadas</span>
          <div class="block-content">{{ defect.soluciones || 'No disponible' }}</div>
        </div>
      </div>
      <button @click="$emit('close')" class="close-btn">Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  defect: {
    type: Object,
    required: true,
  },
});

defineEmits(['close']);
</script>

<style scoped>
.defect-details-modal {
  padding: 1rem;
  background-color: #F8F7F2;
  border-radius: 15px;
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
  gap: 20px;
}

.causes-block, .solutions-block {
  flex: 1;
  background: #f5f5f5;
  border-radius: 20px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 180px;
  text-align: center;
}

.block-title {
  font-size: 1.3em;
  font-weight: 500;
  margin-bottom: 20px;
}

.block-content {
  font-size: 1.1em;
  color: #414535;
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
