<template>
  <Dialog
      :visible="visible"
      modal
      header="Nueva sesión de cata"
      :style="{ width: '450px' }"
      @update:visible="$emit('update:visible', $event)"
  >
    <div class="form">
      <span class="p-float-label">
        <InputText v-model="sessionName" id="name" />
        <label for="name">Nombre de la sesión de cata</label>
      </span>
      <span class="p-float-label">
        <InputText v-model="selectedLot" id="lot" />
        <label for="lot">Lote vinculado</label>
      </span>
      <span class="p-float-label">
        <InputText v-model="selectedProfile" id="profile" />
        <label for="profile">Perfil de tueste</label>
      </span>
      <Button label="Crear nueva sesión de cata" class="start-btn" @click="createSession" />
    </div>
  </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'

defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible', 'create'])

const sessionName = ref('')
const selectedLot = ref('')
const selectedProfile = ref('')

const createSession = () => {
  if (!sessionName.value || !selectedLot.value || !selectedProfile.value) return

  emit('create', {
    name: sessionName.value,
    lot: selectedLot.value,
    profile: selectedProfile.value
  })

  // Cerrar el modal después de crear
  emit('update:visible', false)

  // Limpiar campos (opcional)
  sessionName.value = ''
  selectedLot.value = ''
  selectedProfile.value = ''
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}
.p-float-label input {
  width: 100%;
}
.start-btn {
  background-color: #414733;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 20px;
  font-weight: 500;
  margin-top: 10px;
}
</style>
