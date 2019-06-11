<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Multiple Choice</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col md="8"
           class="questions">

      <multi-choice v-bind:auto="true"
                    v-bind:activity-bus-on="false"
                    v-bind:activated="activated"
                    v-bind:options="options_single"
                    v-bind:multiple-select="false"
                    v-bind:attempts-allowed="1"
                    v-bind:feedback="feedback"
                    v-bind:question="question_single"
                    v-on:activity-attempted="logdata">
        <template v-slot:question>
          <p>{{ question_single }}</p>
        </template>
        <template v-slot:option="{ option }">
          <span></span>
          <span>{{ option.text }}</span>
        </template>
      </multi-choice>


      <multi-choice v-bind:auto="true"
                    v-bind:activity-bus-on="false"
                    v-bind:activated="activated"
                    v-bind:options="options_arrows"
                    v-bind:multiple-select="false"
                    v-bind:attempts-allowed="1"
                    v-bind:feedback="feedback"
                    options-class="options-arrows"
                    v-bind:question="question_arrows"
                    v-on:activity-attempted="logdata">
        <template v-slot:question>
          <p>{{ question_arrows }}</p>
        </template>
        <template v-slot:option="{ option }">
          <span></span>
          <span>{{ option.text }}</span>
        </template>
      </multi-choice>


      <multi-choice v-bind:auto="true"
                    v-bind:activity-bus-on="false"
                    v-bind:activated="activated"
                    v-bind:options="options_multi"
                    v-bind:question="question_multi"
                    v-bind:multiple-select="true"
                    v-bind:attempts-allowed="1"
                    v-on:activity-attempted="displayFeedback">
        <template v-slot:question>
          <p>{{ question_multi }}</p>
        </template>
        <template v-slot:option="{ option }">
          <span></span>
          <span>{{ option.text }}</span>
        </template>
      </multi-choice>


      <feedback-display v-bind:auto="true"
                        v-bind:activated="true"
                        v-bind:messages="secondFeedback"
                        v-bind:displayed="feedbackToDisplay">
        <template v-slot:message="{ message }">
          <span>✓</span>
          {{ message.text }}
        </template>
      </feedback-display>
    </b-col>
  </b-row>

</b-container>
</template>

<script>
import MultiChoice from '~/components/activities/multi_choice'
import FeedbackDisplay from '~/components/activities/feedback'

export default {
  name: 'lesson',
  data() {
    return {
      selected: '',
      activated: true,
      question_single: '1. What number makes a couple?',
      question_arrows: '2. What type of trend is visible in this chart?',
      question_multi: '3. What 2 or 3 options are best to select (wink, wink)?',
      options_single: [
        {
          name: 'one',
          text: 'number one'
        },
        {
          name: 'two',
          text: 'number two',
          correct: true
        },
        {
          name: 'three',
          text: 'number three'
        },
        {
          name: 'four',
          text: 'number four'
        }
      ],
      options_arrows: [
        {
          name: 'up',
          text: 'Up-trend'
        },
        {
          name: 'down',
          text: 'Down-trend',
          correct: true
        }
      ],
      options_multi: [
        {
          name: 'one',
          text: 'number one'
        },
        {
          name: 'two',
          text: 'number two',
          correct: true
        },
        {
          name: 'three',
          text: 'number three',
          correct: true
        },
        {
          name: 'four',
          text: 'number four'
        }
      ],
      feedback: [
        {
          name: 'default-correct',
          text: 'Correct'
        },
        {
          name: 'default-incorrect',
          text: 'Incorrect'
        }
      ],
      secondFeedback: [],
      feedbackToDisplay: []
    }
  },
  methods: {
    activatefeedback() {
      this.activated = true
    },
    logdata( ev ) {
      // eslint-disable-next-line
      console.log( JSON.stringify( ev ) )
    },
    displayFeedback( ev ) {
      const totalCorrect = ev.localOptions.reduce( ( memo, item ) => {
        return memo + ( ( ( item.correct && item.selected ) || ( !item.correct && !item.selected ) ) ? 1 : 0 )
      }, 0 )
      this.secondFeedback = [ {
        name: 'default',
        text: `You have ${totalCorrect} options marked correctly.`
      } ]
      this.feedbackToDisplay = [ 'default' ]
    }
  },
  components: {
    MultiChoice,
    FeedbackDisplay
  }
}
</script>

<style lang="scss">

</style>
