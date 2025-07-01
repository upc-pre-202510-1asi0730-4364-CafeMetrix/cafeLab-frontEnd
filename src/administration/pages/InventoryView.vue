<template>
  <div class="inventory-view">
    <HeaderBar />
    <div class="breadcrumb">
      {{ $t('breadcrumb.home') }} > <strong>{{ $t('breadcrumb.inventory') }}</strong>
    </div>

    <div class="stock-panels">
      <div class="stock-card">
        <h2>{{ $t('inventory.greenCoffee') }}</h2>
        <select v-model="tipoCafeVerdeSeleccionado" class="dropdown">
          <option value="" disabled>Selecciona tipo de café</option>
          <option v-for="tipo in tiposCafeVerde" :key="tipo" :value="tipo">{{ tipo }}</option>
        </select>
        <div class="details">
          <p>{{ $t('inventory.total') }}: <strong>{{ totalKgVerde }}kg</strong> <span class="low-stock" v-if="totalKgVerde < 15">({{ $t('inventory.lowStock') }})</span><span class="ok-stock" v-else>({{ $t('inventory.okStock') }})</span></p>
          <p>{{ $t('inventory.activeLots') }}: <strong>{{ activeLotsVerde }}</strong></p>
          <p>{{ $t('inventory.suppliers') }}: <strong>{{ uniqueSuppliersVerde }}</strong></p>
        </div>
        <Button class="consume-btn" :label="$t('inventory.registerConsumption')" @click="openModal('verde')" :disabled="!tipoCafeVerdeSeleccionado" />
      </div>

      <div class="stock-card">
        <h2>{{ $t('inventory.roastedCoffee') }}</h2>
        <select v-model="tipoCafeTostadoSeleccionado" class="dropdown">
          <option value="" disabled>Selecciona tipo de café</option>
          <option v-for="tipo in tiposCafeTostado" :key="tipo" :value="tipo">{{ tipo }}</option>
        </select>
        <div class="details">
          <p>{{ $t('inventory.total') }}: <strong>{{ totalKgTostado }}kg</strong> <span class="low-stock" v-if="totalKgTostado < 15">({{ $t('inventory.lowStock') }})</span><span class="ok-stock" v-else>({{ $t('inventory.okStock') }})</span></p>
          <p>{{ $t('inventory.activeLots') }}: <strong>{{ activeLotsTostado }}</strong></p>
          <p>{{ $t('inventory.suppliers') }}: <strong>{{ uniqueSuppliersTostado }}</strong></p>
        </div>
        <Button class="consume-btn" :label="$t('inventory.registerConsumption')" @click="openModal('tostado')" :disabled="!tipoCafeTostadoSeleccionado" />
      </div>
    </div>

    <h3 class="recent-title">{{ $t('inventory.recentMovements') }}</h3>
    <DataTable :value="movimientos" class="inventory-table">
      <Column field="fecha" :header="$t('inventory.date')" />
      <Column field="producto" :header="$t('inventory.product')" />
      <Column field="lote" :header="$t('inventory.lot')" />
      <Column field="cantidad" :header="$t('inventory.amount')" />
    </DataTable>

    <RegisterConsumptionModal
      v-model:visible="modalVisible"
      :tipoCafe="modalTipo"
      :lotes="lotes"
      @registrado="registrarMovimiento"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import HeaderBar from "../../public/components/headerBar.vue";
import RegisterConsumptionModal from '../components/RegisterConsumptionModal.vue'
import api from '../../shared/services/api'
import { useAuthService } from '../../auth/services/authService.js'
import { coffeeLotService } from '../../coffee-lot/services/coffeeLotService.js'

const { getCurrentUserId } = useAuthService();

const movimientos = ref([])
const modalVisible = ref(false)
const modalTipo = ref('verde')
const lotes = ref([])
const lotesUsuario = ref([])
const tipoCafeVerdeSeleccionado = ref('')
const tipoCafeTostadoSeleccionado = ref('')

const tiposCafeVerde = computed(() => {
  const tipos = lotesUsuario.value
    .filter(l => l.processing_method && l.coffee_type && l.processing_method.trim().toLowerCase().includes('verde'))
    .map(l => l.coffee_type)
    .filter(Boolean)
  return [...new Set(tipos)]
})
const tiposCafeTostado = computed(() => {
  const tipos = lotesUsuario.value
    .filter(l => l.processing_method && l.coffee_type && l.processing_method.trim().toLowerCase() === 'tostado')
    .map(l => l.coffee_type)
    .filter(Boolean)
  return [...new Set(tipos)]
})

const lotesVerdeFiltrados = computed(() => {
  return lotesUsuario.value.filter(
    l => l.processing_method && l.coffee_type &&
    l.processing_method.trim().toLowerCase().includes('verde') &&
    l.coffee_type === tipoCafeVerdeSeleccionado.value
  )
})
const lotesTostadoFiltrados = computed(() => {
  return lotesUsuario.value.filter(l => l.processing_method && l.coffee_type && l.processing_method.trim().toLowerCase() === 'tostado' && l.coffee_type === tipoCafeTostadoSeleccionado.value)
})

const totalKgVerde = computed(() => {
  return lotesVerdeFiltrados.value.reduce((sum, l) => sum + (parseFloat(l.weight) || 0), 0)
})
const totalKgTostado = computed(() => {
  return lotesTostadoFiltrados.value.reduce((sum, l) => sum + (parseFloat(l.weight) || 0), 0)
})

const activeLotsVerde = computed(() => lotesVerdeFiltrados.value.length)
const activeLotsTostado = computed(() => lotesTostadoFiltrados.value.length)

const uniqueSuppliersVerde = computed(() => {
  const suppliers = lotesVerdeFiltrados.value.map(l => l.supplier_id).filter(Boolean)
  return [...new Set(suppliers)].length
})
const uniqueSuppliersTostado = computed(() => {
  const suppliers = lotesTostadoFiltrados.value.map(l => l.supplier_id).filter(Boolean)
  return [...new Set(suppliers)].length
})

function openModal(tipo) {
  if (tipo === 'verde') {
    lotes.value = lotesVerdeFiltrados.value
  } else {
    lotes.value = lotesTostadoFiltrados.value
  }
  modalTipo.value = tipo
  modalVisible.value = true
}

async function cargarMovimientos() {
  const userId = getCurrentUserId();
  const response = await api.get(`/movimientosInventario?user_id=${userId}`);
  movimientos.value = response.data;
}

async function cargarLotesUsuario() {
  lotesUsuario.value = await coffeeLotService.getLots() || []
}

async function registrarMovimiento(data) {
  const loteId = data.lote; // id del lote seleccionado
  const cantidadConsumida = parseFloat(data.cantidad);

  // 1. Obtener el lote actual
  const lote = lotesUsuario.value.find(l => l.id == loteId);
  if (!lote) return;

  // 2. Detectar el campo de stock
  let stockField = 'weight';
  if (lote.stock_kg !== undefined) stockField = 'stock_kg';

  // 3. Calcular el nuevo stock
  const nuevoStock = (parseFloat(lote[stockField]) || 0) - cantidadConsumida;

  // 4. Detectar el endpoint de lotes
  // Si el endpoint es /lots/, /coffee-lots/ o /lotes/, prueba en orden
  let updateResp = null;
  let updateError = null;
  const endpoints = [`/lots/${loteId}`, `/coffee-lots/${loteId}`, `/lotes/${loteId}`];
  for (const endpoint of endpoints) {
    try {
      updateResp = await api.put(endpoint, { ...lote, [stockField]: nuevoStock });
      if (updateResp && updateResp.data) break;
    } catch (err) {
      updateError = err;
    }
  }
  if (!updateResp || !updateResp.data) {
    alert('No se pudo actualizar el stock del lote. Verifica el endpoint y el campo de stock.');
    if (updateError) console.error(updateError);
    return;
  }

  // 5. Registrar el movimiento como ya lo haces
  const nuevoMovimiento = {
    id: Date.now(),
    ...data,
    user_id: getCurrentUserId()
  };
  await api.post('/movimientosInventario', nuevoMovimiento);

  // 6. Recargar los lotes y movimientos
  await cargarMovimientos();
  await cargarLotesUsuario();
}

onMounted(() => {
  document.body.classList.add('cupping-mode')
  cargarMovimientos()
  cargarLotesUsuario().then(() => {
    console.log('Lotes cargados:', lotesUsuario.value)
  })
})
onUnmounted(() => {
  document.body.classList.remove('cupping-mode')
})
</script>

<style scoped>
.inventory-view {
  background-color: #F8F7F2;
  min-height: 100vh;
  padding: 40px;
  font-family: 'Inter', sans-serif;
}
.breadcrumb {
  font-size: 16px;
  margin-bottom: 30px;
  color: #333;
  margin-top: 80px;
}
.stock-panels {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 40px;
}
.stock-card {
  flex: 1;
  min-width: 320px;
  background-color: #94b2ac;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  color: #111;
}
.stock-card h2 {
  text-align: center;
  margin-bottom: 12px;
}
.dropdown {
  background: white;
  padding: 10px;
  text-align: center;
  border-radius: 6px;
  margin-bottom: 16px;
}
.details p {
  margin: 8px 0;
}
.low-stock {
  color: red;
}
.ok-stock {
  color: green;
}
.consume-btn {
  background-color: #414733;
  color: white;
  margin-top: 15px;
  width: 100%;
  border-radius: 20px;
}
.recent-title {
  font-size: 18px;
  margin-bottom: 12px;
}
.inventory-table {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}
</style>
