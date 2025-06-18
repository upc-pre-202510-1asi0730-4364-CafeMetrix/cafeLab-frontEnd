<!-- shared/components/RadarChart.vue -->
<template>
  <Radar :data="chartData" :options="chartOptions" />
</template>

<script setup>
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

const chartData = {
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
}

const chartOptions = {
  responsive: true,
  scales: {
    r: {
      min: 0,
      max: 10,
      ticks: { stepSize: 1 },
      pointLabels: {
        font: {
          size: 14
        }
      }
    }
  }
}
</script>
