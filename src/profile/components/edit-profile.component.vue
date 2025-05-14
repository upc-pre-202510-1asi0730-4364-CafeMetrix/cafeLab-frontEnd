<template>
  <div class="profile-container">
    <!-- Breadcrumbs -->
    <div class="breadcrumbs">
      <button class="home-btn" @click="goToHome">{{ $t('profile.home') }}</button>
      <span class="breadcrumb-separator">></span>
      <span class="breadcrumb-item active">{{ $t('profile.profile') }}</span>
    </div>

    <div class="profile-content">
      <!-- Sección de foto de perfil -->
      <div class="profile-image-section">
        <div class="profile-image-container">
          <div class="profile-image" :style="{ backgroundImage: `url(${previewImage || defaultProfilePic})` }">
          </div>
          <button class="custom-button upload-photo-btn" @click="triggerFileInput">
            {{ $t('profile.upload_photo') }}
            <i class="pi pi-upload"></i>
          </button>
          <input
              type="file"
              ref="fileInput"
              accept="image/*"
              style="display: none"
              @change="handleFileUpload"
          />
        </div>
      </div>

      <!-- Sección de formulario -->
      <div class="profile-form-section">
        <!-- Fila 1: Nombre y Apellidos -->
        <div class="form-row">
          <div class="form-group">
            <label for="nombre">{{ $t('profile.firstname') }}</label>
            <div class="input-with-edit">
              <pv-input-text
                  id="nombre"
                  v-model="profile.name"
                  :disabled="!editingName"
                  class="w-full"
              />
              <button class="edit-btn" @click="toggleEdit('name')">
                <i class="pi pi-pencil"></i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="apellidos">{{ $t('profile.lastname') }}</label>
            <div class="input-with-edit">
              <pv-input-text
                  id="apellidos"
                  v-model="profile.lastname"
                  :disabled="!editingLastname"
                  class="w-full"
              />
              <button class="edit-btn" @click="toggleEdit('lastname')">
                <i class="pi pi-pencil"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Fila 2: Email y/o Cafetería -->
        <div class="form-row centered-row">
          <div class="form-group" v-if="isOwner">
            <label for="cafeteriaName">{{ $t('profile.cafe_name') }}</label>
            <div class="input-with-edit">
              <pv-input-text
                  id="cafeteriaName"
                  v-model="profile.cafeteriaName"
                  :disabled="!editingCafeteria"
                  class="w-full"
              />
              <button class="edit-btn" @click="toggleEdit('cafeteria')">
                <i class="pi pi-pencil"></i>
              </button>
            </div>
          </div>

          <div class="form-group centered-input">
            <label for="email">{{ $t('profile.email') }}</label>
            <div class="input-with-edit">
              <pv-input-text
                  id="email"
                  v-model="profile.email"
                  :disabled="!editingEmail"
                  class="w-full"
              />
              <button class="edit-btn" @click="toggleEdit('email')">
                <i class="pi pi-pencil"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Método de pago -->
        <div class="payment-section" :class="{ 'has-error': validationErrors.paymentMethod }">
          <label class="required-field">{{ $t('profile.payment_method') }}</label>
          <div class="payment-options">
            <div class="payment-option">
              <input
                  type="radio"
                  id="visa"
                  name="paymentMethod"
                  value="visa"
                  v-model="profile.paymentMethod"
                  required
              />
              <label for="visa" class="payment-card" :class="{ 'selected': profile.paymentMethod === 'visa' }">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" />
              </label>
            </div>

            <div class="payment-option">
              <input
                  type="radio"
                  id="mastercard"
                  name="paymentMethod"
                  value="mastercard"
                  v-model="profile.paymentMethod"
                  required
              />
              <label for="mastercard" class="payment-card" :class="{ 'selected': profile.paymentMethod === 'mastercard' }">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" />
              </label>
            </div>
          </div>
          <!-- Mensaje de error cuando no se selecciona método de pago -->
          <div v-if="validationErrors.paymentMethod" class="payment-error">
            {{ validationErrors.paymentMethod }}
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="form-actions">
          <button
              class="custom-button save-btn"
              @click="saveProfile"
          >
            {{ $t('profile.save') }}
          </button>

          <button
              v-if="showPlanButton && profile.paymentMethod"
              class="custom-button select-plan-btn"
              @click="goToSelectPlan"
          >
            {{ $t('profile.select_plan') }}
          </button>
        </div>

        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import ProfileService from '../services/profile.service.js';

export default {
  name: 'EditProfile',
  data() {
    return {
      profile: {
        id: '',
        name: '',
        lastname: '',
        email: '',
        cafeteriaName: '',
        role: '',
        paymentMethod: '',
        profilePicture: null
      },
      editingName: false,
      editingLastname: false,
      editingEmail: false,
      editingCafeteria: false,
      previewImage: null,
      selectedFile: null,
      message: '',
      messageType: 'success',
      showPlanButton: false,
      defaultProfilePic: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIEZvbnQgQXdlc29tZSBGcmVlIDUuMTUuNCBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIENvcHlyaWdodCAyMDIzIEZvbnRpY29ucywgSW5jLiAtLT48cGF0aCBkPSJNMjI0IDI1NkE3MiA3MiAwIDEgMCAyMjQgMTEyYTcyIDcyIDAgMSAwIDAgMTQ0em0wLTE3NmE0MCA0MCAwIDEgMSAwIDgwIDQwIDQwIDAgMSAxIDAtODBaTTEuNCAxMTIuNUMyNS45IDI2IDExMS43LTI2LjkgOTkuMiA3LjhDMTYwIDY5LjIgNzUgOTYgOTkuMiAxMjEuMmMxMi41IDEyLjUgMTIuNSAzMi44IDAgNDUuM0w2My44IDIwMi44YzMuMyAyNC42IDE0LjcgNDAgMjYuOSA0OXMyOC4xIDExLjYgNDYuOSAxNi43Yy0yNC45IDgtNDUuMiAxOS43LTU4IDMxLjVDNjQgMzE0IDU0LjQgMzMwLjggNTAuOCAzNDUuQzQ1LjkgMzY0LjQgNDggMzgyLjYgNTMuMiAzOTcuNWMxMS41IDMyLjcgMzYuMSA2Mi4yIDczLjIgNjEuNUM4My4zIDQ1OC4zIDg2LjggNDU5IDkwLjMgNDU5LjhsMzAuMiA2LjNjOS40IDIgMTkuMSA0LjEgMjguOCA0LjFzMTkuNS0yLjEgMjguOS00LjFsMzAuMi02LjNjMTguNy0zLjkgMjMuNS00LjYgMjYuMyA0LjNjMzcuMSAuNyA2MS44LTI4LjkgNzMuMy02MS41YzUuMi0xNC45IDcuMy0zMy4xIDIuNS01Mi40Yy0zLjYtMTQuMy0xMy4yLTMxLjItMjkuOC00NS4yYy0xMi44LTEwLjctMzAuNS0yMS42LTUyLjctMjkuNWMxNy44LTUuMiAzNC4zLTkuNCA0Ni40LTE2LjdjMTEuNi03IDIzLjgtMjMuMiAyNy04OC4ybC0zOS41LTM4LjljLTEyLjYtMTIuNi0xMi42LTMyLjkgMC00NS40YzI0LjItMjUuMi0xMC43LTUyLjEgNjEuNS0xMjIuOGMtMTIuNS0zNC43IDczLjMgMTggOTcuOCAxMDQuN2wzLjMgMTEuNmMzLjUgMTIuNS0zLjQgMjYtMTUuNSAyOS43bC05LjggMi45YzExLjEgMzIuNCAyNS44IDg5LjEgMjUuMiAxMzkuMmMtLjQgMzQuNS0xNS45IDYyLjUtMzkuNyA4NS40CmMtMTUuMyAxNC44LTM1LjMgMjQuNy01Ny44IDI5LjhjLTUuOSAxLjMtMTIgMi03LjUgOS4yYzUgOCA1LjUgOC44IDMuOCAxMi41Yy0yLjUgNS4zLTE0LjUgOS44LTE4LjIgNC40Yy0zLjctNS40LTgtMTMuMi00LjMtMjEuNmMyLjMtNS4yLTE0LjItMTcuMy0xOS4yLTIzLjFjLTQuNy01LjQtMzIuMi00Mi42LTMyLjItOTguOS0zLjYuMi03LjguMi0xMS42LjItMy44IDAtOC4xIDAtMTEuNi0uMmMwIDU2LjMtMjcuNSA5My41LTMyLjIgOTguOWMtNSA1LjgtMjEuNSAxNy45LTE5LjEgMjMuMWMzLjcgOC40LS42IDE2LjItNC40IDIxLjZjLTMuNyA1LjQtMTUuNy45LTE4LjItNC40Yy0xLjctMy43LTEuMi00LjUgMy44LTEyLjVjNC41LTcuMi0xLjYtNy45LTcuNS05LjJjLTIyLjQtNS4xLTQyLjQtMTUtNTcuOC0yOS44Yy0yMy44LTIzLTM5LjMtNTEtMzkuNy04NS40Yy0uNi01MC4yIDE0LjEtMTA2LjkgMjUuMi0xMzkuMmwtOS44LTIuOWMtMTIuMS0zLjctMTktMTcuMS0xNS41LTI5LjdsMy4zLTExLjZjMy41LTEyLjIuNC0yNS42LTguMy0zNS41Yy0xMS4yLTEyLjcgMi4xLTIxLjEgMjQtNjlsOS4xLTE5LjdjMy44LTcuOCAxNC05LjIgMTkuNi00LjNsOS43IDguNWM3LjUtNi4yIDIxLjItMTkuNCAzMi40LTQxQzE1My40IDczLjUgMTU0IDUxLjIgMTYuMSAwIDEwLjggMjAuNiA3LjcgMzMuNiA0LjMgNTAuOEwwIDY1LjNjLTIuNyA5LjYtLjIgMjAuMyA2LjQgMTN6bTc0IDk3LjFjLS4xLTEuOCAyLjUgMTYuOSA0MC44IDE2czQwLjgtMTguNiA0MC45LTE2LjdsLTIuMy0yLjJjLTMuMi0zLjEgMy41IDcgMS45LTQuNGMtMS45LTE0LjYtMTkuOC0uMi00MC41LS4ycy0zOC42LTE0LTQwLjUuMmMtMS42IDExLjcgNS40IDEuNiAxLjkgNS44bC0yLjIgMS42eiIvPjwvc3ZnPg==',
      // Añadir objeto para mensajes de validación
      validationErrors: {
        paymentMethod: ''
      }
    }
  },
  computed: {
    isOwner() {
      return this.profile.role === 'dueno_cafeteria';
    }
  },
  mounted() {
    this.loadUserProfile();
  },
  methods: {
    loadUserProfile() {
      // Resetear completamente los datos del perfil para evitar datos residuales
      this.profile = {
        id: '',
        name: '',
        lastname: '',
        email: '',
        cafeteriaName: '',
        role: '',
        paymentMethod: '',
        profilePicture: null
      };

      // Resetear también la vista previa de la imagen y el botón de plan
      this.previewImage = null;
      this.selectedFile = null;
      this.showPlanButton = false;

      // Resetear validaciones
      this.validationErrors = {
        paymentMethod: ''
      };

      // Obtener información del usuario desde localStorage
      console.log('====== CARGANDO PERFIL DE USUARIO ======');

      // Obtener información del usuario desde localStorage
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('Usuario del localStorage:', user);
        console.log('hasPlan:', user.hasPlan);
        console.log('plan:', user.plan);
        console.log('Tipo de hasPlan:', typeof user.hasPlan);
        try {
          const user = JSON.parse(userStr);
          console.log("Cargando perfil del usuario:", user);

          // Asignar cada propiedad al objeto limpio
          this.profile.id = user.id || '';
          this.profile.name = user.name ? user.name.split(' ')[0] : '';
          this.profile.lastname = user.name && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : '';
          this.profile.email = user.email || '';
          this.profile.cafeteriaName = user.cafeteriaName || '';
          this.profile.role = user.role || '';
          this.profile.paymentMethod = user.paymentMethod || '';
          this.profile.profilePicture = user.profilePicture || null;

          // Actualizar la vista previa de la imagen si existe
          if (user.profilePicture) {
            this.previewImage = user.profilePicture;
          }

          // Comprobar si debe mostrar el botón de plan
          this.showPlanButton = user && !user.hasPlan;

          // Resetear estados de edición
          this.editingName = false;
          this.editingLastname = false;
          this.editingEmail = false;
          this.editingCafeteria = false;

          console.log("Perfil cargado:", this.profile);
        } catch (e) {
          console.error('Error al parsear el usuario del localStorage:', e);
        }
      }
    },
    toggleEdit(field) {
      switch(field) {
        case 'name':
          this.editingName = !this.editingName;
          break;
        case 'lastname':
          this.editingLastname = !this.editingLastname;
          break;
        case 'email':
          this.editingEmail = !this.editingEmail;
          break;
        case 'cafeteria':
          this.editingCafeteria = !this.editingCafeteria;
          break;
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validación de tipo de archivo
      if (!file.type.match('image.*')) {
        this.message = 'Por favor selecciona una imagen válida';
        this.messageType = 'error';
        return;
      }

      // Verificar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.message = 'La imagen no debe superar los 5MB';
        this.messageType = 'error';
        return;
      }

      this.selectedFile = file;

      // Crear una vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImage = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    validateForm() {
      let isValid = true;

      // Resetear errores de validación
      this.validationErrors = {
        paymentMethod: ''
      };

      // Validar método de pago
      if (!this.profile.paymentMethod) {
        this.validationErrors.paymentMethod = 'Por favor selecciona un método de pago';
        isValid = false;
      }

      return isValid;
    },
    async saveProfile() {
      // Validar el formulario antes de proceder
      if (!this.validateForm()) {
        this.message = 'Por favor completa todos los campos requeridos';
        this.messageType = 'error';
        return;
      }

      try {
        // Combinar nombre y apellido
        const fullName = `${this.profile.name} ${this.profile.lastname}`.trim();

        // Verificar si existe un usuario actual en localStorage para obtener hasPlan y plan
        let currentUser = {};
        const currentUserStr = localStorage.getItem('currentUser');
        if (currentUserStr) {
          try {
            currentUser = JSON.parse(currentUserStr);
          } catch (e) {
            console.error('Error al parsear usuario actual:', e);
          }
        }

        // Crear el objeto de usuario actualizado
        const updatedUser = {
          id: this.profile.id,
          name: fullName,
          email: this.profile.email,
          role: this.profile.role,
          cafeteriaName: this.isOwner ? this.profile.cafeteriaName : '',
          experience: this.profile.experience || '',  // Asegurarse de incluir este campo
          paymentMethod: this.profile.paymentMethod, // Este campo ahora es obligatorio
          profilePicture: this.previewImage || '',
          hasPlan: currentUser.hasPlan || false,     // Preservar hasPlan
          plan: currentUser.plan || ''                // Preservar plan
        };

        // Si hay una imagen seleccionada, convertirla a base64
        if (this.selectedFile) {
          updatedUser.profilePicture = await this.convertFileToBase64(this.selectedFile);
        }

        // Actualizar perfil usando el servicio
        try {
          const result = await ProfileService.updateProfile(updatedUser);

          this.message = 'Perfil actualizado correctamente';
          this.messageType = 'success';

          // Actualizar datos en localStorage
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));

          // Mostrar botón para continuar a selección de plan solo después de guardar correctamente
          this.showPlanButton = !updatedUser.hasPlan;

        } catch (error) {
          console.error('Error al actualizar perfil con API:', error);
          this.message = 'Error al actualizar el perfil. Inténtalo de nuevo.';
          this.messageType = 'error';
          throw error;
        }
      } catch (error) {
        console.error('Error al guardar el perfil:', error);
        this.message = 'Error al actualizar el perfil. Inténtalo de nuevo.';
        this.messageType = 'error';
      }
    },
    goToHome() {
      this.$router.push('/');
    },
    goToSelectPlan() {
      this.$router.push('/select-plan');
    },
    convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    }
  }
}
</script>


<style scoped>
/* Contenedor principal */
.profile-container {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  overflow-x: hidden; /* Eliminar barra lateral horizontal */
}

/* Breadcrumbs */
.breadcrumbs {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding: 10px 0;
  color: #666;
}

.home-btn {
  background: none;
  border: none;
  color: #4c4c3d;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.home-btn:hover {
  color: #2a2a22;
}

.breadcrumb-separator {
  margin: 0 10px;
}

.breadcrumb-item.active {
  color: #333;
  font-weight: 500;
}

/* Contenido principal */
.profile-content {
  display: flex;
  flex-direction: row;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* Sección de imagen de perfil */
.profile-image-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px;
  background-color: #f8f9fa;
  min-width: 300px;
}

.profile-image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-image {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #ddd;
  background-size: cover;
  background-position: center;
  margin-bottom: 20px;
  border: 1px solid #eee;
}

/* Botón personalizado con estilo consistente */
.custom-button {
  padding: 10px 16px;
  background-color: #4c4c3d;
  color: white;
  border: none;
  border-radius: 200px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 5px;
}

.custom-button:hover {
  background-color: white;
  color: #4D6443;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-button:active {
  background-color: transparent;
  color: #4D6443;
  border: 1px solid #4D6443;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.upload-photo-btn {
  margin-top: 10px;
}

/* Sección de formulario */
.profile-form-section {
  flex: 1;
  padding: 40px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.centered-row {
  justify-content: center;
}

.form-group {
  flex: 1;
}

.centered-input {
  max-width: 400px;
  margin: 0 auto;
}

label {
  display: block;
  font-size: 14px;
  color: #555;
  margin-bottom: 8px;
  font-weight: 500;
}

/* Estilo para campo obligatorio */
.required-field::after {
  content: ' *';
  color: #e53935;
  margin-left: 2px;
}

.input-with-edit {
  display: flex;
  align-items: center;
  gap: 10px;
}

.edit-btn {
  background: none;
  border: none;
  color: #4c4c3d;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

/* Sección de método de pago mejorada */
.payment-section {
  margin: 30px auto;
  max-width: 300px;
  text-align: center;
}

.payment-section.has-error .payment-options {
  border: 1px solid rgba(229, 57, 53, 0.3);
  border-radius: 8px;
  padding: 10px;
  background-color: rgba(229, 57, 53, 0.05);
}

.payment-options {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
  padding: 10px;
  transition: all 0.3s ease;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Estilos para los radiobuttons */
.payment-option input[type="radio"] {
  margin-right: 5px;
  cursor: pointer;
}

.payment-card {
  width: 90px;
  height: 55px;
  border: 2px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.payment-card:hover {
  border-color: #4c4c3d;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.payment-card.selected {
  border-color: #4c4c3d;
  background-color: rgba(76, 76, 61, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.payment-card img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

/* Mensaje de error para el método de pago */
.payment-error {
  color: #e53935;
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
}

/* Botón de guardar y seleccionar plan */
.form-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.save-btn, .select-plan-btn {
  min-width: 120px;
}

/* Mensajes */
.message {
  margin-top: 20px;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
}

.success {
  background-color: #e7f7ef;
  color: #43a047;
}

.error {
  background-color: #fdeded;
  color: #e53935;
}

/* Responsive */
@media (max-width: 768px) {
  .profile-content {
    flex-direction: column;
  }

  .profile-image-section {
    width: 100%;
    min-width: auto;
  }

  .form-row {
    flex-direction: column;
    gap: 15px;
  }

  .payment-options {
    justify-content: center;
  }

  .form-actions {
    flex-direction: column;
    align-items: center;
  }

  .custom-button {
    margin-bottom: 10px;
  }
}
</style>