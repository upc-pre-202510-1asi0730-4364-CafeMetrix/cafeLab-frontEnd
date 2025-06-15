<template>
  <div class="login-success-page">
    <Toolbarinit />
    <div class="success-message">
      <h2>{{ $t('LOGIN_SUCCESS.TITLE') }}</h2>
      <p>{{ $t('LOGIN_SUCCESS.MESSAGE', { name: currentUser?.name }) }}</p>
      <pv-button class="continue-button" @click="onContinue">
        {{ $t('LOGIN_SUCCESS.CONTINUE') }}
      </pv-button>
    </div>
    <div class="background-image" aria-hidden="true"></div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Toolbarinit from '../../public/components/toolbarinit.component.vue';

export default {
  name: 'LoginSuccessPage',
  components: {
    Toolbarinit
  },
  setup() {
    const router = useRouter();
    const { t } = useI18n();

    const currentUser = computed(() => {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    });

    onMounted(() => {
      if (!currentUser.value) {
        router.push({ name: 'Login' });
      }
    });

    function onContinue() {
      if (currentUser.value?.isFirstLogin) {
        router.push({ name: 'EditProfile' });
      } else {
        switch (currentUser.value?.plan) {
          case 'barista':
            router.push({ name: 'baristaDashboard' });
            break;
          case 'admin':
            router.push({ name: 'ownerDashboard' });
            break;
          case 'complete':
            router.push({ name: 'completeDashboard' });
            break;
          default:
            router.push({ name: 'selectPlan' });
            break;
        }
      }
    }

    return {
      currentUser,
      onContinue
    };
  }
};
</script>

<style scoped>
body {
  margin: 0;
  padding: 0;
}

body, html {
  height: 100%;
  margin: 0;
  padding: 0;
}

.login-success-page {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 64px);
  overflow: hidden;
  width: 100vw;
}

.login-success-page::before {
  content: "";
  position: absolute;
  inset: 0;
  background: #F8F7F2;
  z-index: -2;
}

.success-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  padding: 48px 64px;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.success-message h2 {
  margin: 0;
  font: 600 26px/1.2 "Montserrat", sans-serif;
  color: #333;
}

.success-message p {
  margin: 0;
  font: 16px/1.4 "Montserrat", sans-serif;
  color: #666;
}

.continue-button {
  border: none;
  border-radius: 50px;
  padding: 14px 32px;
  font: 600 15px "Montserrat", sans-serif;
  cursor: pointer;
  background: linear-gradient(135deg, #4D6443 0%, #5a6b2a 100%);
  color: #fff;
  box-shadow: 0 4px 14px rgba(77, 100, 67, 0.35), 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.continue-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.18), 0 4px 12px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
  color: #4D6443;
}

.continue-button:active {
  transform: translateY(0);
}

.continue-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.continue-button:active::before {
  width: 300px;
  height: 300px;
}
</style>