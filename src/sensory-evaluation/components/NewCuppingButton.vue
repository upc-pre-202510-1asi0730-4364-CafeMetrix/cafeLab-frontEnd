<template>
  <div>
    <!-- Botón que abre el modal -->
    <Button
        label="Iniciar una nueva cata"
        class="start-btn"
        @click="visible = true"
    />

    <!-- Modal que contiene el formulario -->
    <NuevaCataModal
        v-model:visible="visible"
        @create="emitNewCupping"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import NuevaCataModal from './NuevaCataModal.vue'

// Emitimos hacia el componente padre (CuppingSessionList.vue)
const emit = defineEmits(['create'])

const visible = ref(false)

// Se llama cuando el modal crea una nueva cata
const emitNewCupping = (data) => {
  emit('create', data)
  visible.value = false // cerrar modal después de crear
}
</script>

<style scoped>
.start-btn {
  background-color: #414733;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}
</style>
