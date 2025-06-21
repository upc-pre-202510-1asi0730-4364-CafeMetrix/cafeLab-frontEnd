<template>
  <div>
    <h1>{{ t('CALIBRATION.PAGE_TITLE') }}</h1>
    <Calibration />
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import Calibration from '../components/Calibration.vue'

export default {
  name: 'CalibrationPage',
  components: {
    Calibration
  },
  setup() {
    const { t } = useI18n();
    return { t };
  }
}
</script> 