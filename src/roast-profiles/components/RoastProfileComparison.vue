<template>
  <div class="comparison-container">
    <div class="comparison-header">
      <h2>{{ t('roastProfiles.comparison.title') }}</h2>
      <button @click="$router.go(-1)" class="back-btn">
        <i class="fas fa-arrow-left"></i>
        {{ t('roastProfiles.comparison.back') }}
      </button>
    </div>

    <!-- Selector de perfiles -->
    <div v-if="!isDirectComparison" class="profile-selectors">
      <div class="selector-group">
        <label for="profile1">{{ t('roastProfiles.comparison.select_profile') }} 1:</label>
        <select 
          id="profile1"
          v-model="selectedProfiles[0]"
          @change="updateComparison"
          class="profile-select"
        >
          <option value="">{{ t('roastProfiles.comparison.select_profile') }}</option>
          <option 
            v-for="profile in profiles" 
            :key="profile.id" 
            :value="profile"
          >
            {{ profile.name }}
          </option>
        </select>
      </div>

      <div class="selector-group">
        <label for="profile2">{{ t('roastProfiles.comparison.select_profile') }} 2:</label>
        <select 
          id="profile2"
          v-model="selectedProfiles[1]"
          @change="updateComparison"
          class="profile-select"
        >
          <option value="">{{ t('roastProfiles.comparison.select_profile') }}</option>
          <option 
            v-for="profile in profiles" 
            :key="profile.id" 
            :value="profile"
          >
            {{ profile.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading y error states -->
    <div v-if="loading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      {{ t('roastProfiles.comparison.loading') }}
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- Comparación de datos -->
    <div v-if="!loading && !error && (selectedProfiles.length > 0)" class="comparison-content">
      <!-- Tabla de comparación -->
      <div class="comparison-table">
        <h3>{{ t('roastProfiles.comparison.data_title') }}</h3>
        <table>
          <thead>
            <tr>
              <th>{{ t('roastProfiles.comparison.characteristic') }}</th>
              <th v-for="profile in selectedProfiles" :key="profile.id">{{ profile.name }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>{{ t('roastProfiles.comparison.type') }}</strong></td>
              <td v-for="profile in selectedProfiles">{{ profile.type }}</td>
            </tr>
            <tr>
              <td><strong>{{ t('roastProfiles.comparison.duration') }}</strong></td>
              <td v-for="profile in selectedProfiles">{{ profile.duration }} min</td>
            </tr>
            <tr>
              <td><strong>{{ t('roastProfiles.comparison.lot') }}</strong></td>
              <td v-for="profile in selectedProfiles">{{ profile.lot }}</td>
            </tr>
            <tr>
              <td><strong>{{ t('roastProfiles.comparison.temp_start') }}</strong></td>
              <td v-for="profile in selectedProfiles">{{ profile.temp_start }}°C</td>
            </tr>
            <tr>
              <td><strong>{{ t('roastProfiles.comparison.temp_end') }}</strong></td>
              <td v-for="profile in selectedProfiles">{{ profile.temp_end }}°C</td>
            </tr>
            <tr>
              <td><strong>{{ t('roastProfiles.comparison.temp_range') }}</strong></td>
              <td v-for="profile in selectedProfiles">{{ profile.temp_end - profile.temp_start }}°C</td>
            </tr>
            <tr>
              <td><strong>{{ t('roastProfiles.comparison.heating_rate') }}</strong></td>
              <td v-for="profile in selectedProfiles">{{ ((profile.temp_end - profile.temp_start) / profile.duration).toFixed(2) }}°C/min</td>
            </tr>
            <tr>
              <td><strong>{{ t('roastProfiles.comparison.created_at') }}</strong></td>
              <td v-for="profile in selectedProfiles">{{ formatDate(profile.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Gráfico de comparación -->
      <div class="comparison-chart">
        <h3>{{ t('roastProfiles.comparison.chart_title') }}</h3>
        <div class="chart-container">
          <canvas ref="comparisonCanvas" width="1000" height="500"></canvas>
        </div>
      </div>

      <!-- Análisis de diferencias -->
      <div v-if="selectedProfiles.length > 1" class="differences-analysis">
        <h3>{{ t('roastProfiles.comparison.analysis_title') }}</h3>
        <div class="differences-grid">
          <div class="difference-card">
            <h4>{{ t('roastProfiles.comparison.duration') }}</h4>
            <p v-if="durationDifference > 0">
              {{ t('roastProfiles.comparison.duration_diff.longer', { profile: 2, diff: durationDifference }) }}
            </p>
            <p v-else-if="durationDifference < 0">
              {{ t('roastProfiles.comparison.duration_diff.shorter', { profile: 1, diff: Math.abs(durationDifference) }) }}
            </p>
            <p v-else>
              {{ t('roastProfiles.comparison.duration_diff.same') }}
            </p>
          </div>

          <div class="difference-card">
            <h4>{{ t('roastProfiles.comparison.temp_range') }}</h4>
            <p v-if="tempRangeDifference > 0">
              {{ t('roastProfiles.comparison.temp_diff.hotter', { profile: 2, diff: tempRangeDifference }) }}
            </p>
            <p v-else-if="tempRangeDifference < 0">
              {{ t('roastProfiles.comparison.temp_diff.colder', { profile: 1, diff: Math.abs(tempRangeDifference) }) }}
            </p>
            <p v-else>
              {{ t('roastProfiles.comparison.temp_diff.same') }}
            </p>
          </div>

          <div class="difference-card">
            <h4>{{ t('roastProfiles.comparison.heating_rate') }}</h4>
            <p v-if="heatingRateDifference > 0">
              {{ t('roastProfiles.comparison.heating_rate_diff.faster', { profile: 2, diff: heatingRateDifference.toFixed(2) }) }}
            </p>
            <p v-else-if="heatingRateDifference < 0">
              {{ t('roastProfiles.comparison.heating_rate_diff.slower', { profile: 1, diff: Math.abs(heatingRateDifference).toFixed(2) }) }}
            </p>
            <p v-else>
              {{ t('roastProfiles.comparison.heating_rate_diff.same') }}
            </p>
          </div>

          <div class="difference-card">
            <h4>{{ t('roastProfiles.comparison.recommendation') }}</h4>
            <p>{{ recommendationText }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensaje cuando no hay perfiles seleccionados -->
    <div v-if="!loading && !error && selectedProfiles.length === 0" class="no-selection">
      <i class="fas fa-chart-line"></i>
      <p>{{ t('roastProfiles.comparison.no_selection') }}</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { roastProfileService } from '../service/RoastProfileService.js';

export default {
  name: 'RoastProfileComparison',
  setup() {
    const route = useRoute();
    const { t } = useI18n();
    const profiles = ref([]);
    const selectedIds = ref([]);
    const selectedProfiles = ref([]); // Perfiles completos seleccionados
    const loading = ref(false);
    const error = ref(null);
    const comparisonCanvas = ref(null);

    // Computed para saber si estamos en modo comparación directa
    const isDirectComparison = computed(() => selectedIds.value.length >= 2);

    // Computed properties
    const durationDifference = computed(() => {
      if (selectedProfiles.value.length < 2) return 0;
      const diff = selectedProfiles.value[1].duration - selectedProfiles.value[0].duration;
      return diff;
    });

    const tempRangeDifference = computed(() => {
      if (selectedProfiles.value.length < 2) return 0;
      const range1 = selectedProfiles.value[0].temp_end - selectedProfiles.value[0].temp_start;
      const range2 = selectedProfiles.value[1].temp_end - selectedProfiles.value[1].temp_start;
      return range2 - range1;
    });

    const heatingRateDifference = computed(() => {
      if (selectedProfiles.value.length < 2) return 0;
      const rate1 = (selectedProfiles.value[0].temp_end - selectedProfiles.value[0].temp_start) / selectedProfiles.value[0].duration;
      const rate2 = (selectedProfiles.value[1].temp_end - selectedProfiles.value[1].temp_start) / selectedProfiles.value[1].duration;
      return rate2 - rate1;
    });

    // Recommendation text internationalized
    const recommendationText = computed(() => {
      if (selectedProfiles.value.length < 2) return '';
      const durationDiff = Math.abs(durationDifference.value);
      const tempDiff = Math.abs(tempRangeDifference.value);
      const rateDiff = Math.abs(heatingRateDifference.value);
      if (durationDiff > 5) {
        return t('roastProfiles.comparison.recommendation_text.duration');
      } else if (tempDiff > 20) {
        return t('roastProfiles.comparison.recommendation_text.temp');
      } else if (rateDiff > 2) {
        return t('roastProfiles.comparison.recommendation_text.rate');
      } else {
        return t('roastProfiles.comparison.recommendation_text.similar');
      }
    });

    // Methods
    const loadProfiles = async () => {
      loading.value = true;
      error.value = null;
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser?.id) throw new Error('Usuario no autenticado');
        const allProfiles = await roastProfileService.getRoastProfiles();
        profiles.value = allProfiles.filter(p => p.user_id === currentUser.id);
      } catch (err) {
        error.value = t('roastProfiles.messages.error_loading');
      } finally {
        loading.value = false;
      }
    };

    const loadSelectedProfiles = async () => {
      loading.value = true;
      error.value = null;
      try {
        const ids = route.query.ids ? String(route.query.ids).split(',') : [];
        selectedIds.value = ids;
        // Solo cargar los perfiles del usuario
        selectedProfiles.value = profiles.value.filter(p => ids.includes(String(p.id)));
        nextTick(() => drawComparisonChart());
      } catch (err) {
        error.value = t('roastProfiles.messages.error_loading');
      } finally {
        loading.value = false;
      }
    };

    const drawComparisonChart = () => {
      if (!comparisonCanvas.value) return;
      const canvas = comparisonCanvas.value;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!selectedProfiles.value.length) return;
      // Rango global
      const maxDuration = Math.max(...selectedProfiles.value.map(p => p.duration));
      const minTemp = Math.min(...selectedProfiles.value.map(p => p.temp_start));
      const maxTemp = Math.max(...selectedProfiles.value.map(p => p.temp_end));
      const padding = 80;
      const graphWidth = canvas.width - padding * 2;
      const graphHeight = canvas.height - padding * 2;
      const timeToX = (t) => padding + (t / maxDuration) * graphWidth;
      const tempToY = (temp) => canvas.height - padding - ((temp - minTemp) / (maxTemp - minTemp)) * graphHeight;
      // Grilla
      ctx.strokeStyle = '#ddd'; ctx.lineWidth = 1;
      for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * maxDuration;
        const x = timeToX(t);
        ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, canvas.height - padding); ctx.stroke();
      }
      for (let i = 0; i <= 10; i++) {
        const temp = minTemp + (i / 10) * (maxTemp - minTemp);
        const y = tempToY(temp);
        ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(canvas.width - padding, y); ctx.stroke();
      }
      // Ejes
      ctx.strokeStyle = '#000'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(padding, canvas.height - padding); ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.moveTo(padding, canvas.height - padding); ctx.lineTo(padding, padding); ctx.stroke();
      // Etiquetas
      ctx.font = '14px Arial'; ctx.fillStyle = '#000'; ctx.textAlign = 'center';
      for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * maxDuration;
        const x = timeToX(t);
        ctx.fillText(`${t.toFixed(1)} min`, x, canvas.height - padding + 20);
      }
      ctx.textAlign = 'right';
      for (let i = 0; i <= 10; i++) {
        const temp = minTemp + (i / 10) * (maxTemp - minTemp);
        const y = tempToY(temp);
        ctx.fillText(`${temp.toFixed(0)}°C`, padding - 10, y + 5);
      }
      // Título
      ctx.textAlign = 'center'; ctx.font = '18px Arial';
      ctx.fillText(t('roastProfiles.comparison.chart_title'), canvas.width / 2, padding / 2);
      // Curvas
      const colors = ['#8e44ad', '#e74c3c', '#f39c12', '#27ae60'];
      selectedProfiles.value.forEach((profile, index) => {
        const color = colors[index % colors.length];
        ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.setLineDash([]);
        ctx.beginPath();
        const steps = 100;
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * profile.duration;
          const temp = profile.temp_start + (profile.temp_end - profile.temp_start) * Math.log1p(t) / Math.log1p(profile.duration);
          const x = timeToX(t);
          const y = tempToY(temp);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      });
      // Leyenda
      ctx.font = '14px Arial'; ctx.textAlign = 'left';
      const legendX = canvas.width - padding - 250;
      const legendY = padding + 20;
      const lineHeight = 25;
      selectedProfiles.value.forEach((profile, index) => {
        const color = colors[index % colors.length];
        ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.setLineDash([]);
        ctx.beginPath(); ctx.moveTo(legendX, legendY + index * lineHeight); ctx.lineTo(legendX + 40, legendY + index * lineHeight); ctx.stroke();
        ctx.fillStyle = '#000';
        ctx.fillText(`${profile.profile_name}`, legendX + 50, legendY + index * lineHeight + 5);
      });
    };

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString(t('locale') || 'es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // Lifecycle
    onMounted(async () => {
      await loadProfiles();
      await loadSelectedProfiles();
    });

    return {
      profiles,
      selectedProfiles,
      loading,
      error,
      comparisonCanvas,
      isDirectComparison,
      durationDifference,
      tempRangeDifference,
      heatingRateDifference,
      formatDate,
      t,
      recommendationText
    };
  }
};
</script>

<style scoped>
.comparison-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.comparison-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.comparison-header h2 {
  margin: 0;
  color: #333;
}

.back-btn {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  background: #545b62;
}

.profile-selectors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.selector-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selector-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.profile-select {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.profile-select:focus {
  outline: none;
  border-color: #007bff;
}

.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
}

.comparison-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.comparison-table {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.comparison-table h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table th,
.comparison-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.comparison-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.comparison-table tr:hover {
  background: #f8f9fa;
}

.comparison-chart {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.comparison-chart h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.chart-container {
  text-align: center;
  overflow-x: auto;
}

.chart-container canvas {
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

.differences-analysis {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.differences-analysis h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.differences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.difference-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #007bff;
}

.difference-card h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.difference-card p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
}

.no-selection {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.no-selection i {
  font-size: 48px;
  margin-bottom: 20px;
  color: #ddd;
}

.no-selection p {
  font-size: 18px;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .comparison-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .profile-selectors {
    grid-template-columns: 1fr;
  }
  
  .differences-grid {
    grid-template-columns: 1fr;
  }
  
  .comparison-table {
    overflow-x: auto;
  }
  
  .comparison-table table {
    min-width: 500px;
  }
}
</style> 