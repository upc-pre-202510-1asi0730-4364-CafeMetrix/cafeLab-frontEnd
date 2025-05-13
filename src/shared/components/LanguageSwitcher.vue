<template>
  <button class="lang-btn" @click="toggleLanguage">{{ currentLangLabel }} <span>▸</span></button>
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

<style scoped>
.lang-btn {
  background-color: #3e3e3e;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.lang-btn span {
  margin-left: 4px;
}
</style>
