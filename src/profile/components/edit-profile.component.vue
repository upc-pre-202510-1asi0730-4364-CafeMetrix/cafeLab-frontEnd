<template>
  <div class="profile-container">
    <div class="edit-profile-card">
      <h1>Completa tu perfil</h1>

      <div class="profile-picture-section">
        <div class="profile-picture" :style="{ backgroundImage: `url(${previewImage || defaultProfilePic})` }">
          <div class="upload-overlay" @click="triggerFileInput">
            <span>{{ previewImage ? 'Cambiar foto' : 'Subir foto' }}</span>
          </div>
        </div>
        <input
            type="file"
            ref="fileInput"
            accept="image/*"
            style="display: none"
            @change="handleFileUpload"
        />
        <button class="upload-btn" @click="triggerFileInput">
          <span>Subir Foto de Perfil</span>
          <i class="upload-icon">↑</i>
        </button>
      </div>

      <div class="profile-form">
        <div class="form-row">
          <div class="form-group">
            <label for="nombres">Nombres</label>
            <div class="input-with-edit">
              <input
                  type="text"
                  id="nombres"
                  v-model="profile.name"
                  :disabled="!editingName"
              />
              <button class="edit-btn" @click="toggleEdit('name')">
                <i class="edit-icon">✎</i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="apellidos">Apellidos</label>
            <div class="input-with-edit">
              <input
                  type="text"
                  id="apellidos"
                  v-model="profile.lastname"
                  :disabled="!editingLastname"
              />
              <button class="edit-btn" @click="toggleEdit('lastname')">
                <i class="edit-icon">✎</i>
              </button>
            </div>
          </div>
        </div>

        <div class="form-row" v-if="isOwner">
          <div class="form-group">
            <label for="cafeteriaName">Nombre de Cafetería</label>
            <div class="input-with-edit">
              <input
                  type="text"
                  id="cafeteriaName"
                  v-model="profile.cafeteriaName"
                  :disabled="!editingCafeteria"
              />
              <button class="edit-btn" @click="toggleEdit('cafeteria')">
                <i class="edit-icon">✎</i>
              </button>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-with-edit">
              <input
                  type="email"
                  id="email"
                  v-model="profile.email"
                  :disabled="!editingEmail"
              />
              <button class="edit-btn" @click="toggleEdit('email')">
                <i class="edit-icon">✎</i>
              </button>
            </div>
          </div>
        </div>

        <div class="payment-section">
          <h2>Método de pago</h2>
          <div class="payment-options">
            <div class="payment-option">
              <input
                  type="radio"
                  id="visa"
                  value="visa"
                  v-model="profile.paymentMethod"
                  name="paymentMethod"
              />
              <label for="visa" class="payment-label">
                <div class="card-icon visa-icon">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" />
                </div>
              </label>
            </div>

            <div class="payment-option">
              <input
                  type="radio"
                  id="mastercard"
                  value="mastercard"
                  v-model="profile.paymentMethod"
                  name="paymentMethod"
              />
              <label for="mastercard" class="payment-label">
                <div class="card-icon mastercard-icon">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" />
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button class="save-btn" @click="saveProfile">Guardar</button>
        </div>

        <!-- Botón para ir a selección de plan -->
        <div v-if="showPlanButton" class="select-plan-action">
          <button class="plan-btn" @click="goToSelectPlan">Ir a seleccionar plan</button>
        </div>

        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileService from '../services/profile.service';

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
      defaultProfilePic: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0NDggNTEyIj48IS0tIEZvbnQgQXdlc29tZSBGcmVlIDUuMTUuNCBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbSBMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIENvcHlyaWdodCAyMDIzIEZvbnRpY29ucywgSW5jLiAtLT48cGF0aCBkPSJNMjI0IDI1NkE3MiA3MiAwIDEgMCAyMjQgMTEyYTcyIDcyIDAgMSAwIDAgMTQ0em0wLTE3NmE0MCA0MCAwIDEgMSAwIDgwIDQwIDQwIDAgMSAxIDAtODBaTTEuNCAxMTIuNUMyNS45IDI2IDExMS43LTI2LjkgOTkuMiA3LjhDMTYwIDY5LjIgNzUgOTYgOTkuMiAxMjEuMmMxMi41IDEyLjUgMTIuNSAzMi44IDAgNDUuM0w2My44IDIwMi44YzMuMyAyNC42IDE0LjcgNDAgMjYuOSA0OXMyOC4xIDExLjYgNDYuOSAxNi43Yy0yNC45IDgtNDUuMiAxOS43LTU4IDMxLjVDNjQgMzE0IDU0LjQgMzMwLjggNTAuOCAzNDUuQzQ1LjkgMzY0LjQgNDggMzgyLjYgNTMuMiAzOTcuNWMxMS41IDMyLjcgMzYuMSA2Mi4yIDczLjIgNjEuNUM4My4zIDQ1OC4zIDg2LjggNDU5IDkwLjMgNDU5LjhsMzAuMiA2LjNjOS40IDIgMTkuMSA0LjEgMjguOCA0LjFzMTkuNS0yLjEgMjguOS00LjFsMzAuMi02LjNjMTguNy0zLjkgMjMuNS00LjYgMjYuMyA0LjNjMzcuMSAuNyA2MS44LTI4LjkgNzMuMy02MS41YzUuMi0xNC45IDcuMy0zMy4xIDIuNS01Mi40Yy0zLjYtMTQuMy0xMy4yLTMxLjItMjkuOC00NS4yYy0xMi44LTEwLjctMzAuNS0yMS42LTUyLjctMjkuNWMxNy44LTUuMiAzNC4zLTkuNCA0Ni40LTE2LjdjMTEuNi03IDIzLjgtMjMuMiAyNy04OC4ybC0zOS41LTM4LjljLTEyLjYtMTIuNi0xMi42LTMyLjkgMC00NS40YzI0LjItMjUuMi0xMC43LTUyLjEgNjEuNS0xMjIuOGMtMTIuNS0zNC43IDczLjMgMTggOTcuOCAxMDQuN2wzLjMgMTEuNmMzLjUgMTIuNS0zLjQgMjYtMTUuNSAyOS43bC05LjggMi45YzExLjEgMzIuNCAyNS44IDg5LjEgMjUuMiAxMzkuMmMtLjQgMzQuNS0xNS45IDYyLjUtMzkuNyA4NS40CmMtMTUuMyAxNC44LTM1LjMgMjQuNy01Ny44IDI5LjhjLTUuOSAxLjMtMTIgMi03LjUgOS4yYzUgOCA1LjUgOC44IDMuOCAxMi41Yy0yLjUgNS4zLTE0LjUgOS44LTE4LjIgNC40Yy0zLjctNS40LTgtMTMuMi00LjMtMjEuNmMyLjMtNS4yLTE0LjItMTcuMy0xOS4yLTIzLjFjLTQuNy01LjQtMzIuMi00Mi42LTMyLjItOTguOS0zLjYuMi03LjguMi0xMS42LjItMy44IDAtOC4xIDAtMTEuNi0uMmMwIDU2LjMtMjcuNSA5My41LTMyLjIgOTguOWMtNSA1LjgtMjEuNSAxNy45LTE5LjEgMjMuMWMzLjcgOC40LS42IDE2LjItNC40IDIxLjZjLTMuNyA1LjQtMTUuNy45LTE4LjItNC40Yy0xLjctMy43LTEuMi00LjUgMy44LTEyLjVjNC41LTcuMi0xLjYtNy45LTcuNS05LjJjLTIyLjQtNS4xLTQyLjQtMTUtNTcuOC0yOS44Yy0yMy44LTIzLTM5LjMtNTEtMzkuNy04NS40Yy0uNi01MC4yIDE0LjEtMTA2LjkgMjUuMi0xMzkuMmwtOS44LTIuOWMtMTIuMS0zLjctMTktMTcuMS0xNS41LTI5LjdsMy4zLTExLjZjMy41LTEyLjIuNC0yNS42LTguMy0zNS41Yy0xMS4yLTEyLjcgMi4xLTIxLjEgMjQtNjlsOS4xLTE5LjdjMy44LTcuOCAxNC05LjIgMTkuNi00LjNsOS43IDguNWM3LjUtNi4yIDIxLjItMTkuNCAzMi40LTQxQzE1My40IDczLjUgMTU0IDUxLjIgMTYuMSAwIDEwLjggMjAuNiA3LjcgMzMuNiA0LjMgNTAuOEwwIDY1LjNjLTIuNyA5LjYtLjIgMjAuMyA2LjQgMTN6bTc0IDk3LjFjLS4xLTEuOCAyLjUgMTYuOSA0MC44IDE2czQwLjgtMTguNiA0MC45LTE2LjdsLTIuMy0yLjJjLTMuMi0zLjEgMy41IDcgMS45LTQuNGMtMS45LTE0LjYtMTkuOC0uMi00MC41LS4ycy0zOC42LTE0LTQwLjUuMmMtMS42IDExLjcgNS40IDEuNiAxLjkgNS44bC0yLjIgMS42eiIvPjwvc3ZnPg=='
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
    async saveProfile() {
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
          paymentMethod: this.profile.paymentMethod || '',
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

          // Mostrar botón para continuar a selección de plan
          this.showPlanButton = !updatedUser.hasPlan;

        } catch (error) {
          console.error('Error al actualizar perfil con API:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error al guardar el perfil:', error);
        this.message = 'Error al actualizar el perfil. Inténtalo de nuevo.';
        this.messageType = 'error';
      }
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
.profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
}

.edit-profile-card {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

h1 {
  text-align: center;
  color: #4c4c3d;
  margin-bottom: 2rem;
  font-weight: 600;
}

.profile-picture-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.profile-picture {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #e0e0e0;
  background-size: cover;
  background-position: center;
  position: relative;
  margin-bottom: 1rem;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.profile-picture:hover .upload-overlay {
  opacity: 1;
}

.upload-btn {
  display: flex;
  align-items: center;
  background-color: #4c4c3d;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.upload-btn:hover {
  background-color: #3a3a2e;
}

.upload-icon {
  margin-left: 8px;
}

.profile-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  flex: 1;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.input-with-edit {
  display: flex;
  align-items: center;
}

input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  width: 100%;
}

input:disabled {
  background-color: #f9f9f9;
  cursor: not-allowed;
}

.edit-btn {
  background: none;
  border: none;
  color: #4c4c3d;
  cursor: pointer;
  margin-left: 0.5rem;
}

.edit-icon {
  font-style: normal;
}

.payment-section {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.payment-section h2 {
  color: #4c4c3d;
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.payment-options {
  display: flex;
  gap: 1.5rem;
}

.payment-option {
  display: flex;
  align-items: center;
}

.payment-label {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  margin-left: 0.5rem;
  transition: border-color 0.3s;
}

input[type="radio"]:checked + .payment-label {
  border-color: #4c4c3d;
  background-color: #f9f9f9;
}

.card-icon {
  width: 60px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  overflow: hidden;
}

.card-icon img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.save-btn {
  background-color: #4c4c3d;
  color: white;
  border: none;
  padding: 0.75rem 3rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.save-btn:hover {
  background-color: #3a3a2e;
}

.select-plan-action {
  margin-top: 1.5rem;
  text-align: center;
}

.plan-btn {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.75rem 3rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.plan-btn:hover {
  background-color: #218838;
}

.message {
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  border-radius: 4px;
}

.success {
  background-color: #e7f7ef;
  color: #43a047;
}

.error {
  background-color: #fdeded;
  color: #e53935;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
    gap: 1rem;
  }

  .edit-profile-card {
    padding: 1.5rem;
    margin: 1rem;
  }
}
</style>