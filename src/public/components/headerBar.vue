<template>
  <header class="headerBar">
    <div class="logo-btn">
      <img src="/public/Logo.png" alt="Café Lab" class="logo-img" />
    </div>
    <nav class="nav-links">
      <button class="nav-btn" @click="goToDashboard">{{ $t('navbar.features') }}</button>
      <button class="nav-btn" @click="goToContact">{{ $t('navbar.contact') }}</button>
      <button class="nav-btn" @click="goToEdit">{{ $t('navbar.profile') }}</button>
    </nav>


    <div class="actions">
      <LanguageSwitcher />
      <button class="logout-btn" @click="logout">{{ $t('navbar.logout') }}</button>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from '../components/language-switcher.component.vue'
import { useAuthService } from '../../auth/services/authService.js'

const router = useRouter()
const auth = useAuthService()
const { t } = useI18n()

function goToDashboard() {
  if (!auth.isLoggedIn()) {
    return router.push({ name: 'login' })
  }

  const user = auth.getCurrentUser()
  const dashboardRoutes = {
    barista: 'baristaDashboard',
    owner: 'ownerDashboard',
    complete: 'completeDashboard'
  }

  const plan = user.plan?.toLowerCase()
  const targetRoute = dashboardRoutes[plan] || 'default'

  router.push({ name: targetRoute })
}

function goToContact() {
  router.push({ name: 'contactUs' })
}
function goToEdit() {
  router.push({ name: 'edit-profile-session' })
}

function logout() {
  const confirmed = window.confirm(t('navbar.logoutConfirm'))

  if (confirmed) {
    auth.logout()
    router.push({ name: 'login' })
  }
}
</script>



<style scoped>
.headerBar {
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
  width: 100%;
  height: 100%;
  object-fit: contain;
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

.logout-btn {
  background-color: #a13a3a;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.logout-btn:hover {
  background-color: #872d2d;
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