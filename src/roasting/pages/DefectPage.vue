<template>
  <div>
    <h1>Defectos</h1>
    <DefectList @select-defect="selectDefect" />
    <DefectDetails v-if="selectedDefect" :defect="selectedDefect" />
  </div>
</template>

<script>
import DefectList from '../components/DefectList.vue'
import DefectDetails from '../components/DefectDetails.vue'

export default {
  name: 'DefectPage',
  components: {
    DefectList,
    DefectDetails
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