<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Página No Encontrada</h2>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <button @click="goToLogin" class="btn-primary">Volver a Inicio</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
  methods: {
    goToLogin() {
      this.$router.push({ name: 'Login' });
    }
  }
}
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  text-align: center;
}

.not-found-content {
  background-color: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

h1 {
  font-size: 5rem;
  margin: 0;
  color: #4c4c3d;
}

h2 {
  margin-top: 0.5rem;
  color: #333;
}

p {
  color: #666;
  margin-bottom: 2rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background-color: #4c4c3d;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #3a3a2e;
}
</style>