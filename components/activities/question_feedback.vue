<template lang="html">
<div class="feedback">
  <div class="feedback-display">
    <div class="feedback-message"
         v-if="revealed">
      {{feedback.correct}}
    </div>
    <div class="feedback-overlay"
         v-if="!revealed">
      {{inactiveMessage}}
    </div>
  </div>
  <b-btn v-bind:disabled="activeFeedback"
            v-on:click="revealFeedback()">{{buttonTitle}}</b-btn>
</div>
</template>

<script>
import {
  Activity
} from '../../mixins/activity.js'

export default {
  name: 'question-feedback',
  mixins: [ Activity ],
  props: {
    active: Boolean,
    feedback: Object
  },
  data() {
    return {
      revealed: false,
      message: 'this is a test',
      inactiveMessage: 'You must write a sufficiently intelligible response in order to compare responses.',
      buttonTitle: 'Compare My Response',
      activityDescription: 'get feedback'
    }
  },
  computed: {
    activeFeedback() {
      return !this.active
    }
  },
  methods: {
    revealFeedback() {
      if ( this.active ) {
        this.revealed = true
        this.correct = true
        this.makeAttempt()
      }
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
// Import Variables
//------------------------------------------------------

.feedback {
    margin-top: 25px;
    display: flex;
    flex-direction: column;

    button {
        width: 100%;
        display: block;
        font-size: 0.95em;
        align-self: center;

        @media(min-width:576px) {
            width: auto;
            display: inline-block;
            align-self: flex-end;
        }
    }

    .feedback-display {
        position: relative;
        margin: 0 0 10px;
        padding: 10px;
        border-radius: $border-radius;
        min-height: 150px;
    }

    .feedback-message,
    .feedback-overlay {
        font-size: 0.95em;
    }

    @media(min-width: 576px) {
        margin-top: 0;

    }
}

// Dark/Light Theme Styles -----------------------------

.dark {
    .feedback {
        .feedback-display {
            background-color: $dark-pane-bg;
            border: 1px solid $dark-pane-border;
            color: $dark-text-color;
        }
    }
}

.light {

    .feedback {
        .feedback-display {
            background: $light-pane-bg;
            border: 1px solid $light-pane-border;
            color: $light-text-color;
        }
    }
}
</style>
