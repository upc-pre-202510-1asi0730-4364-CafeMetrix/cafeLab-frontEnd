<template>
  <Dialog
      v-model:visible="visible"
      modal
      :closable="true"
      :style="{ width: '40vw' }"
      styleClass="cupping-filter-dialog"
  >
    <div class="filter-header">
      <h2>Filtrar Sesiones de Cata</h2>
    </div>
    <div class="filter-form">
      <div class="form-row">
        <div class="form-group">
          <label>Origen</label>
          <Dropdown v-model="selectedOrigin" :options="origins" placeholder="Seleccione origen" />
        </div>
        <div class="form-group">
          <label>Variedad</label>
          <Dropdown v-model="selectedVariety" :options="varieties" placeholder="Seleccione variedad" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Fecha</label>
          <Calendar v-model="selectedDate" placeholder="DD/MM/AAAA" dateFormat="yy-mm-dd" />
        </div>
        <div class="form-group">
          <label>Procesamiento</label>
          <Dropdown v-model="selectedProcess" :options="processes" placeholder="Seleccione procesamiento" />
        </div>
      </div>
      <div class="filter-actions">
        <Button label="Aplicar Filtro" class="apply-btn" @click="emitFilters" />
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'

const props = defineProps({
  modelValue: Boolean
})
const emit = defineEmits(['update:modelValue', 'apply-filters'])

const visible = ref(props.modelValue)

watch(() => props.modelValue, (val) => (visible.value = val))
watch(visible, (val) => emit('update:modelValue', val))

const origins = ['Perú', 'Cusco', 'Jaén', 'Chanchamayo']
const varieties = ['Typica', 'Caturra', 'Bourbon', 'Geisha']
const processes = ['Lavado', 'Honey', 'Natural']

const selectedOrigin = ref('')
const selectedVariety = ref('')
const selectedDate = ref(null)
const selectedProcess = ref('')

const emitFilters = () => {
  emit('apply-filters', {
    origin: selectedOrigin.value,
    variety: selectedVariety.value,
    date: selectedDate.value,
    process: selectedProcess.value
  })
  visible.value = false
}
</script>

<style scoped>
.cupping-filter-dialog {
  background-color: #F8F7F2 !important;
  border-radius: 12px;
  padding: 24px;
  color: #333;
}

.filter-header h2 {
  color: #414733;
  font-weight: 700;
  font-size: 22px;
  margin-bottom: 24px;
  text-align: center;
}

.filter-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 160px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  margin-bottom: 6px;
}

.apply-btn {
  background-color: #414733;
  color: white;
  border-radius: 20px;
  margin-top: 20px;
  padding: 10px 20px;
}
</style>
