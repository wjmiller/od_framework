<template lang="html">
<div>
  <div>Activated: {{isActive}}</div>
  <div>Completed: {{completed}}</div>
  <div>Correct: {{correct}}</div>
  <div>Attempts: {{attempts}}</div>
  <div>
    <button v-on:click="button1++"
            v-bind:disabled="!isActive">+</button>
    <span> {{ button1 }} </span>
    <button v-on:click="button1--"
            v-bind:disabled="!isActive">-</button>
  </div>
  <div>
    <button v-on:click="button2++"
            v-bind:disabled="!isActive">+</button>
    <span> {{ button2 }} </span>
    <button v-on:click="button2--"
            v-bind:disabled="!isActive">-</button>
  </div>
  <button v-on:click="makeAttempt"
          v-bind:disabled="!isActive">I Think I'm Right</button>
</div>
</template>

<script>
import {
  Activity
} from '../../mixins/activity.js'

export default {
  name: 'activity-button-guess',
  activityDescription: 'guess button values activity',
  mixins: [ Activity ],
  attemptDataKeysLocal: [ 'button1Correct', 'button2Correct' ],
  //Could set a new default for the attemptsAllowed
  props: {
    attemptsAllowed: {
      default: 3,
      type: Number
    },
    button1Correct: {
      default: 0,
      type: Number
    },
    button2Correct: {
      default: 0,
      type: Number
    }
  },
  data() {
    return {
      button1: 0,
      button2: 0
    }
  },
  //this lifecycle function runs in addition to the original in the Activity mixin
  created() {
    this.addCorrectTest( v => v.button1 === v.button1Correct && v.button2 === v.button2Correct )
    //values have to be 2 and 5 to be correct
    this.$on( 'activity-completed', () => {
      this.$emit( 'update:activated', false );
    } )
  }
}
</script>

<style lang="scss" scoped>
</style>
