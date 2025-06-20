<template>
  <div>
    <h1>{{ t('DEFECTS.PAGE_TITLE') }}</h1>
    <DefectList @select-defect="selectDefect" />
    <DefectDetails v-if="selectedDefect" :defect="selectedDefect" />
  </div>
</template>

<script>
import { useI18n } from 'vue-i18n';
import DefectList from '../components/DefectList.vue'
import DefectDetails from '../components/DefectDetails.vue'

export default {
  name: 'DefectPage',
  components: {
    DefectList,
    DefectDetails
  },
  setup() {
    const { t } = useI18n();
    return { t };
  },
  data() {
    return {
      selectedDefect: null
    }
  },
  methods: {
    selectDefect(defect) {
      this.selectedDefect = defect
    }
  }
}
</script> 