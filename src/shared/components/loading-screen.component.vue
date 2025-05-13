<template>
  <div class="loading-container">
    <div class="loading-content">
      <div class="loading-message">Iniciando sesión...</div>
      <div class="spinner"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingScreen',
  created() {
    // Obtener datos del usuario
    const userData = localStorage.getItem('user');

    if (!userData) {
      // Si no hay datos de usuario, redirigir al login
      this.$router.push({ name: 'Login' });
      return;
    }

    const user = JSON.parse(userData);

    // Simular carga de datos y verificación de suscripción
    setTimeout(() => {
      // Redirigir al dashboard según la suscripción del usuario
      switch(user.role) {
        case 'barista':
          this.$router.push({ name: 'BaristaDashboard' });
          break;
        case 'owner':
          this.$router.push({ name: 'OwnerDashboard' });
          break;
        case 'complete':
          this.$router.push({ name: 'CompleteDashboard' });
          break;
        default:
          // Si no tiene suscripción, redirigir a la página de selección de suscripción
          this.$router.push({ name: 'Subscription' });
      }
    }, 2000); // Simular 2 segundos de carga
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  background-image: url('src/assets/coffee-bg.jpg');
  background-size: cover;
  background-position: center;
  background-blend-mode: overlay;
}

.loading-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.loading-message {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1.5rem;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #4c4c3d;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>