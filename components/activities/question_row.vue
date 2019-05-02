<template lang="html">
<b-row class="question-row">
  <b-col v-if="!active"
         cols="12">
    <h4>Question</h4>
    <span class="prompt">Correctly complete the activity above to unlock this question.</span>
  </b-col>
  <b-col v-if="active"
         cols="12"
         md="9">
    <question-open ref="questionopen"
                   v-bind:activity-id="`${activityId}-question-open`"
                   v-bind:activated="activated"
                   v-bind:question="question.question"
                   v-bind:comparison="question.feedback.correct"
                   v-on:activity-completed="triggerCorrect"
                   v-on:question-open-valid="activateFeedback($event)" />
  </b-col>
  <b-col v-if="active"
         cols="12"
         md="3">
    <question-feedback ref="feedback"
                       v-bind:activity-id="`${activityId}-question-feedback`"
                       v-bind:activity-bus-on="false"
                       v-bind:active="feedbackActive"
                       v-bind:feedback="question.feedback" />
  </b-col>
</b-row>
</template>

<script>
import QuestionOpen from './question_open'
import QuestionFeedback from './question_feedback'
import {
  Activity
} from '../../mixins/activity.js'


export default {
  name: 'question-row',
  mixins: [ Activity ],
  props: [ 'question', 'active' ],
  data() {
    return {
      feedbackActive: false,
      activityDescription: 'open question with feedback',
    }
  },
  components: {
    QuestionOpen,
    QuestionFeedback
  },
  methods: {
    activateFeedback( val ) {
      this.feedbackActive = val
      this.$emit( 'question-open-valid', true );
    },
    triggerCorrect() {
      this.complete = true
      this.makeAttempt()
    }
  }
}
</script>

<style lang="scss" scoped>
//------------------------------------------------------
// Import Variables
//------------------------------------------------------

@import '~assets/scss/variables.scss';

//------------------------------------------------------
// Question Row
//------------------------------------------------------

.question-row {
    min-height: 210px;

    h4 {
        font-size: 1.1em;
        margin-bottom: 14px;
    }

    .prompt {
        padding: 10px 15px;
        border-radius: $border-radius;
        min-height: 160px;
        display: inline-flex;
        align-items: center;
        width: 100%;
    }
}

// Dark/Light Theme Styles -----------------------------

.dark {
    .question-row {

        h4 {
            color: $dark-gray-light;
        }

        .prompt {
            background: $dark-pane-bg;
            border: 1px solid $dark-pane-border;
            color: lighten($dark-blue, 70%);
        }
    }
}

.light {
    .question-row {

        .prompt {
            background: $light-pane-bg;
            border: 1px solid $light-pane-border;
            color: lighten($light-text-color, 25%);
        }
    }
}
</style>
