<template>
  <div class="language-selector" @click="toggleLanguage">
    <span>{{ currentLocale.toUpperCase() }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = ref(locale.value)

const toggleLanguage = () => {
  const newLocale = currentLocale.value === 'en' ? 'es' : 'en'
  locale.value = newLocale
  currentLocale.value = newLocale
}
</script>

<style scoped>
.language-selector {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  background-color: #444;
  cursor: pointer;
  color: white;
  font-weight: 600;
  user-select: none;
  transition: background-color 0.2s;
}

.language-selector:hover {
  background-color: #555;
}
</style>