<template>
  <div class="defect-list">
    <!-- Agregar el HeaderBar al inicio del archivo -->
    <HeaderBar />

    <!-- Breadcrumb y mensaje de error en la misma línea -->
    <div class="breadcrumb-defects-centered error-breadcrumb-row">
      <span class="breadcrumb-home">{{ t('breadcrumb.home') }}</span>
      <span class="breadcrumb-separator">&gt;</span>
      <span class="breadcrumb-current">{{ t('DEFECTS.LIBRARY_TITLE') }}</span>
      <span v-if="deleteErrorMsg" class="error-alert-inline">{{ deleteErrorMsg }}</span>
    </div>

    <!-- Filtros de búsqueda modernos -->
    <div class="centered-filters-container">
      <div class="filter-block">
        <label class="filter-label">{{ t('DEFECTS.SEARCH_CAFE_TYPE') }}</label>
        <div class="filter-input-group">
          <input type="text" v-model="searchCafe" :placeholder="t('DEFECTS.SEARCH_CAFE_PLACEHOLDER')" class="search-bar" />
          <select v-model="selectedCafe" class="dropdown">
            <option value="">{{ t('DEFECTS.SELECT_ALL') }}</option>
            <option v-for="cafe in uniqueCafes" :key="cafe" :value="cafe">{{ cafe }}</option>
          </select>
        </div>
      </div>
      <div class="filter-block">
        <label class="filter-label">{{ t('DEFECTS.SEARCH_DEFECT_TYPE') }}</label>
        <div class="filter-input-group">
          <input type="text" v-model="searchDefecto" :placeholder="t('DEFECTS.SEARCH_DEFECT_PLACEHOLDER')" class="search-bar" />
          <select v-model="selectedDefecto" class="dropdown">
            <option value="">{{ t('DEFECTS.SELECT_ALL') }}</option>
            <option v-for="defecto in uniqueDefectos" :key="defecto" :value="defecto">{{ defecto }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla de defectos -->
    <div class="centered-table-container">
      <table class="defect-table">
        <thead>
        <tr>
          <th></th>
          <th>{{ t('DEFECTS.TABLE_HEADER_WEIGHT') }}</th>
          <th>{{ t('DEFECTS.TABLE_HEADER_CAFE') }}</th>
          <th>{{ t('DEFECTS.TABLE_HEADER_DEFECT') }}</th>
          <th>{{ t('DEFECTS.TABLE_HEADER_PERCENTAGE') }}</th>
          <th>{{ t('DEFECTS.TABLE_HEADER_ACTION') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="defect in filteredDefects" :key="defect.id" :class="{selected: selectedDefectId === defect.id}" @click="selectedDefectId = defect.id">
          <td>
            <input type="checkbox" :checked="selectedDefectId === defect.id" @change="selectDefect(defect.id, $event)" class="custom-checkbox" />
          </td>
          <td>{{ defect.peso || '' }}</td>
          <td>{{ defect.cafe || '' }}</td>
          <td>{{ defect.defecto }}</td>
          <td>{{ defect.porcentaje || '' }}</td>
          <td class="action-cell">
            <button class="icon-btn action-btn" @click.stop="openEditModal(defect)"><i class="fa fa-pencil"></i></button>
            <button class="icon-btn action-btn" @click.stop="openModal(defect)"><i class="fa fa-search"></i></button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Botón para agregar un defecto -->
    <div class="buttons-row">
      <button @click="handleDeleteSelectedDefect" class="delete-btn-green">{{ t('DEFECTS.DELETE_BUTTON') }}</button>
      <button @click="showAddDefectModal = true" class="add-btn-modern">{{ t('DEFECTS.ADD_BUTTON') }}</button>
    </div>

    <!-- Modal para agregar defecto -->
    <div v-if="showAddDefectModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeAddDefectModal">&times;</span>
        <h2>{{ t('DEFECTS.ADD_MODAL_TITLE') }}</h2>
        <form @submit.prevent="addNewDefect">
          <div>
            <label for="cafe" class="form-label">{{ t('DEFECTS.TABLE_HEADER_CAFE') }}</label>
            <input type="text" id="cafe" v-model="newDefect.cafe" required />
          </div>
          <div>
            <label for="defecto" class="form-label">{{ t('DEFECTS.TABLE_HEADER_DEFECT') }}</label>
            <input type="text" id="defecto" v-model="newDefect.defecto" required />
          </div>
          <div>
            <label for="peso" class="form-label">{{ t('DEFECTS.TABLE_HEADER_WEIGHT') }}</label>
            <input type="number" step="0.1" id="peso" v-model="newDefect.peso" required />
          </div>
          <div>
            <label for="porcentaje" class="form-label">{{ t('DEFECTS.TABLE_HEADER_PERCENTAGE') }}</label>
            <input type="number" step="0.1" id="porcentaje" v-model="newDefect.porcentaje" required />
          </div>
          <div>
            <label for="causas" class="form-label">{{ t('DEFECTS.DETAILS_PROBABLE_CAUSES') }}</label>
            <input type="text" id="causas" v-model="newDefect.causas" />
          </div>
          <div>
            <label for="soluciones" class="form-label">{{ t('DEFECTS.DETAILS_RECOMMENDED_SOLUTIONS') }}</label>
            <input type="text" id="soluciones" v-model="newDefect.soluciones" />
          </div>
          <button type="submit" class="add-submit-btn">{{ t('DEFECTS.FORM_SUBMIT_BUTTON') }}</button>
        </form>
      </div>
    </div>

    <!-- Modal de ver defecto moderno -->
    <div v-if="showModal" class="modal">
      <div class="modal-content defect-modal-content">
        <span class="close" @click="closeModal">&times;</span>
        <h2>{{ t('DEFECTS.DETAILS_MODAL_TITLE') }}</h2>
        <div class="defect-info">
          <div class="causes-block">
            <span class="block-title">{{ t('DEFECTS.DETAILS_PROBABLE_CAUSES') }}</span>
            <div class="block-content">{{ selectedDefect?.causas || t('DEFECTS.NOT_AVAILABLE') }}</div>
          </div>
          <div class="solutions-block">
            <span class="block-title">{{ t('DEFECTS.DETAILS_RECOMMENDED_SOLUTIONS') }}</span>
            <div class="block-content">{{ selectedDefect?.soluciones || t('DEFECTS.NOT_AVAILABLE') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Importa el componente HeaderBar (ahora CuppingHeader.vue)
import HeaderBar from '../../public/components/headerBar.vue'
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { getAllDefects, createDefect, deleteDefect } from '../service';

export default {
  components: {
    HeaderBar, // Registra HeaderBar (CuppingHeader.vue)
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter(); // Instanciamos el enrutador
    const defects = ref([]);
    const showModal = ref(false);
    const showAddDefectModal = ref(false);
    const selectedDefect = ref(null);
    const newDefect = ref({ peso: null, cafe: '', defecto: '', porcentaje: null, causas: '', soluciones: '' });
    const searchCafe = ref('');
    const searchDefecto = ref('');
    const selectedCafe = ref('');
    const selectedDefecto = ref('');
    const errorMsg = ref('');
    const selectedDefectId = ref(null);
    const deleteErrorMsg = ref("");

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userId = currentUser?.id;
    const userPlan = currentUser?.plan;

    const uniqueCafes = computed(() => [...new Set(defects.value.map(d => d.cafe).filter(Boolean))]);
    const uniqueDefectos = computed(() => [...new Set(defects.value.map(d => d.defecto).filter(Boolean))]);

    const filteredDefects = computed(() => {
      return defects.value.filter(defect => {
        const matchCafe = (!selectedCafe.value || defect.cafe === selectedCafe.value) &&
          (!searchCafe.value || (defect.cafe && defect.cafe.toLowerCase().includes(searchCafe.value.toLowerCase())));
        const matchDefecto = (!selectedDefecto.value || defect.defecto === selectedDefecto.value) &&
          (!searchDefecto.value || (defect.defecto && defect.defecto.toLowerCase().includes(searchDefecto.value.toLowerCase())));
        return matchCafe && matchDefecto;
      });
    });

    const loadDefects = async () => {
      try {
        const response = await getAllDefects(userId);
        if (Array.isArray(response.data)) {
          // Filtra por plan si es necesario (ejemplo: owner ve todos, barista solo los suyos)
          defects.value = userPlan === 'owner' ? response.data : response.data.filter(d => d.user_id === userId);
        } else {
          throw new Error('Formato de datos incorrecto recibido de la API.');
        }
        errorMsg.value = '';
      } catch (error) {
        errorMsg.value = t('DEFECTS.ERROR_LOAD');
      }
    };

    const addNewDefect = async () => {
      try {
        await createDefect({ ...newDefect.value, user_id: userId }, userId);
        await loadDefects();
        showAddDefectModal.value = false;
        newDefect.value = { peso: null, cafe: '', defecto: '', porcentaje: null, causas: '', soluciones: '' };
        errorMsg.value = '';
      } catch (error) {
        errorMsg.value = t('DEFECTS.ERROR_ADD');
      }
    };

    const closeAddDefectModal = () => {
      showAddDefectModal.value = false;
    };

    const openModal = (defect) => {
      selectedDefect.value = { ...defect };
      showModal.value = true;
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const canDelete = (defect) => defect.user_id === userId || userPlan === 'owner';
    const handleDelete = async (defect) => {
      if (!canDelete(defect)) return;
      if (!confirm(t('DEFECTS.CONFIRM_DELETE'))) return;
      await deleteDefect(defect.id);
      await loadDefects();
    };

    const handleDeleteSelectedDefect = async () => {
      deleteErrorMsg.value = "";
      if (!selectedDefectId.value) {
        deleteErrorMsg.value = t('DEFECTS.ERROR_NO_DEFECT_SELECTED');
        return;
      }
      if (!confirm(t('DEFECTS.CONFIRM_DELETE_SELECTED'))) return;
      await deleteDefect(selectedDefectId.value);
      await loadDefects();
      selectedDefectId.value = null;
    };

    const selectDefect = (id, event) => {
      if (event.target.checked) {
        selectedDefectId.value = id;
      } else {
        selectedDefectId.value = null;
      }
    };

    const openEditModal = (defect) => {
      // Implementa la lógica para abrir el modal de edición
      console.log('Editar defecto:', defect);
    };

    onMounted(() => {
      loadDefects();
    });

    return {
      t,
      defects,
      showModal,
      showAddDefectModal,
      selectedDefect,
      newDefect,
      searchCafe,
      searchDefecto,
      selectedCafe,
      selectedDefecto,
      uniqueCafes,
      uniqueDefectos,
      filteredDefects,
      addNewDefect,
      closeAddDefectModal,
      openModal,
      closeModal,
      errorMsg,
      canDelete,
      handleDelete,
      handleDeleteSelectedDefect,
      deleteErrorMsg,
      selectDefect,
      userPlan,
      openEditModal
    };
  },
};
</script>

<style scoped>
/* Estilos de la tabla y modal */
body {
  background-color: #F8F7F2; /* Fondo principal color solicitado */
  margin: 0;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
}

.defect-list {
  background-color: #F8F7F2;
  min-height: 100vh;
  padding-bottom: 40px;
}

.breadcrumb-defects,
.breadcrumb-defects-centered {
  max-width: 1100px;
  margin: 70px auto 0 auto;
  display: flex;
  align-items: center;
  font-size: 2rem;
  color: #414535;
  font-family: 'Inter', sans-serif;
  padding-bottom: 32px;
  justify-content: flex-start;
}

.breadcrumb-home {
  color: #414535;
  font-weight: 400;
}

.breadcrumb-separator {
  color: #b0b0b0;
  margin: 0 8px;
  font-size: 2.2rem;
}

.breadcrumb-current {
  color: #414535;
  font-weight: 500;
}

/* Filtros */
.centered-filters-container {
  max-width: 1100px;
  margin: 0 auto 24px auto;
  display: flex;
  gap: 24px;
  align-items: flex-end;
}

.filter-block {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-weight: 600;
  color: #414535;
  margin-bottom: 4px;
}

.filter-input-group {
  display: flex;
  gap: 8px;
}

.search-bar {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.dropdown {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

/* Tabla de defectos */
.centered-table-container {
  max-width: 1100px;
  margin: 40px auto 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 0 0 30px 0;
}

.defect-table {
  width: 100%;
  border-collapse: collapse;
}

.defect-table th, .defect-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #414535;
}

.defect-table i {
  color: #fff;
  cursor: pointer;
}

.defect-table th {
  background-color: #618985;
  color: white;
}

/* Botón circular en la columna de acción */
.view-btn {
  background-color: #414535;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
}

.view-btn:hover {
  background-color: #5a6c6a;
}

/* Modal Agregar Defecto */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  color: #222;
  padding: 20px;
  border-radius: 8px;
  width: 50%;
  max-width: 600px;
  text-align: center;
}

.modal-body {
  color: #222;
}

.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.add-btn-modern {
  background-color: #414535;
  color: white;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  border: none;
  margin-top: 18px;
  cursor: pointer;
  float: right;
  transition: background 0.2s;
}

.add-btn-modern:hover {
  background-color: #5a6c6a;
}

.form-label {
  color: #414535; /* Color de las letras en el formulario */
  font-weight: 600;
}

input[type="text"], input[type="number"] {
  padding: 8px;
  margin-top: 5px;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ddd;
}

button[type="submit"] {
  background-color: #414535;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

button[type="submit"]:hover {
  background-color: #5a6c6a;
}

/* Mensaje de error */
.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
}

.defect-modal-content {
  background-color: #fff;
  color: #414535;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  padding: 30px 30px 20px 30px;
  max-width: 900px;
  width: 90vw;
  text-align: left;
}
.defect-info {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 30px;
  margin-bottom: 30px;
}
.causes-block, .solutions-block {
  flex: 1;
  background: #f5f5f5;
  border-radius: 20px;
  margin: 0 20px;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 180px;
}
.block-title {
  font-size: 1.3em;
  font-weight: 500;
  margin-bottom: 20px;
}
.block-content {
  font-size: 1.1em;
  color: #414535;
  text-align: center;
}
.close-btn {
  background-color: #414535;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 20px;
}
.close-btn:hover {
  background-color: #3c3f31;
}
.selected {
  background-color: #e0e0e0;
}
.delete-btn-green {
  background-color: #618985;
  color: #fff;
  padding: 10px 24px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  border: none;
  margin-top: 18px;
  cursor: pointer;
  float: right;
  transition: background 0.2s;
}
.delete-btn-green:hover {
  background-color: #4b6f6b;
}
.error-alert {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  padding: 10px 20px;
  margin: 10px 0 0 0;
  font-weight: 600;
  text-align: right;
  max-width: 400px;
  float: right;
}
.buttons-row {
  max-width: 1100px;
  margin: 16px auto 0 auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}
.custom-checkbox {
  width: 22px;
  height: 22px;
  accent-color: #414535;
  border-radius: 4px;
  border: 2px solid #414535;
  background: #414535;
}
.action-cell {
  min-width: 120px;
  max-width: 140px;
  text-align: center;
}
.icon-btn {
  background: #23231f;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  margin: 0 2px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.action-btn {
  background: #23231f;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 8px 10px;
  margin: 0 2px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.action-btn:hover {
  background: #414535;
}
</style>
