<template>

  <div class="session-detail">
    <header class="headerBar">
      <headerBar />
    </header>

    <div class="breadcrumb">
      {{ $t('breadcrumb.home') }} > {{ $t('cupping.sessions') }} > <strong>{{ session?.name || $t('cupping.cupping') }}</strong>
    </div>

    <div class="content">
      <div class="panel">
        <h2>{{ $t('cupping.sensoryEvaluation') }}</h2>
        <div v-for="attribute in attributes" :key="attribute" class="slider-group">
          <label>{{ capitalize(attribute) }}</label>
          <Slider v-model="ratings[attribute]" :min="0" :max="10" />
        </div>
        <Button :label="$t('cupping.generateHexagon')" class="action-btn" @click="drawRadarChart" />
        <canvas ref="radarCanvas" width="300" height="300" class="radar-canvas"></canvas>
      </div>

      <div class="info-panel">
        <p><strong>{{ $t('cupping.linkedLot') }}:</strong><br />{{ lotName }}</p>
        <p><strong>{{ $t('cupping.linkedProfile') }}:</strong><br />{{ session?.profile || 'N/A' }}</p>
        <div class="actions">
          <Button :label="$t('cupping.defectLibrary')" class="action-btn" />
          <Button :label="$t('cupping.saveSession')" class="action-btn" @click="saveSession" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Slider from 'primevue/slider'
import Button from 'primevue/button'
import CuppingHeader from '../../shared/components/CuppingHeader.component.vue'
import api from '../../shared/services/api'
import HeaderBar from "../../public/components/headerBar.vue";
import { coffeeLotService } from '../../coffee-lot/services/coffeeLotService.js'

const route = useRoute()
const sessionId = route.params.id

const session = ref({})
const attributes = ['fragancia', 'sabor', 'acidez', 'cuerpo', 'balance', 'postgusto']
const ratings = ref({
  fragancia: 5,
  sabor: 6,
  acidez: 4,
  cuerpo: 7,
  balance: 5,
  postgusto: 6
})

const radarCanvas = ref(null)
const lotName = ref('N/A')

const defaultRatings = {
  fragancia: 5,
  sabor: 5,
  acidez: 5,
  cuerpo: 5,
  balance: 5,
  postgusto: 5
};

onMounted(async () => {
  const response = await api.get(`/cuppingSessions/${sessionId}`);
  session.value = response.data;
  console.log('Detalle de cata cargado:', session.value);

  const coffeeLotId = session.value.coffee_lot_id;

  if (coffeeLotId) {
    try {
      const lot = await coffeeLotService.getLotById(coffeeLotId);
      lotName.value = lot.lot_name || 'N/A';
    } catch {
      lotName.value = 'N/A';
    }
  } else {
    lotName.value = session.value.lot || 'N/A';
  }

  if (response.data.ratings) {
    ratings.value = { ...response.data.ratings };
  }
})

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1)

const drawRadarChart = () => {
  nextTick(() => {
    const canvas = radarCanvas.value
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = 100
    const levels = 5
    const points = attributes.length
    const angleStep = (2 * Math.PI) / points

    // Dibujar niveles
    for (let level = 1; level <= levels; level++) {
      ctx.beginPath()
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep
        const r = (maxRadius * level) / levels
        const x = centerX + r * Math.cos(angle)
        const y = centerY + r * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = '#ccc'
      ctx.stroke()
    }

    // Dibujar ejes y etiquetas
    ctx.font = '12px Inter'
    ctx.fillStyle = '#333'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    for (let i = 0; i < points; i++) {
      const angle = i * angleStep
      const x = centerX + (maxRadius + 15) * Math.cos(angle)
      const y = centerY + (maxRadius + 15) * Math.sin(angle)
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(centerX + maxRadius * Math.cos(angle), centerY + maxRadius * Math.sin(angle))
      ctx.strokeStyle = '#999'
      ctx.stroke()
      ctx.fillText(capitalize(attributes[i]), x, y)
    }

    // Dibujar datos
    ctx.beginPath()
    for (let i = 0; i <= points; i++) {
      const value = ratings.value[attributes[i % points]]
      const angle = i * angleStep
      const r = (value / 10) * maxRadius
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = 'rgba(65, 71, 51, 0.4)'
    ctx.fill()
    ctx.strokeStyle = '#414733'
    ctx.stroke()
  })
}

const saveSession = async () => {
  try {
    const updatedSession = {
      ...session.value,
      ratings: { ...defaultRatings, ...ratings.value }
    };
    await api.put(`/cuppingSessions/${sessionId}`, updatedSession);
    alert('Sesión de cata guardada correctamente.');
  } catch (error) {
    console.error('Error saving session:', error);
    alert('Error al guardar la sesión de cata');
  }
}

</script>


<style scoped>
.session-detail {
  background-color: #F8F7F2;
  min-height: 100vh;
  padding: 40px;
  font-family: 'Inter', sans-serif;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
}

.content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
}

.panel {
  flex: 1;
  min-width: 300px;
}

.slider-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #333;
}

.info-panel {
  flex: 1;
  min-width: 280px;
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.info-panel p {
  margin-bottom: 20px;
  font-size: 15px;
  color: #111;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.action-btn {
  background-color: #414733;
  color: white;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  border: none;
}

.radar-canvas {
  margin-top: 20px;
  display: block;
}
</style>