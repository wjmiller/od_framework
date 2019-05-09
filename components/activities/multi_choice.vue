<template lang="html">
  <div class="multi-choice" v-bind:class="activityStyles">
    <div class="multi-choice-question">
      <slot name="question">
        {{ question }}
      </slot>
    </div>
    <div class="multi-choice-options" v-bind:class="[multipleSelect ? 'multi-select' : 'single-select', optionsClass]">
      <div class="multi-choice-option"
        v-for="option in localOptions"
        v-bind:class="{'option-selected': option.selected}"
        v-bind:key="option.name"
        v-on:click="selectOption(option)">
        <slot name="option" v-bind:option="option">
          <!-- Fallback content -->
          <div>
            {{ option.text }}
          </div>
        </slot>
      </div>
      <b-btn
        v-on:click="submitAnswer"
        v-bind:disabled="completed">
        {{buttonTitle}}
      </b-btn>

      <div v-if="hasFeedback">
        <feedback-display
          v-bind:auto="true"
          v-bind:activated="completed"
          v-bind:messages="feedback"
          v-bind:displayed="feedbackDisplayed">

        </feedback-display>
      </div>
    </div>
    <!--
    <feedback-display
      v-bind:auto="true"
      v-bind:activated="true"
      v-bind:messages="options"
      v-bind:displayed="messagesDisplayed"
    >
      <template v-slot:message="{ message }">
        <span>✓</span>
          {{ message.text }}
      </template>
    </feedback-display>
    <b-button
      variant="primary"
      v-bind:disabled="!active"
      v-on:click="revealAnswer">{{ buttonTitle }}
    </b-button>
    -->
  </div>
</template>

<script>
import {
  Activity
} from '../../mixins/activity.js'
import FeedbackDisplay from './feedback'

export default {
  name: 'multi-choice',
  mixins: [ Activity ],
  props: {
    buttonTitle: {
      type: String,
      default: "Check My Answer"
    },
    options: {
      type: Array,
      default () {
        return []
      }
    },
    optionsClass: {
      type: String
    },
    multipleSelect: {
      type: Boolean,
      default: false
    },
    autoAttempt: {
      type: Boolean,
      default: false
    },
    feedback: {
      type: Array
    },
    question: {
      type: String
    }
  },
  data() {
    return {
      attemptDataKeysLocal: [ 'selectedOptions', 'localOptions' ],
      activityDescription: 'multiple choice/true false type activities',
      localOptions: []
    }
  },
  methods: {
    submitAnswer() {
      if ( this.activated && !this.completed ) this.makeAttempt()
      // eslint-disable-next-line
    },
    selectOption( option ) {
      if ( !this.completed ) {
        option.selected = !option.selected
        if ( !this.multipleSelect ) {
          this.localOptions.filter( item => item.name !== option.name )
            .forEach( item => item.selected = false )
        }
        this.localOptions = this.localOptions.slice() //must replace the array
      }
    }
  },
  computed: {
    hasFeedback() {
      return this.feedback && this.feedback.length >= 0
    },
    selectedOptions() {
      return this.localOptions.filter( item => item.selected )
    },
    correctOptions() {
      return this.localOptions.filter( item => item.correct )
    },
    completedText() {
      return this.completed && this.correct ? 'Correct' : 'Incorrect'
    },
    feedbackDisplayed() {
      const isCorrect = this.correct ? 'correct' : 'incorrect'
      return this.completed ?
        this.localOptions.reduce( ( memo, item ) => {
          if ( item.selected ) memo.push( item.name )
          memo.push( `${item.name}-${item.correct === item.selected ? 'correct' : 'incorrect'}` )
          return memo
        }, [ 'default', isCorrect, `default-${isCorrect}` ] ) : [ `hint-${this.attempts}` ]
    }
  },
  created() {
    this.localOptions = [].concat( this.options )
    if ( this.correctTests.length === 0 ) {
      this.addCorrectTest( function ( v ) {
        return v.correctOptions.every( opt => v.selectedOptions.find( selOpt => selOpt.name === opt.name ) )
      } )
    }
  },
  components: {
    FeedbackDisplay
  }
}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

.multi-choice .multi-choice-option {
    cursor: pointer;
}

.multi-choice-question {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1.7rem;
}

.multi-choice-options {
    padding-left: 10px;

    &.multi-select,
    &.single-select {
        .multi-choice-option {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            margin-bottom: 14px;

            span {
                display: block;
            }

            span:first-child {
                width: 2.5rem;
                height: 2.5rem;
                font-size: 1.8rem;
                text-align: center;
                line-height: 2.5rem;
                margin-right: 10px;
            }

            span:last-child {
                font-size: 1rem;
                line-height: 2.5rem;
            }
        }
    }

    &.single-select {

        .multi-choice-option {

            span:first-child {
                border-radius: 50%;
                font-size: 1.2rem;
            }

            &.option-selected {
                span:first-child {
                    &:before {
                        content: "\e3a6";
                        font-family: 'custom-icons';
                    }
                }
            }
        }
    }

    &.multi-select {

        .multi-choice-option {

            span:first-child {
                //border-radius: 0.2rem;
            }

            &.option-selected {
                span:first-child {
                    &:before {
                        content: "\e908";
                        font-family: 'custom-icons';
                    }
                }
            }
        }
    }

    button {
        display: block;
        margin: 1.8rem 0 1.5rem;
    }
}

.multi-choice {

    .feedback {
        display: block;
        opacity: 0;
        margin-bottom: 3rem;
        min-height: 3.9rem;
        transition: opacity cubic-bezier(.71,.55,.62,1.57) 0.2s;

        .feedback-messages {
            background: none;
            padding: 0;
            border: 0;

            p {
                margin: 0;
            }

            .feedback-message {
                padding: 0 0.7rem;

                &:first-child {
                    padding-top: 0.7rem;
                }

                &:last-child {
                    padding-bottom: 0.7rem;
                }
            }
        }

        .feedback-message.default-correct,
        .feedback-message.default-incorrect {

            div {
                font-weight: 600;
                font-size: 1.3rem;
                margin-bottom: 0.9rem;
                /*
                animation-duration: 0.4s;
                animation-name: fadeAndScale;
                animation-timing-function: cubic-bezier(.71,.55,.62,1.57);
                */

                &:before {
                    margin-right: 5px;
                }
            }
        }
    }

    .feedback-inactive {
        display: none;
    }

    &.activity-completed {

        .feedback {
            opacity: 1;
        }
    }
}

.dark {

    .questions {
        .feedback-messages {
            background: none;
            border: 0;
        }
    }

    .multi-choice.activity-completed {

        .feedback-message.default-correct {
            div {
                color: darken($green, 5%);

                &:before {
                    content: '\e908';
                    font-family: 'custom-icons';
                }
            }
        }

        .feedback-message.default-incorrect {
            div {
                color: lighten($red, 8%);

                &:before {
                    content: '\e90b';
                    font-family: 'custom-icons';
                }
            }
        }
    }

    .multi-choice-options {

        &.multi-select,
        &.single-select {

            .multi-choice-option {
                span:first-child {
                    background: #fff;
                }

                &.option-selected {
                    span:first-child {
                        background: darken($purple, 5%);
                    }
                }
            }

        }
    }

    .activity-completed {
        .multi-choice-options {

            &.multi-select,
            &.single-select {

                .multi-choice-option {
                    &.option-selected {
                        span:first-child {
                            background: $red;
                        }
                    }
                }
            }
        }

        &.activity-correct {
            .multi-choice-options {

                &.multi-select,
                &.single-select {

                    .multi-choice-option {
                        &.option-selected {
                            span:first-child {
                                background: darken($green, 4%);
                            }
                        }
                    }

                }
            }
        }
    }

}

.light {

    .questions {
        .feedback-messages {
            background: none;
            border: 0;
        }
    }

    .multi-choice.activity-completed {
        .feedback-message.default-correct {
            div {
                color: $green-med;

                &:before {
                    content: '\e908';
                    font-family: 'custom-icons';
                }
            }
        }

        .feedback-message.default-incorrect {
            div {
                color: $red;

                &:before {
                    content: '\e90b';
                    font-family: 'custom-icons';
                }
            }
        }
    }
    .multi-choice-options {
        &.multi-select,
        &.single-select {

            .multi-choice-option {
                span:first-child {
                    background: $light-gray-med;
                }

                &.option-selected {
                    span:first-child {
                        background: $purple-med;
                        color: #fff;
                    }
                }
            }

        }
    }

    .activity-completed {
        .multi-choice-options {

            &.multi-select,
            &.single-select {

                .multi-choice-option {
                    &.option-selected {
                        span:first-child {
                            background: $red;
                        }
                    }
                }
            }
        }

        &.activity-correct {
            .multi-choice-options {

                &.multi-select,
                &.single-select {

                    .multi-choice-option {
                        &.option-selected {
                            span:first-child {
                                background: $green-med;
                            }
                        }
                    }

                }
            }
        }
    }
}
/*
@keyframes fadeAndScale {
    0% {
        opacity: 0;
        transform: scale(.8, .8);
    }
    50% {
        opacity: 0.75;
        transform: scale(1.2, 1.2);
    }
    100% {
        opacity: 1;
        transform: scale(1, 1);
    }
}
*/
</style>
