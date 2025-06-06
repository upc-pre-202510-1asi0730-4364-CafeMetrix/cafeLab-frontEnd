emplate>
  <Dialog v-model:visible="internalVisible" modal :style="{ width: '600px' }">
    <h2>Registrar Consumo</h2>
    <div class="modal-content">
      <div class="form-section">
        <label>Fecha:</label>
        <InputText v-model="form.fecha" type="date" />
        <label>Lote:</label>
        <Dropdown v-model="form.lote" :options="lotes" placeholder="Selecciona lote" />
        <label>Producto Final:</label>
        <InputText v-model="form.producto" placeholder="Ej: Espresso" />
        <label>Cantidad Usada (kg):</label>
        <InputText v-model="form.cantidad" type="number" min="0.1" step="0.1" />
      </div>
      <div class="summary-section">
        <div class="summary-card">
          <strong>Resumen de lote</strong>
          <div style="margin-top: 8px;">Lote {{ form.lote || '-' }} - {{ tipoCafeLabel }}</div>
          <div>Origen: Ayacucho</div>
          <div>Stock restante: 12.5 kg</div>
          <div>Fecha de entrada: 10/04/25</div>
        </div>
        <div class="summary-card">
          <strong>Movimientos Anteriores:</strong>
          <div>21/04: -4Kg Espresso</div>
          <div>21/04: -1.5Kg Cold Brew</div>
        </div>
      </div>
    </div>
    <Button class="register-btn" label="Registrar Consumo" @click="registrar" />
  </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

const props = defineProps({
  visible: Boolean,
  tipoCafe: String, // 'verde' o 'tostado'
  lotes: Array
})
const emit = defineEmits(['registrado', 'update:visible'])

const internalVisible = ref(props.visible)

watch(() => props.visible, (val) => {
  internalVisible.value = val
})

watch(internalVisible, (val) => {
  if (!val) emit('update:visible', false)
})

const form = ref({
  fecha: new Date().toISOString().slice(0, 10),
  lote: '',
  producto: '',
  cantidad: ''
})

const tipoCafeLabel = computed(() => props.tipoCafe === 'verde' ? 'Café Verde' : 'Café Tostado')

watch(() => props.visible, (val) => {
  if (val) {
    form.value = {
      fecha: new Date().toISOString().slice(0, 10),
      lote: '',
      producto: '',
      cantidad: ''
    }
  }
})

function registrar() {
  if (!form.value.fecha || !form.value.lote || !form.value.producto || !form.value.cantidad) return
  emit('registrado', { ...form.value, tipoCafe: props.tipoCafe })
  internalVisible.value = false
}
</script>

<style scoped>
.modal-content {
  display: flex;
  gap: 24px;
  margin-bottom: 18px;
}
.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.summary-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.summary-card {
  background: #94b2ac !important;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 15px;
  color: #222 !important;
}
.register-btn {
  background-color: #fff !important;
  color: #414733 !important;
  margin-top: 10px;
  width: 100%;
  border-radius: 20px !important;
  font-weight: 500;
  font-size: 16px;
  border: 2px solid #414733 !important;
  box-shadow: none !important;
}
:deep(.p-dialog) {
  background: #f8f7f2 !important;
  border-radius: 16px !important;
}
:deep(.p-dialog-content) {
  background: #f8f7f2 !important;
  color: #333 !important;
}
:deep(.p-dialog-header) {
  background: #f8f7f2 !important;
  color: #333 !important;
  border-bottom: none !important;
}
:deep(.p-dialog .p-dialog-header .p-dialog-title) {
  color: #414733 !important;
  font-weight: 700;
}
:deep(.p-dialog-mask) {
  background: rgba(248, 247, 242, 0.95) !important;
}
:deep(.p-dialog-header .p-dialog-header-icon) {
  color: #414733 !important;
  background: #fff !important;
  border: 2px solid #414733 !important;
  border-radius: 50% !important;
  width: 36px !important;
  height: 36px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 22px !important;
  box-shadow: none !important;
  transition: background 0.2s;
}
:deep(.p-dialog-header .p-dialog-header-icon:hover) {
  background: #f8f7f2 !important;
}
input, .p-inputtext, .p-dropdown, .p-dropdown-label {
  background: #fff !important;
  color: #333 !important;
  border-radius: 8px !important;
}
</style> 