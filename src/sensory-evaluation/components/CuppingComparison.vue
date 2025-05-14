<template>
  <div class="comparison-view">
    <CuppingHeader />
    <div class="breadcrumb">
      {{ $t('breadcrumb.home') }} > {{ $t('cupping.sessions') }} > <strong>{{ $t('cupping.comparison') }}</strong>
    </div>

    <div class="chart-grid">
      <div
          v-for="(session, index) in comparedSessions"
          :key="session.id"
          class="chart-card"
      >
        <h3 class="chart-title">{{ session.name || $t('cupping.cupping') + ' ' + session.id }}</h3>
        <canvas
          :key="session.id"
          :ref="el => setCanvasRef(el, index)"
          width="300"
          height="300"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import CuppingHeader from '../../shared/components/CuppingHeader.component.vue'

const route = useRoute()
const { locale } = useI18n()
const comparedSessions = ref([])
const canvasRefs = ref([])
const attributes = ['fragancia', 'sabor', 'acidez', 'cuerpo', 'balance', 'postgusto']

function setCanvasRef(el, index) {
  if (el) canvasRefs.value[index] = el
}

async function updateCharts() {
  await nextTick()
  drawAllCharts()
}

onMounted(async () => {
  const stored = localStorage.getItem('cuppingSessions')
  const allSessions = stored ? JSON.parse(stored) : []
  const ids = route.params.ids ? route.params.ids.split(',').map(Number) : []
  comparedSessions.value = allSessions.filter(s => ids.includes(s.id))
  canvasRefs.value = []
  await updateCharts()
})

watch([comparedSessions, locale], async () => {
  canvasRefs.value = []
  await updateCharts()
})

const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1)

function drawAllCharts() {
  comparedSessions.value.forEach((session, index) => {
    const canvas = canvasRefs.value[index]
    if (!canvas) {
      console.log('No canvas for index', index)
      return
    }
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      console.log('No context for canvas', index)
      return
    }
    const ratings = session.ratings || {
      fragancia: 5,
      sabor: 5,
      acidez: 5,
      cuerpo: 5,
      balance: 5,
      postgusto: 5
    }
    console.log('Drawing for session', session.name, 'ratings:', ratings)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const maxRadius = 100
    const levels = 5
    const points = attributes.length
    const angleStep = (2 * Math.PI) / points

    // niveles
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

    // ejes + etiquetas
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

    // datos
    ctx.beginPath()
    for (let i = 0; i <= points; i++) {
      const value = ratings[attributes[i % points]] || 0
      const angle = i * angleStep
      const r = (value / 10) * maxRadius
      const x = centerX + r * Math.cos(angle)
      const y = centerY + r * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fillStyle = 'rgba(65, 71, 51, 0.3)'
    ctx.fill()
    ctx.strokeStyle = '#414733'
    ctx.stroke()
  })
}
</script>

<style scoped>
.comparison-view {
  background-color: #f8f7f2;
  min-height: 100vh;
  padding: 40px;
  font-family: 'Inter', sans-serif;
}

.breadcrumb {
  margin-bottom: 30px;
  font-size: 16px;
  color: #333;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.chart-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: center;
}

.chart-title {
  font-size: 18px;
  margin-bottom: 10px;
  font-weight: 600;
  color: #414733;
}

canvas {
  margin-top: 10px;
}
</style>
