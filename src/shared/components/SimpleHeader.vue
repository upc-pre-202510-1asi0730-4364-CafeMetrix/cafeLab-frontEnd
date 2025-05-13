<template>
  <pv-toolbar class="simple-header">
    <template #start>
      <div class="logo-container">
        <pv-image src="/logo.png" alt="Café Lab" class="logo-img" />
      </div>
    </template>
    <template #end>
      <LanguageSwitcher />
    </template>
  </pv-toolbar>
</template>

<script setup>
import LanguageSwitcher from '../../public/components/LanguageSwitcher.vue';
</script>

<style scoped>
.simple-header {
  background-color: #5e776d;
  color: white;
  font-family: 'Inter', sans-serif;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 0 30px;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #414733;
  border-radius: 24px;
  width: 90px;
  height: 48px;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.13);
}

.logo-img {
  height: 70%;
  width: auto;
}
</style>