<template>
  <!-- Header -->
  <HeaderBar />

  <!-- Tasting Pattern Overview -->
  <div class="tasting-pattern-overview">
    <!-- Breadcrumb -->
    <div class="breadcrumb-container">
      <div class="breadcrumb">
        {{ $t('breadcrumb.home') }} > <strong>{{ $t('breadcrumb.tastingPatternOverview') }}</strong>
      </div>
    </div>

    <!-- Contenedor para los gráficos y la información -->
    <div class="overview-container">
      <!-- Columna izquierda (Información y gráficos) -->
      <div class="left-column">
        <div class="section-header">Temperatura de tostado</div>
        <div class="info-text">
          <ul>
            <li>Influye en la velocidad de las reacciones químicas.</li>
            <li>Temperaturas más altas aceleran el desarrollo de sabores pero pueden crear notas quemadas.</li>
            <li>Temperaturas más bajas permiten un desarrollo más gradual de compuestos aromáticos.</li>
          </ul>
        </div>
        <div class="roast-curve">
          <!-- Aquí está la imagen corregida -->
          <img src="../../assets/image%2014.png" alt="Curva de Tostado" />
        </div>
        <div>
          <div class="section-header">Curva de temperatura (perfil de tueste)</div>
          <div>
            <label v-for="profile in profiles" :key="profile" class="profile-option">
              <input type="radio" :name="profile" :value="profile" /> {{ profile }}
            </label>
          </div>
        </div>
      </div>

      <!-- Columna derecha (Gráfico de intensidad y más información) -->
      <div class="right-column">
        <div class="section-header">Tiempo de tostado</div>
        <div class="info-text">
          <ul>
            <li>Un mismo color puede lograrse con diferentes curvas tiempo-temperatura.</li>
            <li>Tuestes rápidos preservan más acidez pero pueden desarrollar menos complejidad.</li>
            <li>Tuestes lentos permiten mayor desarrollo de azúcares y aromas pero pueden perder notas más brillantes.</li>
          </ul>
        </div>
        <div class="intensity-chart">
          <canvas id="intensityChart" width="600" height="400"></canvas>
        </div>
        <div class="section-header">Velocidad de desarrollo</div>
        <div class="speed-inputs">
          <label for="speed-time1">Tiempo:</label>
          <input type="text" id="speed-time1" value="12:30" />

          <label for="speed-time2">Tiempo:</label>
          <input type="text" id="speed-time2" value="13:45" />

          <label for="speed-time3">Tiempo:</label>
          <input type="text" id="speed-time3" value="15:00" />
        </div>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="info-section">
      <p class="info-text">
        La agrupación de puntos entre 208-215°C y 11.5-12.3 minutos indica el "núcleo de consistencia" donde se logran perfiles sensoriales similares y exitosos.
      </p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getTastingData } from '../services/fakeTastingApi'; // Importa la API falsa
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Importa el Header
import HeaderBar from '../../shared/components/CuppingHeader.vue';

// Registra los componentes de chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default {
  components: {
    HeaderBar, // Registra el HeaderBar
  },
  data() {
    return {
      profiles: ['Perfil A', 'Perfil BC', 'Perfil DEF'], // Ejemplo de perfiles
      chartData: null, // Datos para el gráfico
    };
  },
  methods: {
    // Función para crear el gráfico de intensidad
    createIntensityChart() {
      const ctx = document.getElementById('intensityChart').getContext('2d');
      new ChartJS(ctx, {
        type: 'line',
        data: this.chartData, // Usamos los datos obtenidos de la API
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Tiempo de tostado (min)',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Intensidad (0-100)',
              },
            },
          },
        },
      });
    },
  },
  onMounted() {
    // Llamamos a la API para obtener los datos del gráfico
    getTastingData().then((data) => {
      this.chartData = data; // Asignamos los datos
      this.createIntensityChart(); // Creamos el gráfico después de recibir los datos
    });
  },
};
</script>

<style scoped>
.tasting-pattern-overview {
  padding: 20px;
  background-color: #F8F7F2;
  color: #414535;
}

.breadcrumb-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.breadcrumb {
  font-size: 16px;
  color: #414535;
}

/* Contenedor para los gráficos y la información */
.overview-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.left-column,
.right-column {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 48%;
}

.section-header {
  background-color: #4b6f6b;
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.profile-option {
  margin-right: 10px;
}

.info-text {
  margin-top: 10px;
}

.info-section {
  margin-top: 20px;
}

.info-text {
  background-color: #bce6d2;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
}

.speed-inputs label,
.speed-inputs input {
  display: block;
  margin: 10px 0;
}

.speed-inputs input {
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.intensity-chart {
  margin-top: 20px;
}
</style>
