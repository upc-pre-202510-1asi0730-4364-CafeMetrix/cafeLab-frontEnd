<template>
  <div class="correlation-container">
    <HeaderBar />

    <!-- BREADCRUMB -->
    <div class="breadcrumb">
      {{ t('ROAST_FLAVOR_CORRELATION.HOME') }} &nbsp; > &nbsp; {{ t('ROAST_FLAVOR_CORRELATION.BREADCRUMB_BASE') }} &nbsp;
      <span v-if="currentView === 'library'"> > &nbsp; {{ t('ROAST_FLAVOR_CORRELATION.BREADCRUMB_LIBRARY') }}</span>
    </div>

    <!-- VISTA PRINCIPAL (PATRONES DE RELACIÓN) -->
    <div v-if="currentView === 'patterns'">
      <div class="view-title">{{ t('ROAST_FLAVOR_CORRELATION.VIEW_TITLE_PATTERNS') }}</div>
      <div class="content-grid">
        <div class="sessions-list">
          <div class="sessions-header">
            <span>{{ t('ROAST_FLAVOR_CORRELATION.SESSIONS_TITLE') }}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>{{ t('ROAST_FLAVOR_CORRELATION.TABLE_HEADER_NAME') }}</th>
                <th>{{ t('ROAST_FLAVOR_CORRELATION.TABLE_HEADER_DATE') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="session in roastPatterns" :key="session.id">
                <td><Checkbox v-model="selectedSessions" :value="session.id" /></td>
                <td>{{ session.name }}</td>
                <td>{{ session.date }}</td>
              </tr>
            </tbody>
          </table>
          <Button :label="t('ROAST_FLAVOR_CORRELATION.LIBRARY_BUTTON')" class="library-btn" @click="navigateToLibrary" />
        </div>
        <div class="chart-container">
          <div class="chart-header">
            <h3>{{ t('ROAST_FLAVOR_CORRELATION.CHART_TITLE') }}</h3>
            <p>{{ t('ROAST_FLAVOR_CORRELATION.CHART_SUBTITLE') }}</p>
          </div>
          <Chart type="scatter" :data="chartData" :options="chartOptions" class="scatter-chart" />
          <div class="info-box">
            <i class="pi pi-question-circle"></i>
            <span>{{ t('ROAST_FLAVOR_CORRELATION.CHART_INFO') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- VISTA BIBLIOTECA DE RELACIÓN -->
    <div v-if="currentView === 'library'">
      <div class="view-title">{{ t('ROAST_FLAVOR_CORRELATION.VIEW_TITLE_LIBRARY') }}</div>
      <div class="library-grid">
        <!-- Columna Izquierda -->
        <div class="library-col">
          <div class="info-card">
            <h3>{{ t('ROAST_FLAVOR_CORRELATION.TEMPERATURE_CARD_TITLE') }}</h3>
            <p>{{ roastProfile.temperatureInfo?.influence }}</p>
            <p>{{ roastProfile.temperatureInfo?.higher }}</p>
            <p>{{ roastProfile.temperatureInfo?.lower }}</p>
          </div>
          <div class="roast-profile-img-container">
            <img src="https://i.imgur.com/8Fw1S9D.png" alt="Coffee Beans Roast" class="roast-profile-img" />
          </div>
          <div class="info-card">
            <h3>{{ t('ROAST_FLAVOR_CORRELATION.PROFILE_CARD_TITLE') }}</h3>
            <div v-for="profile in allRoastProfiles" :key="profile.id" class="profile-item">
              {{ profile.name }}
            </div>
          </div>
        </div>
        <!-- Columna Derecha -->
        <div class="library-col">
          <div class="info-card">
            <h3>{{ t('ROAST_FLAVOR_CORRELATION.TIME_CARD_TITLE') }}</h3>
            <p>{{ roastProfile.roastTimeInfo?.sameColor }}</p>
            <p>{{ roastProfile.roastTimeInfo?.fast }}</p>
            <p>{{ roastProfile.roastTimeInfo?.slow }}</p>
          </div>
          <div class="time-chart-container">
             <Chart type="line" :data="lineChartData" :options="lineChartOptions" class="line-chart"/>
          </div>
           <div class="info-card">
            <h3>{{ t('ROAST_FLAVOR_CORRELATION.SPEED_CARD_TITLE') }}</h3>
             <div v-for="time in roastProfile.developmentTimes" :key="time.id" class="profile-item">
               <span>{{ time.label }}</span>
               <input type="text" :value="time.value" readonly/>
             </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import axios from 'axios';
import HeaderBar from '../../public/components/headerBar.vue';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Chart from 'primevue/chart';

const { t } = useI18n();
const currentView = ref('patterns'); // 'patterns' o 'library'
const roastPatterns = ref([]);
const selectedSessions = ref([]);
const scatterPoints = ref({ inside: [], outside: [] });
const chartData = computed(() => ({
  datasets: [
    {
      label: t('ROAST_FLAVOR_CORRELATION.SCATTER_CHART_LABEL_INSIDE'),
      data: scatterPoints.value.inside,
      backgroundColor: 'rgba(153, 102, 255, 0.6)',
      borderColor: 'rgba(153, 102, 255, 1)',
      pointRadius: 6,
    },
    {
      label: t('ROAST_FLAVOR_CORRELATION.SCATTER_CHART_LABEL_OUTSIDE'),
      data: scatterPoints.value.outside,
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderColor: 'rgba(255, 99, 132, 1)',
      pointRadius: 6,
    }
  ]
}));
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      type: 'linear',
      position: 'bottom',
      title: { display: true, text: t('ROAST_FLAVOR_CORRELATION.CHART_AXIS_TIME') },
      min: 0,
      max: 18
    },
    y: {
      title: { display: true, text: t('ROAST_FLAVOR_CORRELATION.CHART_AXIS_TEMP') },
      min: 0,
      max: 240,
      ticks: { stepSize: 60 }
    }
  },
  plugins: {
    legend: { position: 'bottom' }
  }
}));
const lineChartData = computed(() => ({
    labels: [0, 10, 14, 16],
    datasets: [
        {
            label: t('ROAST_FLAVOR_CORRELATION.LINE_CHART_ACIDITY_FAST'),
            data: [100, 150, 130, 120],
            borderColor: '#FF6384',
            tension: 0.1,
            fill: false
        },
        {
            label: t('ROAST_FLAVOR_CORRELATION.LINE_CHART_COMPLEXITY_FAST'),
            data: [80, 120, 110, 100],
            borderColor: '#36A2EB',
            tension: 0.1,
            fill: false
        },
        {
            label: t('ROAST_FLAVOR_CORRELATION.LINE_CHART_ACIDITY_SLOW'),
            data: [110, 130, 100, 80],
            borderColor: '#FFCE56',
            tension: 0.1,
            fill: false
        },
        {
            label: t('ROAST_FLAVOR_CORRELATION.LINE_CHART_COMPLEXITY_SLOW'),
            data: [90, 140, 120, 110],
             borderColor: '#4BC0C0',
            tension: 0.1,
            fill: false
        }
    ]
}));
const lineChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            title: { display: true, text: t('ROAST_FLAVOR_CORRELATION.LINE_CHART_AXIS_INTENSITY') }
        },
        x: {
             title: { display: true, text: t('ROAST_FLAVOR_CORRELATION.LINE_CHART_AXIS_TIME') }
        }
    },
    plugins: {
        legend: {
            position: 'bottom',
             labels: {
                usePointStyle: true,
            },
        }
    }
}));
const roastProfile = ref({});
const allRoastProfiles = ref([]);


const fetchData = async () => {
  const MOCK_API_URL = import.meta.env.VITE_MOCKAPI_URL || 'https://6855d41d1789e182b37c6b19.mockapi.io/api/v1';
  try {
    const [correlationRes, profilesRes] = await Promise.all([
      axios.get(`${MOCK_API_URL}/correlationPage`),
      axios.get(`${MOCK_API_URL}/roastProfiles`)
    ]);

    // Desempacar datos de la nueva estructura
    const correlationData = correlationRes.data[0];
    if (correlationData) {
      roastPatterns.value = correlationData.patterns;
      setupScatterChart(correlationData.points);
    }

    allRoastProfiles.value = profilesRes.data;
    roastProfile.value = profilesRes.data.find(p => p.id === 'perfil_a') || {};

    setupLineChart();

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const setupScatterChart = (data) => {
  scatterPoints.value = {
    inside: data.inside || [],
    outside: data.outside || []
  };
};

const setupLineChart = () => {
    // Implementation of setupLineChart function
};

const navigateToLibrary = () => {
  currentView.value = 'library';
};

onMounted(fetchData);

</script>

<style scoped>
/* GENERAL STYLES */
.correlation-container {
  padding: 1.5rem 3rem;
  background-color: #F8F7F2;
  font-family: 'Inter', sans-serif;
  color: #414535;
}

.breadcrumb {
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #6c757d;
}

.breadcrumb span {
  color: #414535;
  font-weight: 500;
}

.view-title {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 2rem;
}

/* PATTERNS VIEW STYLES */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.sessions-list {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.sessions-header {
  background-color: #618985;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
}

.sessions-list table {
  width: 100%;
  border-collapse: collapse;
}

.sessions-list th, .sessions-list td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.sessions-list th {
  font-weight: 600;
}

.library-btn {
  background-color: #414535;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  width: 100%;
  margin-top: 1.5rem;
  cursor: pointer;
  font-weight: 600;
}

.chart-container {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.chart-header {
  margin-bottom: 1.5rem;
}

.chart-header h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.scatter-chart {
  height: 300px;
}

.info-box {
  background-color: #eef3f7;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #3f5f7a;
}

.info-box .pi {
  font-size: 1.5rem;
}

/* LIBRARY VIEW STYLES */
.library-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.library-col .info-card {
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.library-col h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

.library-col p {
  background-color: #f7f7f7;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.roast-profile-img-container {
  background-color: #fff;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
   margin-bottom: 2rem;
}

.roast-profile-img {
  max-width: 100%;
  height: auto;
}

.profile-item {
    background-color: #f7f7f7;
    padding: 0.75rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.profile-item input {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.5rem;
    background: #fff;
    width: 100px;
}

.time-chart-container {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    margin-bottom: 2rem;
    height: 400px; /* Adjust height as needed */
}

.line-chart {
    height: 100% !important;
}

</style> 