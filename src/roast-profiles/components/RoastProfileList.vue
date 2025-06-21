<template>
  <div class="roast-profile-container">
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <router-link to="/dashboard-owner">{{ t('breadcrumb.home') }}</router-link> &gt;
      <span
        v-if="showProfileDetails"
        class="breadcrumb-link"
        @click="closeProfileDetails"
        style="cursor: pointer; color: #666; text-decoration: underline;"
      >
        {{ t('roastProfiles.title') }}
      </span>
      <router-link v-else to="/roast-profiles">{{ t('roastProfiles.title') }}</router-link>
      <span v-if="showProfileDetails"> &gt; {{ t('roastProfiles.details.title') }}</span>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- Fila superior: buscador a la izquierda, acciones a la derecha -->
    <div v-if="!showProfileDetails" class="top-row">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          @keyup.enter="searchProfiles" 
          :placeholder="t('roastProfiles.search_placeholder')" 
        />
        <button class="search-button" @click="searchProfiles">
          <i class="material-icons">search</i>
        </button>
      </div>
      <div class="actions-group">
        <label class="favorites-toggle">
          <input type="checkbox" v-model="showFavoritesOnly" />
          {{ t('roastProfiles.filters.favorites') }}
        </label>
        <select v-model="sortOrder" class="sort-select">
          <option value="desc">{{ t('roastProfiles.filters.sort_recent') }}</option>
          <option value="asc">{{ t('roastProfiles.filters.sort_old') }}</option>
        </select>
        <button class="compare-btn" :disabled="selectedProfiles.length < 2 || selectedProfiles.length > 4" @click="goToComparison">
          {{ t('roastProfiles.compare_button') }}
        </button>
      </div>
    </div>

    <!-- Tabla -->
    <div v-if="!showProfileDetails && !showEditModal && !showRegisterModal" class="table-container">
      <div v-if="loading" class="loading-indicator">
        <div class="spinner"></div>
        <p>{{ t('roastProfiles.loadingIndicator') }}</p>
      </div>

      <table v-if="!loading" class="roast-profile-table">
        <thead>
          <tr>
            <th></th>
            <th>{{ t('roastProfiles.columns.name') }}</th>
            <th>{{ t('roastProfiles.columns.type') }}</th>
            <th>{{ t('roastProfiles.columns.duration') }}</th>
            <th>{{ t('roastProfiles.columns.lot') }}</th>
            <th>{{ t('roastProfiles.columns.temperature') }}</th>
            <th>{{ t('roastProfiles.columns.favorite') }}</th>
            <th colspan="4"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredProfiles.length === 0">
            <td colspan="10" class="empty-message">{{ t('roastProfiles.no_profiles') }}</td>
          </tr>
          <tr v-for="profile in filteredProfiles" :key="profile.id">
            <td>
              <input type="checkbox" :value="profile.id" v-model="selectedProfiles" :disabled="selectedProfiles.length >= 4 && !selectedProfiles.includes(profile.id)" />
            </td>
            <td>{{ profile.profile_name }}</td>
            <td>{{ profile.roast_type }}</td>
            <td>{{ profile.duration }} min</td>
            <td>{{ getLotName(profile.coffee_lot_id) }}</td>
            <td>{{ profile.temp_start }}°C - {{ profile.temp_end }}°C</td>
            <td>
              <button class="favorite-btn" @click="toggleFavorite(profile, $event)">
                <i :class="['material-icons', profile.is_favorite ? 'favorite-icon' : 'not-favorite-icon']">
                  {{ profile.is_favorite ? 'favorite' : 'favorite_border' }}
                </i>
              </button>
            </td>
            <td class="action-cell">
              <button class="action-button" @click="viewProfileDetails(profile)">
                <i class="material-icons">search</i>
              </button>
            </td>
            <td class="action-cell">
              <button class="action-button" @click="editProfile(profile)">
                <i class="material-icons">edit</i>
              </button>
            </td>
            <td class="action-cell">
              <button class="action-button" @click="duplicateProfile(profile, $event)">
                <i class="material-icons">content_copy</i>
              </button>
            </td>
            <td class="action-cell">
              <button class="action-button" :disabled="!profile.id" @click="deleteProfile(profile.id)">
                <i class="material-icons">delete</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Botón registrar debajo de la tabla -->
    <div v-if="!showProfileDetails && !showEditModal && !showRegisterModal" class="register-container">
      <button class="register-button" @click="showRegisterModal = true">
        {{ t('roastProfiles.registerButton') }}
      </button>
    </div>

    <!-- Detalles del perfil -->
    <div v-if="showProfileDetails" class="profile-details">
      <h2>{{ t('roastProfiles.profileDetailsTitle') }}</h2>
      <div class="detail-group">
        <label>{{ t('roastProfiles.columns.name') }}:</label>
        <p>{{ selectedProfile?.profile_name }}</p>
      </div>
      <div class="detail-group">
        <label>{{ t('roastProfiles.columns.type') }}:</label>
        <p>{{ selectedProfile?.roast_type }}</p>
      </div>
      <div class="detail-group">
        <label>{{ t('roastProfiles.columns.duration') }}:</label>
        <p>{{ selectedProfile?.duration }} {{ t('roastProfiles.minutes') }}</p>
      </div>
      <div class="detail-group">
        <label>{{ t('roastProfiles.columns.lot') }}:</label>
        <p>{{ getLotName(selectedProfile?.coffee_lot_id) }}</p>
      </div>
      <div class="detail-group">
        <label>{{ t('roastProfiles.columns.temperatureStart') }}:</label>
        <p>{{ selectedProfile?.temp_start }}°C</p>
      </div>
      <div class="detail-group">
        <label>{{ t('roastProfiles.columns.temperatureEnd') }}:</label>
        <p>{{ selectedProfile?.temp_end }}°C</p>
      </div>
      <div class="detail-group">
        <label>{{ t('roastProfiles.columns.creationDate') }}:</label>
        <p>{{ formatDate(selectedProfile?.created_at) }}</p>
      </div>
      
      <!-- Canvas para el gráfico de curva de tostado -->
      <div class="chart-container">
        <h3>{{ t('roastProfiles.roastCurveTitle') }}</h3>
        <canvas ref="roastCurveCanvas" width="800" height="400"></canvas>
      </div>
    </div>

    <!-- Modal Registrar -->
    <div v-if="showRegisterModal" class="modal-overlay">
      <div class="modal-content">
        <div class="back-button" @click="closeRegisterModal">
          <i class="material-icons">arrow_back</i> {{ t('roastProfiles.registerModalTitle') }}
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <form @submit.prevent="registerProfile">
          <div class="form-group">
            <label>{{ t('roastProfiles.columns.name') }}</label>
            <input v-model="newProfile.profile_name" required />
          </div>
          <div class="form-group">
            <label>{{ t('roastProfiles.columns.type') }}</label>
            <select v-model="newProfile.roast_type" required>
              <option value="">{{ t('roastProfiles.selectType') }}</option>
              <option v-for="type in roastTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ t('roastProfiles.columns.duration') }} ({{ t('roastProfiles.minutes') }})</label>
            <input v-model.number="newProfile.duration" type="number" min="1" required />
          </div>
          <div class="form-group">
            <label>{{ t('roastProfiles.columns.lot') }}</label>
            <select v-model="newProfile.coffee_lot_id" required>
              <option value="">{{ t('roastProfiles.selectLot') }}</option>
              <option v-for="lot in coffeeLots" :key="lot.id" :value="lot.id">
                {{ lot.lot_name }}
              </option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('roastProfiles.columns.temperatureStart') }} (°C)</label>
              <input v-model.number="newProfile.temp_start" type="number" min="0" required />
            </div>
            <div class="form-group">
              <label>{{ t('roastProfiles.columns.temperatureEnd') }} (°C)</label>
              <input v-model.number="newProfile.temp_end" type="number" min="0" required />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-button">{{ t('roastProfiles.registerButton') }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Editar -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal-content">
        <div class="back-button" @click="closeEditModal">
          <i class="material-icons">arrow_back</i> {{ t('roastProfiles.editModalTitle') }}
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <form @submit.prevent="saveProfileChanges">
          <div class="form-group">
            <label>{{ t('roastProfiles.columns.name') }}</label>
            <input v-model="editingProfile.profile_name" required />
          </div>
          <div class="form-group">
            <label>{{ t('roastProfiles.columns.type') }}</label>
            <select v-model="editingProfile.roast_type" required>
              <option value="">{{ t('roastProfiles.selectType') }}</option>
              <option v-for="type in roastTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>{{ t('roastProfiles.columns.duration') }} ({{ t('roastProfiles.minutes') }})</label>
            <input v-model.number="editingProfile.duration" type="number" min="1" required />
          </div>
          <div class="form-group">
            <label>{{ t('roastProfiles.columns.lot') }}</label>
            <select v-model="editingProfile.coffee_lot_id" required>
              <option value="">{{ t('roastProfiles.selectLot') }}</option>
              <option v-for="lot in coffeeLots" :key="lot.id" :value="lot.id">
                {{ lot.lot_name }}
              </option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>{{ t('roastProfiles.columns.temperatureStart') }} (°C)</label>
              <input v-model.number="editingProfile.temp_start" type="number" min="0" required />
            </div>
            <div class="form-group">
              <label>{{ t('roastProfiles.columns.temperatureEnd') }} (°C)</label>
              <input v-model.number="editingProfile.temp_end" type="number" min="0" required />
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="submit-button">{{ t('roastProfiles.saveButton') }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { roastProfileService } from '../service/RoastProfileService.js';

export default {
  name: 'RoastProfileList',
  setup() {
    const router = useRouter();
    const { t } = useI18n();
    
    // Reactive data
    const profiles = ref([]);
    const coffeeLots = ref([]);
    const searchQuery = ref('');
    const loading = ref(false);
    const error = ref(null);
    const showFavoritesOnly = ref(false);
    
    // Modal states
    const showProfileDetails = ref(false);
    const showEditModal = ref(false);
    const showRegisterModal = ref(false);
    
    // Selected/editing data
    const selectedProfile = ref(null);
    const editingProfile = ref(null);
    const newProfile = reactive({
      profile_name: '',
      roast_type: '',
      duration: 0,
      coffee_lot_id: '',
      temp_start: 0,
      temp_end: 0
    });
    
    // Filters
    const roastTypes = ['Ligero', 'Medio', 'Medio-Oscuro', 'Oscuro'];
    
    // Canvas reference
    const roastCurveCanvas = ref(null);

    // Computed para filtrar favoritos del usuario autenticado
    const userId = ref('');

    // New reactive data
    const selectedProfiles = ref([]);
    const sortOrder = ref('desc');

    // Methods
    const loadProfiles = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        profiles.value = await roastProfileService.getRoastProfiles();
      } catch (err) {
        console.error('Error loading profiles:', err);
        error.value = 'Error al cargar los perfiles de tueste. Por favor intente nuevamente.';
      } finally {
        loading.value = false;
      }
    };

    const searchProfiles = async () => {
      if (!searchQuery.value.trim()) {
        await loadProfiles();
        return;
      }
      
      loading.value = true;
      error.value = null;
      
      try {
        profiles.value = await roastProfileService.searchRoastProfiles(searchQuery.value);
      } catch (err) {
        console.error('Error searching profiles:', err);
        error.value = 'Error al buscar perfiles. Por favor intente nuevamente.';
      } finally {
        loading.value = false;
      }
    };

    const viewProfileDetails = (profile) => {
      selectedProfile.value = { ...profile };
      showProfileDetails.value = true;
      error.value = null;
      
      // Draw curve after modal is shown
      nextTick(() => {
        drawRoastCurve();
      });
    };

    const closeProfileDetails = () => {
      showProfileDetails.value = false;
      selectedProfile.value = null;
    };

    const editProfile = (profile) => {
      editingProfile.value = { ...profile };
      showEditModal.value = true;
      showProfileDetails.value = false;
      error.value = null;
    };

    const closeEditModal = () => {
      showEditModal.value = false;
      error.value = null;
      editingProfile.value = null;
    };

    const saveProfileChanges = async () => {
      if (!editingProfile.value) return;
      
      try {
        const result = await roastProfileService.updateRoastProfile(editingProfile.value);
        if (result) {
          const index = profiles.value.findIndex(p => p.id === result.id);
          if (index !== -1) {
            profiles.value[index] = result;
          }
          closeEditModal();
        }
      } catch (err) {
        console.error('Error updating profile:', err);
        error.value = 'Error al actualizar el perfil. Por favor intente nuevamente.';
      }
    };

    const duplicateProfile = async (profile, event) => {
      event.stopPropagation();
      if (!profile.id) return;
      
      try {
        const duplicatedProfile = {
          ...profile,
          id: undefined,
          profile_name: `${profile.profile_name} (Copia)`,
          created_at: undefined,
          updated_at: undefined
        };
        
        const result = await roastProfileService.createRoastProfile(duplicatedProfile);
        if (result) {
          profiles.value.unshift(result);
        }
      } catch (err) {
        console.error('Error duplicating profile:', err);
        error.value = 'Error al duplicar el perfil. Por favor intente nuevamente.';
      }
    };

    const deleteProfile = async (id) => {
      if (!confirm('¿Está seguro de que desea eliminar este perfil?')) return;
      
      try {
        await roastProfileService.deleteRoastProfile(id);
        profiles.value = profiles.value.filter(p => p.id !== id);
      } catch (err) {
        console.error('Error deleting profile:', err);
        error.value = 'Error al eliminar el perfil. Por favor intente nuevamente.';
      }
    };

    const registerProfile = async () => {
      try {
        const result = await roastProfileService.createRoastProfile(newProfile);
        if (result) {
          profiles.value.unshift(result);
          closeRegisterModal();
          resetForm();
        }
      } catch (err) {
        console.error('Error creating profile:', err);
        error.value = 'Error al crear el perfil. Por favor intente nuevamente.';
      }
    };

    const closeRegisterModal = () => {
      showRegisterModal.value = false;
      error.value = null;
      resetForm();
    };

    const resetForm = () => {
      Object.assign(newProfile, {
        profile_name: '',
        roast_type: '',
        duration: 0,
        coffee_lot_id: '',
        temp_start: 0,
        temp_end: 0
      });
    };

    const loadCoffeeLots = async () => {
      try {
        coffeeLots.value = await roastProfileService.getAvailableLots();
      } catch (err) {
        console.error('Error loading coffee lots:', err);
        error.value = 'Error al cargar los lotes de café. Por favor intente nuevamente.';
      }
    };

    const getLotName = (lotId) => {
      const lot = coffeeLots.value.find(l => l.id === lotId);
      return lot ? lot.lot_name : 'Lote no encontrado';
    };

    const drawRoastCurve = () => {
      if (!selectedProfile.value || !roastCurveCanvas.value) {
        return;
      }

      const canvas = roastCurveCanvas.value;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const duration = selectedProfile.value.duration;
      const tempStart = selectedProfile.value.temp_start;
      const tempEnd = selectedProfile.value.temp_end;

      const padding = 70;
      const graphWidth = canvas.width - padding * 2;
      const graphHeight = canvas.height - padding * 2;

      const timeToX = (t) => padding + (t / duration) * graphWidth;
      const tempToY = (temp) =>
        canvas.height - padding - ((temp - tempStart) / (tempEnd - tempStart)) * graphHeight;

      // --- Dibujar fondo y grilla ---
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;

      const xSteps = 10;
      const ySteps = 10;

      // Grilla vertical
      for (let i = 0; i <= xSteps; i++) {
        const t = (i / xSteps) * duration;
        const x = timeToX(t);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, canvas.height - padding);
        ctx.stroke();
      }

      // Grilla horizontal
      for (let i = 0; i <= ySteps; i++) {
        const temp = tempStart + (i / ySteps) * (tempEnd - tempStart);
        const y = tempToY(temp);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(canvas.width - padding, y);
        ctx.stroke();
      }

      // --- Dibujar ejes ---
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(padding, canvas.height - padding);
      ctx.lineTo(canvas.width - padding, canvas.height - padding);
      ctx.moveTo(padding, canvas.height - padding);
      ctx.lineTo(padding, padding);
      ctx.stroke();

      // --- Etiquetas eje X ---
      ctx.font = '14px Arial';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      for (let i = 0; i <= xSteps; i++) {
        const t = (i / xSteps) * duration;
        const x = timeToX(t);
        ctx.fillText(
          `${t.toFixed(1)} min`,
          x,
          canvas.height - padding + 20
        );
      }

      // --- Etiquetas eje Y ---
      ctx.textAlign = 'right';
      for (let i = 0; i <= ySteps; i++) {
        const temp = tempStart + (i / ySteps) * (tempEnd - tempStart);
        const y = tempToY(temp);
        ctx.fillText(
          `${temp.toFixed(0)}°C`,
          padding - 10,
          y + 5
        );
      }

      // --- Título ---
      ctx.textAlign = 'center';
      ctx.font = '18px Arial';
      ctx.fillText(
        'Curva de Tostado',
        canvas.width / 2,
        padding / 2
      );

      // --- Dibujar curvas ---
      const steps = 100;
      ctx.lineWidth = 3;

      // Temperatura del grano
      ctx.strokeStyle = '#8e44ad';
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration;
        const temp = tempStart + (tempEnd - tempStart) * Math.log1p(t) / Math.log1p(duration);
        const x = timeToX(t);
        const y = tempToY(temp);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Temperatura del tambor
      ctx.strokeStyle = '#c0392b';
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * duration;
        const temp = tempStart + (tempEnd - tempStart) * 0.8 * Math.log1p(t + 2) / Math.log1p(duration + 2);
        const x = timeToX(t);
        const y = tempToY(temp);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // --- Dibujar líneas de eventos ---
      const firstCrackTime = duration * 0.7;
      const secondCrackTime = duration * 0.9;

      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);

      // First Crack
      ctx.strokeStyle = '#f1c40f';
      ctx.beginPath();
      ctx.moveTo(timeToX(firstCrackTime), padding);
      ctx.lineTo(timeToX(firstCrackTime), canvas.height - padding);
      ctx.stroke();

      // Second Crack
      ctx.strokeStyle = '#e74c3c';
      ctx.beginPath();
      ctx.moveTo(timeToX(secondCrackTime), padding);
      ctx.lineTo(timeToX(secondCrackTime), canvas.height - padding);
      ctx.stroke();

      ctx.setLineDash([]);

      // --- Dibujar leyenda ---
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';

      const legendX = canvas.width - padding - 200;
      const legendY = padding + 20;
      const lineHeight = 20;

      const legendItems = [
        { color: '#8e44ad', label: 'Temperatura del Grano' },
        { color: '#c0392b', label: 'Temperatura del Tambor' },
        { color: '#f1c40f', label: 'First Crack' },
        { color: '#e74c3c', label: 'Second Crack' },
      ];

      legendItems.forEach((item, index) => {
        ctx.strokeStyle = item.color;
        ctx.beginPath();
        ctx.moveTo(legendX, legendY + index * lineHeight);
        ctx.lineTo(legendX + 30, legendY + index * lineHeight);
        ctx.stroke();

        ctx.fillStyle = '#000';
        ctx.fillText(item.label, legendX + 40, legendY + index * lineHeight + 5);
      });
    };

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const goToComparison = () => {
      if (selectedProfiles.value.length < 2 || selectedProfiles.value.length > 4) return;
      const ids = selectedProfiles.value.join(',');
      router.push({ path: '/roast-profiles/compare', query: { ids } });
    };

    // Toggle favorito
    const toggleFavorite = async (profile, event) => {
      event.stopPropagation();
      try {
        const updated = await roastProfileService.toggleFavorite(profile.id, profile.is_favorite);
        if (updated) {
          profile.is_favorite = updated.is_favorite;
        }
      } catch (err) {
        error.value = t('roastProfiles.messages.error_favorite');
      }
    };

    // Lifecycle
    onMounted(async () => {
      // Obtener user_id del auth service/localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      userId.value = currentUser?.id || '';
      await loadCoffeeLots();
      await loadProfiles();
    });

    const filteredProfiles = computed(() => {
      let filtered = profiles.value;
      if (showFavoritesOnly.value) {
        filtered = filtered.filter(p => p.is_favorite && p.user_id === userId.value);
      } else {
        filtered = filtered.filter(p => p.user_id === userId.value);
      }
      // Ordenar por fecha
      filtered = filtered.slice().sort((a, b) => {
        const dateA = new Date(a.created_at || a.createdAt).getTime();
        const dateB = new Date(b.created_at || b.createdAt).getTime();
        return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA;
      });
      return filtered;
    });

    return {
      // Data
      profiles,
      coffeeLots,
      searchQuery,
      loading,
      error,
      showProfileDetails,
      showEditModal,
      showRegisterModal,
      selectedProfile,
      editingProfile,
      newProfile,
      roastTypes,
      roastCurveCanvas,
      showFavoritesOnly,
      filteredProfiles,
      userId,
      selectedProfiles,
      sortOrder,

      // Methods
      loadProfiles,
      searchProfiles,
      viewProfileDetails,
      closeProfileDetails,
      editProfile,
      closeEditModal,
      saveProfileChanges,
      duplicateProfile,
      deleteProfile,
      registerProfile,
      closeRegisterModal,
      resetForm,
      loadCoffeeLots,
      getLotName,
      drawRoastCurve,
      formatDate,
      goToComparison,
      toggleFavorite,
      t
    };
  }
};
</script>

<style scoped>
.roast-profile-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 60px;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.breadcrumb a {
  color: #4A5A54;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb-link {
  color: #4A5A54;
  text-decoration: none;
}

.error-message {
  background-color: #ffebee;
  color: #c62828;
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  border-left: 4px solid #c62828;
  width: 100%;
  box-sizing: border-box;
}

.search-container {
  margin-bottom: 15px;
}

.search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  max-width: 400px;
}

.search-box input {
  flex: 1;
  padding: 10px 15px;
  border: none;
  outline: none;
  font-size: 14px;
}

.search-button {
  padding: 10px 15px;
  background: #4A5A54;
  color: white;
  border: none;
  cursor: pointer;
  transition: background 0.3s;
}

.search-button:hover {
  background: #3D4B44;
}

.register-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.register-button {
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.register-button:hover {
  background-color: #3D4B44;
}

.compare-btn-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.compare-btn {
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.compare-btn:disabled {
  background-color: #bdbdbd;
  cursor: not-allowed;
}

.table-container {
  margin-top: 15px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4A5A54;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.roast-profile-table {
  width: 100%;
  border-collapse: collapse;
}

.roast-profile-table th {
  background-color: #4A5A54;
  color: white;
  text-align: left;
  padding: 12px 15px;
  position: sticky;
  top: 0;
  font-weight: normal;
}

.roast-profile-table td {
  padding: 10px 15px;
  border-bottom: 1px solid #ddd;
  color: #333;
}

.roast-profile-table tr:hover {
  background-color: #f5f5f5;
}

.empty-message {
  text-align: center;
  padding: 20px;
  color: #666;
}

.action-cell {
  text-align: center;
  width: 50px;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  background-color: #e0e0e0;
}

.favorite-icon {
  color: #e74c3c;
  font-size: 18px;
}

.not-favorite-icon {
  color: #ccc;
  font-size: 18px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.back-button {
  color: #555;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  text-decoration: none;
  cursor: pointer;
}

.back-button i {
  margin-right: 5px;
  font-size: 16px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 15px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #4A5A54;
  outline: none;
  box-shadow: 0 0 3px rgba(74,90,84,0.3);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 25px;
}

.submit-button {
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  min-width: 120px;
}

.submit-button:hover {
  background-color: #3D4B44;
}

/* Profile details styles */
.profile-details {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 20px;
}

.profile-details h2 {
  color: #4A5A54;
  margin-top: 0;
  margin-bottom: 20px;
}

.detail-group {
  margin-bottom: 15px;
}

.detail-group label {
  font-weight: 500;
  color: #666;
  display: block;
  margin-bottom: 5px;
}

.detail-group p {
  margin: 0;
  color: #333;
}

.chart-container {
  margin-top: 30px;
  text-align: center;
}

.chart-container h3 {
  color: #4A5A54;
  margin-bottom: 20px;
}

.chart-container canvas {
  border: 1px solid #ddd;
  border-radius: 8px;
  max-width: 100%;
  height: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    margin: 20px;
    max-width: calc(100vw - 40px);
  }
  
  .roast-profile-table {
    font-size: 12px;
  }
  
  .roast-profile-table th,
  .roast-profile-table td {
    padding: 8px 10px;
  }
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 20px;
}
.actions-group {
  display: flex;
  align-items: center;
  gap: 16px;
}
.sort-select {
  padding: 7px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-size: 14px;
}
.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fab-register {
  position: absolute;
  right: 40px;
  bottom: 40px;
  background-color: #4A5A54;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 14px 28px;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  transition: background 0.3s;
}
.fab-register:hover {
  background-color: #3D4B44;
}
</style> 