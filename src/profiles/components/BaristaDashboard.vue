<template>
  <div>
    <HeaderBar />
    <div class="dashboard-container">
      <h1 class="dashboard-title">{{$t('dashboard.currentPlan')}}: {{$t('dashboard.planBarista')}}</h1>
      <div class="features-grid">
        <div class="feature" @click="goToCupping">
          <img src="https://img.icons8.com/ios-filled/100/coffee.png" alt="Sesiones de Cata" />
          <p>{{$t('dashboard.cuppingSessions')}}</p>
        </div>
        <div class="feature" @click="goToDefects">
          <img src="https://img.icons8.com/ios/100/coffee-to-go.png" alt="Librería de Defectos" />
          <p>{{$t('dashboard.defectLibrary')}}</p>
        </div>
        <div class="feature" @click="goToRoasting">
          <img src="https://img.icons8.com/ios/100/smell.png" alt="Correlación Tueste-Sabor" />
          <p>{{$t('dashboard.roastCorrelation')}}<br /></p>
        </div>
        <div class="feature" @click="goToCalibration">
          <img src="https://img.icons8.com/ios/100/coffee-beans.png" alt="Calibración de Molienda" />
          <p>{{$t('dashboard.grindCalibration')}}</p>
        </div>
        <div class="feature" @click="goToRecipes">
          <img src="https://img.icons8.com/ios/100/recipe.png" alt="Recetas" />
          <p>{{$t('dashboard.recipes')}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderBar from '../../public/components/headerBar.vue'
import { useRouter } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'

const router = useRouter()

const goToCupping = () => {
  router.push('/cata') // Ajusta si es necesario
}
const goToDefects = () => {
  router.push('/defects') // Ajusta si es necesario
}
const goToRoasting = () => {
  router.push('/roasting') // Ajusta si es necesario
}
const goToCalibration = () => {
  router.push('/calibration')
}
const goToRecipes = () => {
  router.push('/recetas')
}


onMounted(() => {
  document.body.classList.add('dashboard-bg')
})

onUnmounted(() => {
  document.body.classList.remove('dashboard-bg')
})
</script>

<style scoped>
.dashboard-container {
  padding: 120px 40px 40px;
  text-align: center;
  background-color: #F8F7F2;
  min-height: 100vh;
  box-sizing: border-box;
}

.dashboard-title {
  font-size: 28px;
  margin-bottom: 40px;
  color: #333;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.feature {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.feature:hover {
  transform: scale(1.05);
}

.feature img {
  width: 60px;
  height: 60px;
  margin-bottom: 12px;
}

.feature p {
  font-size: 14px;
  font-weight: 500;
  color: #222;
}

.disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
