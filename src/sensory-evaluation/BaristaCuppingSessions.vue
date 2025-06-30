<template>
  <div class="cupping-view">
    <headerBar />
    <div class="cupping-container">
      <h2 style="color:#333;">Sesiones de Cata (Barista)</h2>
      <pv-button label="Crear nueva sesión de cata" class="start-btn" @click="showModal = true" />
      <pv-data-table :value="sessions" class="cupping-table" @row-click="onRowClick">
        <pv-column field="name" header="Nombre" />
        <pv-column field="profile" header="Perfil de tueste" />
        <pv-column field="date" header="Fecha" />
      </pv-data-table>
      <NuevaCataBaristaModal :visible="showModal" @update:visible="showModal = $event" @create="addSession" />
      <pv-dialog v-model:visible="showDetail" modal header="Detalle de Cata" :style="{ width: '900px' }">
        <div class="detail-modal">
          <div class="curve-section">
            <h3>Curva de proceso de tostado:</h3>
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/7a/Roasting_profile_example.png" alt="Curva de tueste simulada" class="curve-img" />
          </div>
          <div class="sensory-section">
            <div class="radar-wrapper">
              <RadarChart :ratings="selectedRadar" />
            </div>
          </div>
        </div>
      </pv-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import headerBar from '../public/components/headerBar.vue'
import NuevaCataBaristaModal from './components/NuevaCataBaristaModal.vue'
import RadarChart from '../shared/components/RadarChart.vue'
import {
  getBaristaCuppingSessions,
  saveBaristaCuppingSession
} from './services/baristaCuppingService.js'

const showModal = ref(false)
const showDetail = ref(false)
const selectedRadar = ref({})
const sessions = ref([])

const radarByProfile = {
  'Café ABC': { fragancia: 7, sabor: 8, acidez: 6, cuerpo: 7, balance: 8, postgusto: 7 },
  'Café XYZ': { fragancia: 5, sabor: 6, acidez: 7, cuerpo: 5, balance: 6, postgusto: 5 },
  'Café 123': { fragancia: 8, sabor: 7, acidez: 8, cuerpo: 8, balance: 7, postgusto: 8 },
  'Café DEF': { fragancia: 6, sabor: 5, acidez: 6, cuerpo: 6, balance: 5, postgusto: 6 }
}

onMounted(async () => {
  sessions.value = await getBaristaCuppingSessions()
})

const addSession = async (session) => {
  const newSession = {
    ...session,
    date: new Date().toISOString().split('T')[0]
  }
  const saved = await saveBaristaCuppingSession(newSession)
  sessions.value.push(saved)
}

const onRowClick = (event) => {
  const row = event.data
  selectedRadar.value = radarByProfile[row.profile] || radarByProfile['Café ABC']
  showDetail.value = true
}
</script>

<style scoped>
.cupping-view {
  background-color: #F8F7F2;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}
.cupping-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 60px 20px 40px;
  text-align: center;
}
.start-btn {
  background-color: #414733;
  color: white;
  border: none;
  padding: 12px 18px;
  border-radius: 20px;
  font-weight: 500;
  margin: 20px 0;
}
.cupping-table {
  margin-top: 30px;
  background: #fff;
  border-radius: 8px;
  color: #222;
}
:deep(.p-datatable .p-datatable-tbody > tr > td) {
  color: #222;
}
.detail-modal {
  display: flex;
  gap: 32px;
  align-items: flex-start;
  justify-content: center;
}
.curve-section {
  flex: 1;
  text-align: left;
}
.curve-img {
  width: 100%;
  max-width: 400px;
  border-radius: 8px;
  margin-top: 12px;
}
.sensory-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.radar-wrapper {
  width: 350px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(canvas) {
  width: 350px !important;
  height: 350px !important;
}
</style> 