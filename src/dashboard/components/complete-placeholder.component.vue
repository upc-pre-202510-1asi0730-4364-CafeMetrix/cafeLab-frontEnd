<template>
  <div class="dashboard-placeholder">
    <h1>Dashboard Completo</h1>
    <p>Esta página será desarrollada por otro equipo.</p>

    <div class="user-info">
      <h3>Información del Usuario:</h3>
      <p><strong>Nombre:</strong> {{ user.name }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Rol:</strong> {{ user.role === 'barista' ? 'Barista' : 'Dueño de Cafetería' }}</p>
      <p><strong>Plan:</strong> {{ getPlanName(user.plan) }}</p>
      <p><strong>Nombre de Cafetería:</strong> {{ user.cafeteriaName || 'No especificado' }}</p>
      <p v-if="user.experience"><strong>Experiencia:</strong> {{ user.experience }}</p>
      <p><strong>Método de Pago:</strong> {{ getPaymentMethodName(user.paymentMethod) }}</p>
    </div>

    <div class="features-info">
      <h3>Características Disponibles:</h3>
      <p>Este dashboard incluye todas las funcionalidades de los dashboards de barista y propietario.</p>

      <div class="feature-cards">
        <div class="feature-card">
          <h4>Análisis Avanzado</h4>
          <p>Métricas detalladas y visualizaciones interactivas</p>
        </div>
        <div class="feature-card">
          <h4>Gestión Completa</h4>
          <p>Administra personal, inventario y clientes</p>
        </div>
        <div class="feature-card">
          <h4>Reportes Premium</h4>
          <p>Informes personalizados y exportación avanzada</p>
        </div>
      </div>
    </div>

    <button @click="logout" class="logout-btn">Cerrar Sesión</button>
  </div>
</template>

<script>
export default {
  name: 'CompleteDashboardPlaceholder',
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
      // Corregido: cambio de 'user' a 'currentUser' para ser consistente con el resto de la aplicación
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          this.user = JSON.parse(userData);
          console.log('Usuario cargado en dashboard completo:', this.user);
        } catch (e) {
          console.error('Error al parsear datos de usuario:', e);
          this.$router.push('/login');
        }
      } else {
        // Si no hay datos de usuario, redirigir al login
        this.$router.push('/login');
      }
    },
    logout() {
      // Eliminar datos del usuario
      localStorage.removeItem('currentUser'); // Corregido: cambio de 'user' a 'currentUser'
      // Redirigir al login
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
  max-width: 900px;
  margin: 50px auto;
  padding: 30px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #3c3c3c;
  margin-bottom: 20px;
  font-size: 2.2rem;
}

.user-info, .features-info {
  margin-top: 30px;
  padding: 25px;
  background-color: #ffffff;
  border-radius: 10px;
  text-align: left;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-info p {
  margin: 10px 0;
  font-size: 1.1rem;
}

.features-info {
  background-color: #f0f7ff;
}

.features-info h3 {
  color: #3c3c3c;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.feature-cards {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 25px;
  gap: 20px;
}

.feature-card {
  flex: 1;
  min-width: 230px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.feature-card h4 {
  color: #4c4c3d;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.logout-btn {
  margin-top: 40px;
  padding: 12px 30px;
  background-color: #4c4c3d;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #3a3a2e;
}

@media (max-width: 768px) {
  .dashboard-placeholder {
    margin: 30px 15px;
    padding: 20px;
  }

  .feature-cards {
    flex-direction: column;
  }

  .feature-card {
    margin-bottom: 15px;
  }
}
</style>