<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import CoffeeLotService from '../service/CoffeeLotService';

const { t } = useI18n();
const props = defineProps({
  lotId: {
    type: Number,
    required: true
  }
});
const emit = defineEmits(['close']);
const newCertification = ref('');

// Form data
const lotData = ref({
  id: null,
  name: '',
  type: '',
  process: '',
  altitude: '',
  weight: '',
  origin: '',
  certifications: [],
  productionDate: ''
});

// Load lot data when component is mounted
onMounted(() => {
  const lot = CoffeeLotService.getLotById(props.lotId);
  
  if (lot) {
    lotData.value = { 
      ...lot,
      // Make a copy of the certifications array to prevent directly modifying the original
      certifications: [...(lot.certifications || [])]
    };
  }
});

// Function to return to lots list
const goBack = () => {
  emit('close');
};

// Function to add a new certification
const addCertification = () => {
  if (newCertification.value.trim()) {
    lotData.value.certifications.push(newCertification.value.trim());
    newCertification.value = '';
  }
};

// Function to remove a certification
const removeCertification = (index) => {
  lotData.value.certifications.splice(index, 1);
};

// Function to update the lot
const updateLot = () => {
  // Create object with updated lot data
  const updatedLot = {
    id: lotData.value.id,
    name: lotData.value.name,
    type: lotData.value.type,
    process: lotData.value.process,
    altitude: lotData.value.altitude,
    weight: lotData.value.weight,
    origin: lotData.value.origin,
    certifications: lotData.value.certifications,
    productionDate: lotData.value.productionDate
  };

  // Update the lot through the service
  CoffeeLotService.updateLot(updatedLot);
  
  // Close the modal and notify the parent component
  emit('close');
};
</script>

<template>
  <div class="modal-overlay" @click.self="goBack">
    <div class="modal-container">
      <div class="modal-header">
        <button class="back-button" @click="goBack">
          <span class="back-icon">&lt;</span>
          <span>{{ t('coffee.editForm.title') }}</span>
        </button>
      </div>
      
      <div class="modal-content">
        <div class="form-section">
          <h3 class="section-title">{{ t('coffee.registerForm.information') }}</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="name">{{ t('coffee.registerForm.name') }}</label>
              <div class="input-with-edit">
                <input 
                  type="text" 
                  id="name" 
                  v-model="lotData.name" 
                  class="form-control"
                />
                <button class="edit-button">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="type">{{ t('coffee.registerForm.type') }}</label>
              <div class="input-with-edit">
                <input 
                  type="text" 
                  id="type" 
                  v-model="lotData.type" 
                  class="form-control"
                />
                <button class="edit-button">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="process">{{ t('coffee.registerForm.process') }}</label>
              <div class="input-with-edit">
                <input 
                  type="text" 
                  id="process" 
                  v-model="lotData.process" 
                  class="form-control"
                />
                <button class="edit-button">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="altitude">{{ t('coffee.registerForm.altitude') }}</label>
              <div class="input-with-edit">
                <input 
                  type="text" 
                  id="altitude" 
                  v-model="lotData.altitude" 
                  class="form-control"
                />
                <button class="edit-button">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="weight">{{ t('coffee.registerForm.weight') }}</label>
              <div class="input-with-edit">
                <input 
                  type="text" 
                  id="weight" 
                  v-model="lotData.weight" 
                  class="form-control"
                />
                <button class="edit-button">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="origin">{{ t('coffee.registerForm.origin') }}</label>
              <div class="input-with-edit">
                <input 
                  type="text" 
                  id="origin" 
                  v-model="lotData.origin" 
                  class="form-control"
                />
                <button class="edit-button">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="productionDate">{{ t('coffee.registerForm.productionDate') }}</label>
              <div class="input-with-edit">
                <input 
                  type="text" 
                  id="productionDate" 
                  v-model="lotData.productionDate" 
                  class="form-control"
                />
                <button class="edit-button">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label>{{ t('coffee.registerForm.certifications') }}</label>
              <div class="certifications-container">
                <div class="certification-input-container">
                  <input 
                    type="text" 
                    v-model="newCertification" 
                    class="form-control certification-input"
                    placeholder="Orgánico, Rain Forest Alliance..."
                  />
                  <button class="add-button" @click="addCertification">
                    <i class="pi pi-plus"></i>
                  </button>
                </div>
                <div class="certifications-list">
                  <div v-for="(cert, index) in lotData.certifications" :key="index" class="certification-tag">
                    <span>{{ cert }}</span>
                    <button class="remove-cert-button" @click="removeCertification(index)">
                      <i class="pi pi-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="buttons-container">
          <button class="register-button" @click="updateLot">
            {{ t('coffee.registerForm.register') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.back-button {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 1.1rem;
  color: #333;
}

.back-icon {
  font-weight: bold;
}

.modal-content {
  padding: 1.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-section {
  margin-bottom: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.input-with-edit {
  display: flex;
  gap: 0.5rem;
}

.input-with-edit .form-control {
  flex-grow: 1;
}

.edit-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #4a634b;
  font-size: 1.1rem;
}

.certifications-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.certification-input-container {
  display: flex;
  gap: 0.5rem;
}

.certification-input {
  flex-grow: 1;
}

.add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4a634b;
  color: white;
  border: none;
  border-radius: 4px;
  width: 36px;
  cursor: pointer;
}

.certifications-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.certification-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #eee;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.remove-cert-button {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
  padding: 0;
  font-size: 0.9rem;
}

.buttons-container {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.register-button {
  background-color: #4a634b;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.register-button:hover {
  background-color: #3a5239;
}
</style> 