<template>
  <div>
    <h1>Sensory Evaluation</h1>
    <TastingPattern />
    <TastingPatternOverview />
  </div>
</template>

<script>
import TastingPattern from '../components/TastingPattern.vue'
import TastingPatternOverview from '../components/TastingPatternOverview.vue'

export default {
  name: 'SensoryEvaluationPage',
  components: {
    TastingPattern,
    TastingPatternOverview
  }
}
</script> 