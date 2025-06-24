<!-- shared/components/RadarChart.vue -->
<template>
  <Radar :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, Filler)

const props = defineProps({
  ratings: {
    type: Object,
    required: true
  }
})

const chartData = computed(() => ({
  labels: Object.keys(props.ratings).map(attr => attr.toUpperCase()),
  datasets: [
    {
      label: 'Evaluación sensorial',
      backgroundColor: 'rgba(65, 71, 51, 0.4)',
      borderColor: '#414733',
      pointBackgroundColor: '#414733',
      data: Object.values(props.ratings)
    }
  ]
}))

const chartOptions = computed(() => ({
  responsive: true,
  scales: {
    r: {
      min: 0,
      max: 10,
      ticks: {
        stepSize: 1,
        color: '#fff',
        font: {
          size: 12,
          weight: 'bold',
        },
        backdropColor: 'rgba(0,0,0,0)',
        z: 1,
        showLabelBackdrop: false,
        padding: 2
      },
      pointLabels: {
        color: '#fff',
        font: {
          size: 18,
          weight: 'bold',
        },
        padding: 8,
        backdropColor: 'rgba(0,0,0,0)',
        shadowColor: '#000',
        shadowBlur: 4
      },
      grid: {
        color: 'rgba(255,255,255,0.15)'
      },
      angleLines: {
        color: 'rgba(255,255,255,0.2)'
      }
    }
  },
  plugins: {
    legend: {
      labels: {
        color: '#fff',
        font: {
          size: 14
        }
      }
    }
  }
}))
</script>
