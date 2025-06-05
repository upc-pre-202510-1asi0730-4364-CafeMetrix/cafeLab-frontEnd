<template>
  <header class="cupping-header">
    <div class="logo-btn">
      <img src="/logo.png" alt="Café Lab" class="logo-img" />
    </div>
    <nav class="nav-buttons">
      <button>Inicio</button>
      <button>Funcionalidades</button>
      <button>Contáctanos</button>
      <button>Perfil</button>
      <button class="lang-btn" @click="toggleLanguage">{{ currentLangLabel }} ▸</button>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const currentLangLabel = computed(() => (locale.value === 'es' ? 'ES' : 'EN'))

function toggleLanguage() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  localStorage.setItem('locale', locale.value)
}
</script>

<style>
.cupping-header {
  background-color: #5f7f71;
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Inter', sans-serif;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}

.logo-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #414733;
  border-radius: 24px;
  width: 90px;
  height: 48px;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.13);
  margin: 0;
  padding: 0;
}

.logo-img {
  height: 70%;
  width: auto;
  display: block;
}

.nav-buttons {
  display: flex;
  gap: 12px;
}

.nav-buttons button {
  background-color: #36382e;
  color: white;
  padding: 6px 14px;
  border: none;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.lang-btn {
  font-size: 13px;
}
</style>
