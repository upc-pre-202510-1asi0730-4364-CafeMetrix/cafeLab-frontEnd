<template>
  <!-- Incluye el HeaderBar -->
  <HeaderBar />

  <div class="tasting-pattern">
    <!-- Breadcrumb -->
    <div class="breadcrumb-container">
      <div class="breadcrumb">
        {{ $t('breadcrumb.home') }} > <strong>{{ $t('breadcrumb.tastingPattern') }}</strong>
      </div>
    </div>

    <!-- Contenedor para la tabla de selección y el gráfico -->
    <div class="content-container">
      <!-- Formulario para seleccionar las catas a comparar -->
      <div class="tasting-selection">
        <div class="section-header">Selecciona las sesiones de cata a comparar</div>
        <div class="tasting-table">
          <table>
            <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="session in tastingSessions" :key="session.id">
              <!-- Checkbox para seleccionar las sesiones -->
              <td><input type="checkbox" v-model="selectedSessions" :value="session.id" /> {{ session.name }}</td>
              <td>{{ session.date }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Gráfico de puntos de coincidencia -->
      <div class="coincidence-chart">
        <div class="section-header">Puntos de coincidencia</div>
        <canvas></canvas>

        <!-- Imagen dentro de Puntos de coincidencia -->
        <div class="image-container">
          <img src="../../assets/image%2031.png" alt="Coffee Roasting Chart" />
        </div>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="info-section">
      <p class="info-text">
        La agrupación de puntos entre 208-215°C y 11.5-12.3 minutos indica el "núcleo de consistencia" donde se logran perfiles sensoriales similares y exitosos.
      </p>
    </div>

    <!-- Botón para navegar a TastingPatternOverview -->
    <button @click="goToTastingPatternOverview" class="go-to-library-btn">Biblioteca de Relación</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { getTastingData } from '../services/fakeTastingApi'; // Importa la API falsa
import HeaderBar from '../../shared/components/CuppingHeader.vue'; // Importa el HeaderBar

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
    HeaderBar // Registra el HeaderBar como componente
  },
  data() {
    return {
      selectedSessions: [], // Sesiones seleccionadas por el usuario
      tastingSessions: [ // Ejemplo de sesiones de cata
        { id: 'session1', name: 'Cata 1', date: '2023-07-20' },
        { id: 'session2', name: 'Cata 2', date: '2023-07-21' },
        { id: 'session3', name: 'Cata 3', date: '2023-07-22' },
      ],
      chartData: null, // Datos del gráfico
    };
  },
  methods: {
    // Función para navegar a la vista TastingPatternOverview
    goToTastingPatternOverview() {
      this.$router.push({ name: 'TastingPatternOverview' });
    },

    // Función para crear el gráfico de coincidencia
    createChart() {
      const ctx = document.getElementById('chart').getContext('2d');
      new ChartJS(ctx, {
        type: 'line',
        data: this.chartData, // Usamos los datos que obtenemos de la API
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: 'Tiempo (min)',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Temperatura (°C)',
              },
            },
          },
        },
      });
    },
  },
  onMounted() {
    // Llamamos a la API falsa para obtener los datos del gráfico
    getTastingData().then((data) => {
      this.chartData = data; // Asignamos los datos al estado
      this.createChart(); // Creamos el gráfico después de recibir los datos
    });
  },
};
</script>

<style scoped>
.tasting-pattern {
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

/* Contenedor para tabla de selección y gráfico */
.content-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.tasting-selection,
.coincidence-chart {
  background-color: white; /* Fondo blanco para el cuadro */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Sombra ligera */
  width: 45%;
}

.image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.image-container img {
  max-width: 100%;
  height: auto;
}

/* Estilo del encabezado de cada sección */
.section-header {
  background-color: #4b6f6b; /* Color verde para el encabezado */
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

/* Estilos de la tabla */
.tasting-table table {
  width: 100%;
  border-collapse: collapse;
}

.tasting-table th, .tasting-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.tasting-table th {
  background-color: #4b6f6b;
  color: white;
}

.tasting-table td {
  background-color: white; /* Fondo blanco para las filas */
}

.tasting-table input {
  margin-right: 8px;
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

.go-to-library-btn {
  background-color: #414535;
  color: white;
  padding: 10px 15px;
  width: auto;
  border-radius: 5px;
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
