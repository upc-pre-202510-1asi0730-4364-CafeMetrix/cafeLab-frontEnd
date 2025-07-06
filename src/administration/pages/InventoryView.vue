<template>
  <div class="inventory-view">
    <HeaderBar />
    <div class="breadcrumb">
      {{ $t('breadcrumb.home') }} > <strong>{{ $t('breadcrumb.inventory') }}</strong>
    </div>

    <div class="stock-panels">
      <div class="stock-card">
        <h2>{{ $t('inventory.greenCoffee') }}</h2>
        <select class="dropdown" v-model="tipoVerde">
          <option v-for="t in tiposCafe" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
        <div class="details">
          <p>{{ $t('inventory.total') }}: <strong>{{ totalVerde }}kg</strong> <span :class="totalVerde < 15 ? 'low-stock' : 'ok-stock'">({{ totalVerde < 15 ? $t('inventory.lowStock') : $t('inventory.okStock') }})</span></p>
          <p>{{ $t('inventory.activeLots') }}: <strong>{{ lotesActivosVerde }}</strong></p>
          <p>{{ $t('inventory.suppliers') }}: <strong>{{ proveedoresVerde }}</strong></p>
        </div>
        <Button class="consume-btn" :label="$t('inventory.registerConsumption')" @click="openModal('verde')" />
      </div>

      <div class="stock-card">
        <h2>{{ $t('inventory.roastedCoffee') }}</h2>
        <select class="dropdown" v-model="tipoTostado">
          <option v-for="t in tiposCafe" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
        <div class="details">
          <p>{{ $t('inventory.total') }}: <strong>{{ totalTostado }}kg</strong> <span :class="totalTostado < 15 ? 'low-stock' : 'ok-stock'">({{ totalTostado < 15 ? $t('inventory.lowStock') : $t('inventory.okStock') }})</span></p>
          <p>{{ $t('inventory.activeLots') }}: <strong>{{ lotesActivosTostado }}</strong></p>
          <p>{{ $t('inventory.suppliers') }}: <strong>{{ proveedoresTostado }}</strong></p>
        </div>
        <Button class="consume-btn" :label="$t('inventory.registerConsumption')" @click="openModal('tostado')" />
      </div>
    </div>

    <h3 class="recent-title">{{ $t('inventory.recentMovements') }}</h3>
    <DataTable :value="movimientosFiltrados" class="inventory-table">
      <Column field="fecha" :header="$t('inventory.date')" />
      <Column field="producto" :header="$t('inventory.product')" />
      <Column :header="$t('inventory.lot')" :body="getNombreLoteCol" />
      <Column field="cantidad" :header="$t('inventory.amount')" />
    </DataTable>

    <RegisterConsumptionModal
        v-model:visible="modalVisible"
        :tipoCafe="modalTipo"
        :lotes="lotesModal"
        @registrado="registrarMovimiento"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import HeaderBar from "../../public/components/headerBar.vue";
import RegisterConsumptionModal from '../components/RegisterConsumptionModal.vue'
import api from '../../shared/services/api'
import { coffeeLotService } from '../../coffee-lot/services/coffeeLotService.js'

const tiposCafe = [
  { label: 'ArÃ¡bica', value: 'arabica' },
  { label: 'Robusta', value: 'robusta' },
  { label: 'Mezcla', value: 'mezcla' }
]

const tipoVerde = ref('arabica')
const tipoTostado = ref('arabica')
const lotesVerde = ref([])
const lotesTostado = ref([])
const movimientos = ref([])
const modalVisible = ref(false)
const modalTipo = ref('verde')
const lotesModal = ref([])
const currentUser = JSON.parse(localStorage.getItem('currentUser'))
const allLotsRef = ref([])

const proveedoresVerde = computed(() => [...new Set(lotesVerde.value.map(l => l.supplier_id))].length)
const proveedoresTostado = computed(() => [...new Set(lotesTostado.value.map(l => l.supplier_id))].length)
const totalVerde = computed(() => lotesVerde.value.reduce((sum, l) => sum + (Number(l.weight) || 0), 0))
const totalTostado = computed(() => lotesTostado.value.reduce((sum, l) => sum + (Number(l.weight) || 0), 0))

const lotesActivosVerde = computed(() => lotesVerde.value.length)
const lotesActivosTostado = computed(() => lotesTostado.value.length)

const movimientosFiltrados = computed(() => {
  const filtrados = movimientos.value.filter(m =>
      (String(m.userId) === String(currentUser?.id) || String(m.user_id) === String(currentUser?.id)) &&
      (m.tipoCafe === modalTipo.value || m.tipo === modalTipo.value)
  )
  return filtrados
})

watch(tipoVerde, () => {
  cargarLotes();
});
watch(tipoTostado, () => {
  cargarLotes();
});

async function cargarLotes() {
  const allLots = await coffeeLotService.getLots();
  allLotsRef.value = allLots;
  lotesVerde.value = allLots.filter(l =>
      l.processing_method && l.processing_method.toLowerCase().trim() !== 'tostado' &&
      String(l.user_id) === String(currentUser?.id) &&
      l.coffee_type &&
      l.coffee_type.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '') ===
      tipoVerde.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '')
  )
  lotesTostado.value = allLots.filter(l =>
      l.processing_method && l.processing_method.toLowerCase().trim() === 'tostado' &&
      String(l.user_id) === String(currentUser?.id) &&
      l.coffee_type &&
      l.coffee_type.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '') ===
      tipoTostado.value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '')
  )
}

async function cargarMovimientos() {
  const response = await fetch('http://localhost:5129/api/v1/movimientosinventario');
  const data = await response.json();
  movimientos.value = data;
}

function openModal(tipo) {
  modalTipo.value = tipo
  lotesModal.value = tipo === 'verde' ? lotesVerde.value : lotesTostado.value
  modalVisible.value = true
}

async function registrarMovimiento(data) {
  const nuevoMovimiento = {
    id: Date.now(),
    ...data,
    userId: currentUser?.id
  };
  await fetch('http://localhost:5129/api/v1/movimientosinventario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nuevoMovimiento)
  });
  // Descontar cantidad del lote
  const lotes = [...lotesVerde.value, ...lotesTostado.value];
  const lote = lotes.find(l => l.id === data.lote);
  if (lote) {
    const nuevaCantidad = Number(lote.weight) - Number(data.cantidad);
    await api.put(`/coffee-lots/${lote.id}`, { ...lote, weight: nuevaCantidad });
  }
  await cargarLotes();
  await cargarMovimientos();
}

function getNombreLote(id) {
  const lote = allLotsRef.value.find(l => String(l.id) === String(id));
  return lote ? lote.lot_name : id;
}

function getNombreLoteCol(row) {
  return getNombreLote(row.lote);
}

onMounted(async () => {
  document.body.classList.add('cupping-mode')
  await cargarLotes()
  await cargarMovimientos()
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