<template>
  <header class="header-barInit">
    <div class="logo-btn">
      <img src="/public/Logo.png" alt="Café Lab" class="logo-img" />
    </div>

    <div class="actions">
      <LanguageSwitcher />
    </div>
  </header>
</template>

<script setup>
import LanguageSwitcher from '../components/language-switcher.component.vue'

</script>

<style scoped>
.header-barInit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
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

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 15px;
}

.login-btn,
.lang-btn {
  background-color: #3e3e3e;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
}

.lang-btn span {
  margin-left: 4px;
}

.nav-btn {
  background-color: #3e3e3e;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.nav-btn:hover {
  background-color: #2f2f2f;
}
</style>