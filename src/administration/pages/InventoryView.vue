<template>
  <div class="inventory-view">
    <CuppingHeader />
    <div class="breadcrumb">
      {{ $t('breadcrumb.home') }} > <strong>{{ $t('breadcrumb.inventory') }}</strong>
    </div>

    <div class="stock-panels">
      <div class="stock-card">
        <h2>{{ $t('inventory.greenCoffee') }}</h2>
        <div class="dropdown">{{ $t('inventory.typica') }}</div>
        <div class="details">
          <p>{{ $t('inventory.total') }}: <strong>10kg</strong> <span class="low-stock">({{ $t('inventory.lowStock') }})</span></p>
          <p>{{ $t('inventory.activeLots') }}: <strong>5</strong></p>
          <p>{{ $t('inventory.suppliers') }}: <strong>3</strong></p>
        </div>
        <Button class="consume-btn" :label="$t('inventory.registerConsumption')" @click="openModal('verde')" />
      </div>

      <div class="stock-card">
        <h2>{{ $t('inventory.roastedCoffee') }}</h2>
        <div class="dropdown">{{ $t('inventory.typica') }}</div>
        <div class="details">
          <p>{{ $t('inventory.total') }}: <strong>25kg</strong> <span class="ok-stock">({{ $t('inventory.okStock') }})</span></p>
          <p>{{ $t('inventory.types') }}: <strong>Espresso, Filtro</strong></p>
          <p>{{ $t('inventory.suppliers') }}: <strong>4</strong></p>
        </div>
        <Button class="consume-btn" :label="$t('inventory.registerConsumption')" @click="openModal('tostado')" />
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
import { ref, onMounted, onUnmounted } from 'vue'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import CuppingHeader from '../../shared/components/CuppingHeader.vue'
import RegisterConsumptionModal from '../components/RegisterConsumptionModal.vue'
import api from '../../shared/services/api'

const movimientos = ref([])
const modalVisible = ref(false)
const modalTipo = ref('verde')
const lotes = ref(['Lote A', 'Lote B', 'Lote C'])

function openModal(tipo) {
  modalTipo.value = tipo
  modalVisible.value = true
}

async function cargarMovimientos() {
  const response = await api.get('/movimientosInventario');
  movimientos.value = response.data;
}

async function registrarMovimiento(data) {
  const nuevoMovimiento = {
    id: Date.now(),
    ...data
  };
  await api.post('/movimientosInventario', nuevoMovimiento);
  await cargarMovimientos();
}

onMounted(() => {
  document.body.classList.add('cupping-mode')
  cargarMovimientos()
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
