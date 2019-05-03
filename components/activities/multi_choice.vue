<template lang="html">
  <div class="multi-choice" v-bind:class="activityStyles">
    <div class="multi-choice-question">
      <slot name="question">
        {{ question }}
      </slot>
    </div>
    <div class="multi-choice-options">
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

<style lang="css">

.multi-choice .multi-choice-option {
  cursor: pointer;
}

</style>
