<script setup>

</script>

<template>
  <div id="app">
    <router-view></router-view> <!-- Este es el contenedor para las vistas de ruta -->
  </div>
  <router-view />
</template>
<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
});
</script>
<style scoped>

</style>
