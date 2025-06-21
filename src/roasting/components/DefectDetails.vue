<template>
  <div class="defect-details-modal">
    <div class="defect-card">
      <h2>{{ t('DEFECTS.DETAILS_MODAL_TITLE') }}</h2>
      <div class="defect-info">
        <div class="causes-block">
          <span class="block-title">{{ t('DEFECTS.DETAILS_PROBABLE_CAUSES') }}</span>
          <div class="block-content">{{ defect.causas || t('DEFECTS.NOT_AVAILABLE') }}</div>
        </div>
        <div class="solutions-block">
          <span class="block-title">{{ t('DEFECTS.DETAILS_RECOMMENDED_SOLUTIONS') }}</span>
          <div class="block-content">{{ defect.soluciones || t('DEFECTS.NOT_AVAILABLE') }}</div>
        </div>
      </div>
      <button @click="$emit('close')" class="close-btn">{{ t('DEFECTS.CLOSE_BUTTON') }}</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
