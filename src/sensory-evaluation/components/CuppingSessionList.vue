<template>
  <div class="cupping-view">
    <CuppingHeader />

    <div class="breadcrumb">
      {{ $t('breadcrumb.home') }} &gt; <strong>{{ $t('cupping.sessions') }}</strong>
    </div>

    <div class="cupping-container">
      <div class="top-bar">
        <div class="search-group">
          <input v-model="searchTerm" :placeholder="$t('cupping.searchByName')" class="search-input" />
          <Button icon="pi pi-filter" class="filter-btn" @click="filterModalVisible = true" />
        </div>
        <div class="action-buttons">
          <Button :label="$t('cupping.compareMultiple')" class="compare-btn" @click="compareSessions" />
        </div>
      </div>

      <DataTable
          v-model:selection="selectedSessions"
          :value="filteredSessions"
          class="cupping-table"
          @row-click="handleRowClick"
          rowHover
          dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle="width: 3em" />
        <Column field="name" :header="$t('cupping.name')" />
        <Column field="date" :header="$t('cupping.date')" />
        <Column field="origin" :header="$t('cupping.origin')" />
        <Column field="variety" :header="$t('cupping.variety')" />
        <Column
            :header="$t('cupping.actions')"
            bodyStyle="text-align:center"
            :body="(_, props) => actionTemplate(props.data)"
        />
      </DataTable>

      <div class="actions">
        <NewCuppingButton @create="handleNewCuppingCreated" />
      </div>
    </div>
  </div>

  <CuppingFilterModal v-model="filterModalVisible" @apply-filters="handleFilterApply" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { useRouter } from 'vue-router'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import CuppingHeader from '../../shared/components/CuppingHeader.vue'
import CuppingFilterModal from '../../shared/components/CuppingFilterModal.vue'
import NewCuppingButton from '../components/NewCuppingButton.vue'

const router = useRouter()
const filterModalVisible = ref(false)
const cuppingSessions = ref([])
const appliedFilters = ref(null)
const searchTerm = ref('')
const selectedSessions = ref([])

const filteredSessions = computed(() => {
  return cuppingSessions.value.filter((s) => {
    const matchName = s.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchOrigin = !appliedFilters.value?.origin || s.origin === appliedFilters.value.origin
    const matchVariety = !appliedFilters.value?.variety || s.variety === appliedFilters.value.variety
    const matchProcess = !appliedFilters.value?.process || s.process === appliedFilters.value.process
    const matchDate = !appliedFilters.value?.date || s.date === appliedFilters.value.date
    return matchName && matchOrigin && matchVariety && matchProcess && matchDate
  })
})

const handleFilterApply = (filters) => {
  appliedFilters.value = filters
  filterModalVisible.value = false
}

const handleNewCuppingCreated = (newSession) => {
  cuppingSessions.value.push({
    id: cuppingSessions.value.length + 1,
    name: newSession.name,
    date: new Date().toISOString().split('T')[0],
    origin: newSession.lot,
    variety: newSession.profile,
    process: 'N/A',
    lot: newSession.lot,
    profile: newSession.profile,
    ratings: newSession.ratings || null
  })
  localStorage.setItem('cuppingSessions', JSON.stringify(cuppingSessions.value))
}

const handleRowClick = (event) => {
  router.push(`/cata/${event.data.id}`)
}

const compareSessions = () => {
  if (selectedSessions.value.length >= 2) {
    const ids = selectedSessions.value.map(s => s.id).join(',')
    router.push(`/comparar-catas/${ids}`)
  } else {
    alert('Selecciona al menos dos sesiones para comparar.')
  }
}

const actionTemplate = (session) => {
  return h('div', { class: 'flex gap-2 justify-center' }, [
    h(Button, {
      icon: 'pi pi-star',
      class: 'p-button-text p-button-sm',
      title: 'Marcar como destacada'
    }),
    h(Button, {
      icon: 'pi pi-search',
      class: 'p-button-text p-button-sm',
      title: 'Ver detalles',
      onClick: () => router.push({ name: 'cupping-detail', params: { id: session.id } })
    })
  ])
}

onMounted(() => {
  document.body.classList.add('cupping-mode')
  const stored = localStorage.getItem('cuppingSessions')
  if (stored) {
    cuppingSessions.value = JSON.parse(stored)
  } else {
    cuppingSessions.value = [
      {
        id: 1,
        name: 'Cata Andina',
        date: '2024-05-01',
        origin: 'Perú',
        variety: 'Typica',
        process: 'Lavado',
        lot: 'Lote A',
        profile: 'Cafe ABC',
        ratings: { fragancia: 6, cuerpo: 7, acidez: 5, dulzura: 6, amargor: 4, aftertaste: 5 }
      },
      {
        id: 2,
        name: 'Altura Cusco',
        date: '2024-05-02',
        origin: 'Cusco',
        variety: 'Caturra',
        process: 'Honey',
        lot: 'Lote B',
        profile: 'Cafe XYZ',
        ratings: { fragancia: 7, cuerpo: 5, acidez: 6, dulzura: 5, amargor: 6, aftertaste: 4 }
      },
      {
        id: 3,
        name: 'Valle del Café',
        date: '2024-05-03',
        origin: 'Jaén',
        variety: 'Bourbon',
        process: 'Lavado',
        lot: 'Lote C',
        profile: 'Cafe 123',
        ratings: { fragancia: 8, cuerpo: 6, acidez: 7, dulzura: 7, amargor: 3, aftertaste: 5 }
      },
      {
        id: 4,
        name: 'Flor de Cata',
        date: '2024-05-04',
        origin: 'Chanchamayo',
        variety: 'Geisha',
        process: 'Natural',
        lot: 'Lote D',
        profile: 'Cafe Premium',
        ratings: { fragancia: 6, cuerpo: 6, acidez: 6, dulzura: 6, amargor: 6, aftertaste: 6 }
      }
    ]
    localStorage.setItem('cuppingSessions', JSON.stringify(cuppingSessions.value))
  }
})

onUnmounted(() => {
  document.body.classList.remove('cupping-mode')
})
</script>

<style>
.cupping-view {
  background-color: #F8F7F2;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

.cupping-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 60px 20px 40px;
}

.breadcrumb {
  text-align: center;
  font-size: 16px;
  margin-top: 20px;
  color: #333;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0 20px;
  gap: 10px;
  flex-wrap: wrap;
}

.search-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 260px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  flex: 1;
  max-width: 350px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.filter-btn,
.compare-btn {
  background-color: #414733;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.2rem;
  font-size: 14px;
  font-weight: 500;
}

.compare-btn {
  white-space: nowrap;
}

.start-btn {
  background-color: #414733;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.cupping-table {
  margin: 0 auto;
  border-collapse: collapse;
  width: 100%;
  max-width: 900px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
}

.p-datatable .p-datatable-thead > tr > th {
  background-color: #688b84;
  color: white;
  border: none;
}

.p-datatable .p-datatable-tbody > tr > td {
  background-color: white;
  color: #333;
  border: none;
}

.actions {
  margin-top: 20px;
  text-align: center;
}

.p-datatable-tbody > tr {
  cursor: pointer;
}

.p-datatable-tbody > tr:hover {
  background-color: #f0f0f0;
}
</style>
