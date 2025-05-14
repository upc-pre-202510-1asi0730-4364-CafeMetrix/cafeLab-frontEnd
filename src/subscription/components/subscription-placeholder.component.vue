<template>
  <div class="subscription-placeholder">
    <h1>Página de Selección de Suscripción</h1>
    <p>Esta página será desarrollada por otro equipo.</p>

    <div class="debug-info">
      <h3>Información de Desarrollo:</h3>
      <p>Esta es una página placeholder para la selección de suscripción.</p>
      <p>Puedes acceder a las siguientes rutas:</p>
      <ul>
        <li><router-link to="/dashboard/barista">Dashboard Barista</router-link></li>
        <li><router-link to="/dashboard/owner">Dashboard Propietario</router-link></li>
        <li><router-link to="/dashboard/complete">Dashboard Completo</router-link></li>
      </ul>

      <button @click="selectSubscription('barista')">Seleccionar Plan Barista</button>
      <button @click="selectSubscription('owner')">Seleccionar Plan Propietario</button>
      <button @click="selectSubscription('complete')">Seleccionar Plan Completo</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SubscriptionPlaceholder',
  methods: {
    selectSubscription(plan) {
      // Actualizar role en el usuario actual
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        user.role = plan;
        localStorage.setItem('user', JSON.stringify(user));

        // Redirigir al dashboard correspondiente
        this.$router.push({ name: plan + 'Dashboard' });
      }
    }
  }
}
</script>

<style scoped>
.subscription-placeholder {
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

.debug-info {
  margin-top: 50px;
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  text-align: left;
}

ul {
  margin: 20px 0;
  padding-left: 20px;
}

li {
  margin-bottom: 10px;
}

button {
  margin: 10px;
  padding: 10px 20px;
  background-color: #4c4c3d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #3a3a2e;
}
</style>