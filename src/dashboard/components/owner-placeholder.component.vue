<template>
  <div class="dashboard-placeholder">
    <h1>Dashboard de Dueño de Cafetería</h1>
    <p>Esta página será desarrollada por otro equipo.</p>

    <div class="user-info">
      <h3>Información del Usuario:</h3>
      <p><strong>Nombre:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Rol:</strong> {{ user.role === 'barista' ? 'Barista' : 'Dueño de Cafetería' }}</p>
      <p><strong>Plan:</strong> {{ getPlanName(user.plan) }}</p>
      <p><strong>Cafetería:</strong> {{ user.cafeteriaName || 'No especificado' }}</p>
      <p><strong>Método de Pago:</strong> {{ getPaymentMethodName(user.paymentMethod) }}</p>
      <p v-if="user.experience"><strong>Experiencia:</strong> {{ user.experience }}</p>
    </div>

    <button @click="logout" class="logout-btn">Cerrar Sesión</button>
  </div>
</template>

<script>
export default {
  name: 'OwnerDashboardPlaceholder',
  data() {
    return {
      user: {}
    }
  },
  created() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      // Corrección: Cambio de 'user' a 'currentUser'
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          this.user = JSON.parse(userData);
          console.log('Usuario cargado en dashboard dueño:', this.user);
        } catch (e) {
          console.error('Error al parsear datos de usuario:', e);
          this.$router.push('/login');
        }
      } else {
        // Si no hay datos de usuario, redirigir al login
        this.$router.push('/login');
      }
    },
    // Método para cerrar sesión
    logout() {
      localStorage.removeItem('currentUser');
      this.$router.push('/login');
    },
    getPlanName(planCode) {
      const plans = {
        'barista': 'Plan Barista',
        'admin': 'Plan Dueño/Administrador',
        'complete': 'Plan Completo'
      };
      return plans[planCode] || 'Plan Desconocido';
    },
    getPaymentMethodName(method) {
      const methods = {
        'visa': 'Tarjeta Visa',
        'mastercard': 'Tarjeta Mastercard'
      };
      return methods[method] || 'No especificado';
    }
  }
}
</script>

<style scoped>
.dashboard-placeholder {
  max-width: 800px;
  margin: 50px auto;
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

.user-info {
  margin-top: 30px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  text-align: left;
}

.user-info p {
  margin: 10px 0;
}

.logout-btn {
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #4c4c3d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #3a3a2e;
}
</style>