<template>
<b-container>
  <b-row>
    <b-col md="12">
      <activity-button-guess activity-id="activity-button-guess-1"
                             v-bind:attempt-data-keys="['button1', 'button2']"
                             v-bind:attempts-allowed="5"
                             v-bind:activated.sync="startActivated"
                             v-bind:button1-correct="1"
                             v-bind:button2-correct="2" />
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import ActivityButtonGuess from '~/components/activities/activity'

export default {
  name: 'lesson',
  data() {
    return {
      startActivated: true
    }
  },
  components: {
    ActivityButtonGuess
  }
}
</script>

<style lang="scss" scoped>
</style>
