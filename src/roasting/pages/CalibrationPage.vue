<template>

  <div>
    <h1>{{ t('CALIBRATION.PAGE_TITLE') }}</h1>
    <Calibration />
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import Calibration from '../components/Calibration.vue'
import HeaderBar from "../../public/components/headerBar.vue";

export default {
  name: 'CalibrationPage',
  components: {
    HeaderBar,
    Calibration
  },
  setup() {
    const { t } = useI18n();
    return { t };
  }
}
</script> 