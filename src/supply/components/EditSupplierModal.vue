<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import SupplierService from '../service/SupplierService';

const { t } = useI18n();
const props = defineProps({
  supplierId: {
    type: Number,
    required: true
  }
});
const emit = defineEmits(['close']);

// Datos del formulario
const supplierData = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  location: '',
  lotName: '',
  coffeeType: '',
  coffeeTypes: {
    arabica: false,
    robusta: false,
    liberica: false,
    excelsa: false
  },
  altitude: {
    range1: false, // 0-900 msnm
    range2: false, // 900-1200 msnm
    range3: false, // 1200-1500 msnm
    range4: false  // 1500-2100 msnm
  }
});

// Cargar datos del proveedor al montar el componente
onMounted(() => {
  const supplier = SupplierService.getSupplierById(props.supplierId);
  
  if (supplier) {
    supplierData.value.id = supplier.id;
    supplierData.value.lotName = supplier.name;
    supplierData.value.email = supplier.email;
    supplierData.value.phone = supplier.phone;
    supplierData.value.location = supplier.location;
    supplierData.value.coffeeType = supplier.coffeeType || '';
    
    // Configurar tipos de café seleccionados
    if (supplier.coffeeTypes) {
      supplierData.value.coffeeTypes.arabica = supplier.coffeeTypes.includes('Arábica');
      supplierData.value.coffeeTypes.robusta = supplier.coffeeTypes.includes('Robusta');
      supplierData.value.coffeeTypes.liberica = supplier.coffeeTypes.includes('Liberica');
      supplierData.value.coffeeTypes.excelsa = supplier.coffeeTypes.includes('Excelsa');
    }
    
    // Configurar altitudes seleccionadas
    if (supplier.altitudes) {
      supplierData.value.altitude.range1 = supplier.altitudes.includes('0-900 msnm');
      supplierData.value.altitude.range2 = supplier.altitudes.includes('900-1200 msnm');
      supplierData.value.altitude.range3 = supplier.altitudes.includes('1200-1500 msnm');
      supplierData.value.altitude.range4 = supplier.altitudes.includes('1500-2100 msnm');
    }
  }
});

// Función para volver a la pantalla de proveedores
const goBack = () => {
  emit('close');
};

// Función para actualizar el proveedor
const updateSupplier = () => {
  // Obtener tipos de café seleccionados
  const selectedCoffeeTypes = [];
  if (supplierData.value.coffeeTypes.arabica) selectedCoffeeTypes.push('Arábica');
  if (supplierData.value.coffeeTypes.robusta) selectedCoffeeTypes.push('Robusta');
  if (supplierData.value.coffeeTypes.liberica) selectedCoffeeTypes.push('Liberica');
  if (supplierData.value.coffeeTypes.excelsa) selectedCoffeeTypes.push('Excelsa');
  
  // Obtener rangos de altitud seleccionados
  const selectedAltitudes = [];
  if (supplierData.value.altitude.range1) selectedAltitudes.push('0-900 msnm');
  if (supplierData.value.altitude.range2) selectedAltitudes.push('900-1200 msnm');
  if (supplierData.value.altitude.range3) selectedAltitudes.push('1200-1500 msnm');
  if (supplierData.value.altitude.range4) selectedAltitudes.push('1500-2100 msnm');
  
  // Crear objeto con los datos actualizados del proveedor
  const updatedSupplier = {
    id: supplierData.value.id,
    name: supplierData.value.lotName,
    email: supplierData.value.email || `${supplierData.value.lotName.toLowerCase().replace(/\s/g, '')}@example.com`,
    phone: supplierData.value.phone,
    location: supplierData.value.location,
    coffeeType: supplierData.value.coffeeType,
    coffeeTypes: selectedCoffeeTypes,
    altitudes: selectedAltitudes
  };

  // Actualizar el proveedor a través del servicio
  SupplierService.updateSupplier(updatedSupplier);
  
  // Cerrar el modal y notificar al componente padre
  emit('close');
};
</script>

<template>
  <div class="modal-overlay" @click.self="goBack">
    <div class="modal-container">
      <div class="modal-header">
        <button class="back-button" @click="goBack">
          <span class="back-icon">&lt;</span>
          <span>{{ t('supply.editForm.title') }}</span>
        </button>
      </div>
      
      <div class="modal-content">
        <div class="form-section">
          <h3 class="section-title">{{ t('supply.registerForm.contactInfo') }}</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="lotName">{{ t('supply.registerForm.lotName') }}</label>
              <div class="input-with-edit">
                <input 
                  type="text" 
                  id="lotName" 
                  v-model="supplierData.lotName" 
                  class="form-control"
                  placeholder="abcd..."
                />
                <button class="edit-button">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="coffeeType">{{ t('supply.registerForm.coffeeType') }}</label>
              <div class="input-with-edit">
                <input 
                  type="text" 
                  id="coffeeType" 
                  v-model="supplierData.coffeeType" 
                  class="form-control"
                  placeholder="abc..."
                />
                <button class="edit-button">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="contactNumber">{{ t('supply.registerForm.contactNumber') }}</label>
              <div class="input-with-edit">
                <input 
                  type="text" 
                  id="contactNumber" 
                  v-model="supplierData.phone" 
                  class="form-control"
                  placeholder="123..."
                />
                <button class="edit-button">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
            
            <div class="form-group">
              <label for="location">{{ t('supply.registerForm.location') }}</label>
              <div class="input-with-edit">
                <input 
                  type="text" 
                  id="location" 
                  v-model="supplierData.location" 
                  class="form-control"
                  placeholder="abc..."
                />
                <button class="edit-button">
                  <i class="pi pi-pencil"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-section">
          <h3 class="section-title">{{ t('supply.registerForm.productInfo') }}</h3>
          
          <div class="form-row checkboxes-row">
            <div class="form-group checkbox-group">
              <label class="checkbox-title">{{ t('supply.registerForm.coffeeTypes') }}</label>
              
              <div class="checkbox-item">
                <input 
                  type="checkbox" 
                  id="arabica" 
                  v-model="supplierData.coffeeTypes.arabica"
                />
                <label for="arabica">{{ t('supply.registerForm.arabica') }}</label>
              </div>
              
              <div class="checkbox-item">
                <input 
                  type="checkbox" 
                  id="robusta" 
                  v-model="supplierData.coffeeTypes.robusta"
                />
                <label for="robusta">{{ t('supply.registerForm.robusta') }}</label>
              </div>
              
              <div class="checkbox-item">
                <input 
                  type="checkbox" 
                  id="liberica" 
                  v-model="supplierData.coffeeTypes.liberica"
                />
                <label for="liberica">{{ t('supply.registerForm.liberica') }}</label>
              </div>
              
              <div class="checkbox-item">
                <input 
                  type="checkbox" 
                  id="excelsa" 
                  v-model="supplierData.coffeeTypes.excelsa"
                />
                <label for="excelsa">{{ t('supply.registerForm.excelsa') }}</label>
              </div>
            </div>
            
            <div class="form-group checkbox-group">
              <label class="checkbox-title">{{ t('supply.registerForm.altitude') }}</label>
              
              <div class="checkbox-item">
                <input 
                  type="checkbox" 
                  id="altitude1" 
                  v-model="supplierData.altitude.range1"
                />
                <label for="altitude1">{{ t('supply.registerForm.altitude1') }}</label>
              </div>
              
              <div class="checkbox-item">
                <input 
                  type="checkbox" 
                  id="altitude2" 
                  v-model="supplierData.altitude.range2"
                />
                <label for="altitude2">{{ t('supply.registerForm.altitude2') }}</label>
              </div>
              
              <div class="checkbox-item">
                <input 
                  type="checkbox" 
                  id="altitude3" 
                  v-model="supplierData.altitude.range3"
                />
                <label for="altitude3">{{ t('supply.registerForm.altitude3') }}</label>
              </div>
              
              <div class="checkbox-item">
                <input 
                  type="checkbox" 
                  id="altitude4" 
                  v-model="supplierData.altitude.range4"
                />
                <label for="altitude4">{{ t('supply.registerForm.altitude4') }}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="register-button" @click="updateSupplier">
          {{ t('supply.editForm.update') }}
        </button>
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
  width: 90%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.back-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #4a634b;
  font-size: 1rem;
  cursor: pointer;
  padding: 0;
  font-weight: bold;
}

.back-icon {
  margin-right: 0.5rem;
  font-size: 1.2rem;
}

.modal-content {
  padding: 1.5rem;
  overflow-y: auto;
  max-height: 70vh;
}

.form-section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1rem;
  color: #333;
  margin-bottom: 1rem;
  font-weight: normal;
}

.form-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-with-edit {
  position: relative;
  display: flex;
}

.form-control {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
  flex: 1;
  padding-right: 30px; /* Espacio para el botón de edición */
}

.edit-button {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #4a634b;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.25rem;
}

label {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #444;
}

.checkbox-title {
  margin-bottom: 0.75rem;
  font-weight: bold;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkboxes-row {
  align-items: flex-start;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.checkbox-item label {
  margin-bottom: 0;
}

.modal-footer {
  padding: 1rem;
  display: flex;
  justify-content: center;
  border-top: 1px solid #eee;
}

.register-button {
  background-color: #4a634b;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.register-button:hover {
  background-color: #3a5239;
}
</style> 