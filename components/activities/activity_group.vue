<template lang="html">
<div class="activity-group">
  <h2>{{activity.title}}</h2>
  <p>{{activity.questions[0].instruction}}</p>
  <candle-row ref="candlerow"
              v-for="(candle, ix) in activity.candles"
              v-bind:key="`${activity.id}-${ix}-candle`"
              v-bind:activity-id="`${activity.id}-${ix}-candle-row`"
              v-bind:activity-bus-on="false"
              v-bind:theme="theme"
              v-bind:candle="candle"
              v-on:candle-correct="updateCandlesCorrect($event, ix)" />
  <question-row ref="questionrow"
                v-for="(question, ix) in activity.questions"
                v-bind:key="`${activity.id}-${ix}-question`"
                v-bind:activity-id="`${activity.id}-${ix}-question-row`"
                v-bind:activity-bus-on="false"
                v-bind:question="question"
                v-bind:active="openQuestion"
                v-on:activity-completed="completeActivityGroup"
                v-on:question-open-valid="isActivityDone" />
</div>
</template>

<script>
import CandleRow from './candle_row'
import QuestionRow from './question_row'
import {
  Activity
} from '../../mixins/activity.js'

export default {
  name: 'activity-group',
  mixins: [ Activity ],
  props: [ 'activity', 'theme' ],
  data() {
    return {
      openQuestion: false,
      candlesCorrect: [],
      activityDescription: 'candle-builder-activity-group'
    }
  },
  components: {
    CandleRow,
    QuestionRow
  },
  methods: {
    isActivityDone() {
      this.checkCandles()
      if ( this.openQuestion ) {
        this.completed = true
      }
    },
    checkCandles() {
      if ( this.candlesCorrect.every( item => item === true ) && this.candlesCorrect.length === this.activity.candles.length ) {
        this.openQuestion = true
      }
    },
    updateCandlesCorrect( val, ix ) {
      this.candlesCorrect[ ix ] = val;
      this.checkCandles()
    },
    completeActivityGroup() {
      this.makeAttempt()
    }
  },
  created() {
    this.addCorrectTest( function ( act ) {
      return act.$refs.questionrow.every( qr => qr.completed )
    } )
    //this.addCorrectTest(function (act) {return act.$refs.questionrow.every(qr => qr.completed)})
    this.candlesCorrect = Array.from( this.activity.candles )
      .fill( false )
  }
}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

// -----------------------------------------------------
// Activity Group
// -----------------------------------------------------

.activity-group {
    border-radius: $border-radius;
    margin-bottom: 100px;

    > p {
        font-size: 1em;
        margin-bottom: 35px;
        font-style: italic;
    }
}

// Dark/Light Theme Styles -----------------------------

.dark {
    .activity-group {
        background: $dark-group-bg;
        color: #fff;

        h2 {
            color: $dark-header-color;
        }

        p {
            color: #fff;
        }
    }
}

.light {
    .activity-group {
        background: $light-group-bg;
        //border: 1px solid $light-group-border;
        color: $light-text-color;

        p {
            color: $light-text-color;
        }
    }
}
</style>
