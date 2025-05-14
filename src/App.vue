<script setup>
// No need to import components directly, they'll be loaded by the router
</script>

<template>
  <div class="app-container">
    <router-view />
  </div>
</template>

<style>
.app-container {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Estilos globales */
body {
  margin: 0;
  font-family: 'Arial', sans-serif;
}

/* Estilos para el contenedor principal */
#app {
  height: 100vh;
  width: 100%;
}
</style>
