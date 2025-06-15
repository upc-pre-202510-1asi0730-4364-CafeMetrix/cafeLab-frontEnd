<template>
  <div class="select-plan">
    <Toolbarinit />
    <h2>{{ t('SELECT_PLAN.TITLE') }}</h2>
    <div class="plan-buttons">
      <pv-button @click="onSelectPlan('barista')" :label="t('SELECT_PLAN.BARISTA')" class="p-button-raised p-button-primary" />
      <pv-button @click="onSelectPlan('admin')" :label="t('SELECT_PLAN.OWNER')" class="p-button-raised p-button-primary" />
      <pv-button @click="onSelectPlan('complete')" :label="t('SELECT_PLAN.COMPLETE')" class="p-button-raised p-button-primary" />
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import userService from '../../auth/services/user.service.js';
import Toolbarinit from '../../public/components/toolbarinit.component.vue';

export default {
  name: 'SelectPlan',
  components: {
    Toolbarinit
  },
  setup() {
    const { t } = useI18n();
    const router = useRouter();

    function onSelectPlan(plan) {
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const updatedUser = {
        ...currentUser,
        plan: plan,
        hasPlan: true
      };

      userService.updateProfile(currentUser.id, updatedUser)
          .then(user => {
            console.log('Updated user:', user);
            localStorage.setItem('currentUser', JSON.stringify(user));
            redirectToDashboard(plan);
          })
          .catch(error => {
            console.error('Update profile error:', error);
          });
    }

    function redirectToDashboard(plan) {
      switch (plan) {
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
          break;
      }
    }

    return {
      onSelectPlan,
      t
    };
  }
};
</script>

<style scoped>
.select-plan {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-height: 100vh;

}

.select-plan h2 {
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 500;
  color: #ffffff;
}

.plan-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}
</style>