<template>
<b-container>
  <b-row>
    <b-col lg="8">
      <multi-choice v-bind:auto="true"
                    v-bind:activity-bus-on="false"
                    v-bind:activated="activated"
                    v-bind:options="options_single"
                    v-bind:multiple-select="false"
                    v-bind:attempts-allowed="3"
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
                    v-bind:options="options_multi"
                    v-bind:question="question_multi"
                    v-bind:multiple-select="true"
                    v-bind:attempts-allowed="3"
                    options-class="custom-options"
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

      <multi-choice v-bind:auto="true"
                    v-bind:activity-bus-on="false"
                    v-bind:activated="activated"
                    v-bind:options="options_multi"
                    v-bind:question="question_multi"
                    v-bind:multiple-select="true"
                    v-bind:attempts-allowed="3"
                    v-bind:feedback="feedback"
                    v-on:activity-attempted="logdata">
        <template v-slot:question>
          <p>{{ question_multi }}</p>
        </template>
        <template v-slot:option="{ option }">
          <span></span>
          <span>{{ option.text }}</span>
        </template>
      </multi-choice>
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
      question_multi: '2. What 2 or 3 options are best to select (wink, wink)?',
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
          name: 'default',
          text: 'This is feedback that will display regardless of whether or not the answer is correct. Especially useful for true or false.'
        },
        {
          name: 'hint-1',
          text: 'this is a hint'
        },
        {
          name: 'hint-2',
          text: 'this is another hint'
        },
        {
          name: 'correct',
          text: 'general feedback if correct'
        },
        {
          name: 'incorrect',
          text: 'general feedback if incorrect'
        },
        {
          name: 'three',
          text: 'general feedback (3) if response is selected regardless if correct or not'
        },
        {
          name: 'three-incorrect',
          text: 'specific feedback (3) if selected option is incorrect'
        },
        {
          name: 'three-correct',
          text: 'specific feedback (3) if selected option is correct'
        },
        {
          name: 'four',
          text: 'general feedback (4) if response is selected regardless if correct or not'
        },
        {
          name: 'four-incorrect',
          text: 'specific feedback (4) if selected option is incorrect'
        },
        {
          name: 'four-correct',
          text: 'specific feedback (4) if selected option is correct'
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
