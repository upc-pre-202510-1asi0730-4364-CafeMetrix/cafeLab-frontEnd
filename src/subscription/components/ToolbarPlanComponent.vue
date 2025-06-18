<template>
  <header class="toolbar-plan">
    <div class="logo-container">
      <div class="logo-btn">
        <img src="/public/Logo.png" alt="Café Lab" class="logo-img" />
      </div>
    </div>
    <span class="spacer"></span>
    <div class="language-switcher-container">
      <LanguageSwitcher />
    </div>
  </header>
</template>

<script setup>

import LanguageSwitcher from '../../public/components/language-switcher.component.vue'
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Montserrat:600,700&display=swap');

.toolbar-plan {
  background-color: #618985 !important;
  display: flex;
  align-items: center;
  padding: 20px 16px;
  width: 100vw;
  box-sizing: border-box;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: auto;
  max-height: 60px;
  width: auto;
  max-width: 100%;
  border-radius: 20px;
}

.spacer {
  flex: 1 1 auto;
}

.toolbar-button,
.language-switcher-container {
  width: 100%;
  margin: 6px 0;
  min-width: unset;
  text-align: left;
  padding: 8px 0;
}

.language-switcher-container {
  margin-left: 13px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

body,
html {
  margin: 0;
  padding: 0;
}
</style>
