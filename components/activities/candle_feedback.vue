<template lang="html">
<div class="feedback">
  <b-button v-bind:disabled="!active"
            v-on:click="revealFeedback()">{{buttonTitle}}</b-button>
  <div>
    <div class="feedback-display"
         v-bind:class="{'correct': (correct && revealed)}">
      <div class="feedback-message"
           v-if="revealed">
        <div class="feedback-correct"
             v-if="correct && revealed">
          <img v-if="theme == 'dark'"
               class="animate-zoom"
               src="~/assets/images/icons/checkmark.svg" />
          <img v-else
               class="animate-zoom"
               src="~/assets/images/icons/checkmark_green.svg" />
        </div>
        <div class="feedback-incorrect"
             v-if="!correct && revealed">
          Incorrect
        </div>
        <div class="feedback-message">
          <div class="message-open"
               v-if="feedbackData.open !== 0">
            Adjust the opening price by ${{feedbackData.open}}
          </div>
          <div class="message-close"
               v-if="feedbackData.close !== 0">
            Adjust the closing price by ${{feedbackData.close}}
          </div>
          <div class="message-high"
               v-if="feedbackData.high !== 0">
            Adjust the high price by ${{feedbackData.high}}
          </div>
          <div class="message-low"
               v-if="feedbackData.low !== 0">
            Adjust the low price by ${{feedbackData.low}}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'candle-feedback',
  props: {
    active: Boolean,
    feedbackData: Object,
    correct: Boolean,
    checked: Boolean,
    theme: String
  },
  data() {
    return {
      revealed: false,
      buttonTitle: 'Check My Candlestick'
    }
  },
  methods: {
    revealFeedback() {
      if ( this.active ) {
        this.revealed = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

// -----------------------------------------------------
// Candle Feedback Styles
// -----------------------------------------------------

.feedback {

    .feedback-display {
        margin: 18px 0;
        padding: 10px;
        border-radius: $border-radius;
        height: 165px;
        transition: background-color border-color opacity 0.5s;

        @media(min-width: 769px) {
            min-height: 211px;
        }

        .feedback-message {
            font-size: 0.95em;

            .feedback-correct {
                font-size: 1.2em;
                font-weight: 600;
                margin-bottom: 5px;

                img {
                    display: block;
                    width: 78px;
                    height: 78px;
                    margin: 24px auto 0;

                    @media(min-width: 769px) {
                        margin: 48px auto 0;
                    }

                    &.animate-zoom {
                        -webkit-animation: zoom-in-out 0.5s ease-in 0s 1 normal;
                        -moz-animation: zoom-in-out 0.5s ease-in 0s 1 normal;
                        -ms-animation: zoom-in-out 0.5s ease-in 0s 1 normal;
                        animation: zoom-in-out 0.5s ease-in 0s 1 normal;
                    }
                }
            }

            .feedback-incorrect {
                font-size: 1.2em;
                font-weight: 600;
                color: $red;
                margin-bottom: 5px;
            }
        }
    }

    button {
        margin-top: 25px;
        display: block;
        width: 100%;

        @media(min-width: 576px) {
            margin-top: 22px;
        }
    }
}

// Dark/Light Theme Styles -----------------------------

.dark {
    .feedback-display {
        background-color: darken($dark-pane-bg, 2%);
        border-width: 1px;
        border-style: solid;
        border-color: darken($dark-pane-border, 2%);
        color: #fff;

        &.correct {
            background-color: rgba(99, 200, 72, 0.13);
            border-width: 4px;
            border-style: solid;
            border-color: rgba(99, 200, 72, 0.7);
        }
    }

    .feedback-message {
        .feedback-correct {
            color: $green;
        }
    }
}

.light {
    .feedback-display {
        background: $light-pane-bg;
        border: 1px solid $light-pane-border;
        color: $light-text-color;
    }

    .feedback-message {
        .feedback-correct {
            color: darken($green, 10%);
        }
    }
}

.feedback-overlay.hidden {
    opacity: 0;
}

@-webkit-keyframes zoom-in-out {
    0% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
    50% {
        -webkit-transform: scale(1.4);
        transform: scale(1.4);
    }
    100% {
        -webkit-transform: scale(1);
        transform: scale(1);
    }
}

@keyframes zoom-in-out {
    0% {
        -ms-transform: scale(1);
        transform: scale(1);
    }
    50% {
        -ms-transform: scale(1.4);
        transform: scale(1.4);
    }
    100% {
        -ms-transform: scale(1);
        transform: scale(1);
    }
}
</style>
