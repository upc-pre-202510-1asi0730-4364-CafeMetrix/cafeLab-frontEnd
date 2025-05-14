<template>
  <header class="cupping-header">
    <div class="logo-btn">
      <img src="../../assets/logo.png" alt="Café Lab" class="logo-img" />
    </div>
    <nav class="nav-buttons">
      <button @click="navigateTo('/')">{{ t('supply.menu.home') }}</button>
      <button @click="navigateTo('/features')">{{ t('supply.menu.features') }}</button>
      <button @click="navigateTo('/contact')">{{ t('supply.menu.contact') }}</button>
      <button @click="navigateTo('/profile')">{{ t('supply.menu.profile') }}</button>
      <button class="lang-btn" @click="toggleLanguage">{{ currentLangLabel }} ▸</button>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t, locale } = useI18n()
const router = useRouter()

const currentLangLabel = computed(() => (locale.value === 'es' ? 'ES' : 'EN'))

function toggleLanguage() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  localStorage.setItem('locale', locale.value)
}

function navigateTo(path) {
  router.push(path)
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
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  height: 72px; /* Altura fija para el header */
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