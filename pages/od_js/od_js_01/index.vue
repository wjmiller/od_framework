<template>
<b-container>
  <b-row>
    <b-col>
      <nuxt-link to="/od_js"
                 class="btn btn-secondary">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Lesson</nuxt-link>
    </b-col>
  </b-row>
  <b-row class="intro-container">
    <b-col md="6"
           lg="7">
      <div class="lesson-info">
        <div class="course-title">Jumpstart</div>
        <h1 class="lesson-title">Unfilled Orders and Price Change</h1>
        <div class="lesson-description">Here is a description for this lesson. It briefly explains what is covered in the Unfilled Orders and Price Change
          lesson.</div>
        <b-badge pill>30 min</b-badge>
        <b-progress v-bind:value="progress"></b-progress>
      </div>
    </b-col>
    <b-col md="6"
           lg="5">
      <video-player source="../../videos/life_of_candle.mp4"
                    poster="../../images/video_posters/life_of_candle.png" />
    </b-col>
  </b-row>

  <!-- Lesson Activities -->
  <activity-group v-for="(activity, index) in data.activities"
                  v-bind:key="`act-group-${index}`"
                  v-bind:activity-id="`${activity.id}`"
                  v-bind:activity="activity"
                  v-bind:theme="theme" />

  <b-row>
    <b-col md="8"
           class="questions">

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
                    v-bind:options="options_arrows"
                    v-bind:multiple-select="false"
                    v-bind:attempts-allowed="3"
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
                    v-bind:attempts-allowed="3"
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
import ActivityGroup from '~/components/activities/activity_group'
import VideoPlayer from '~/components/activities/video_player'
import AppData from '~/assets/data/app_data.js'
import MultiChoice from '~/components/activities/multi_choice'
import FeedbackDisplay from '~/components/activities/feedback'
//import xAPI from '~/plugins/xapi.js'

import {
  mapGetters
} from 'vuex'

//xAPI.setEvents(['activity-completed', 'activity-attempted'])

// Create candle data from prices
AppData.activities.forEach( activity => activity.candles.forEach( candle => {
  const prices = candle.candlechart.cdata.pricePoints;
  const close = prices.slice( -1 )[ 0 ] // Get last item in array
  const open = prices[ 0 ]; // First item in array
  candle.candlechart.csdata = {
    open: open,
    close: close,
    high: Math.max( ...prices ),
    low: Math.min( ...prices ),
    candleRed: open > close // If open > close then it means the price is falling
  }
} ) );

export default {
  computed: {
    ...mapGetters( [ 'getUserPrefs' ] ),
    theme() {
      return this.getUserPrefs.theme_dark ? 'dark' : 'light'
    }
  },
  fetch( {
    store
  } ) {
    const course = {
        id: 'od_js',
        title: 'Jumpstart'
      },
      lesson = {
        id: 'od_js_01',
        title: 'Unfilled Orders and Price Change'
      }

    store.commit( 'setCourse', course )
    store.commit( 'setLesson', lesson )
  },
  data() {
    return {
      data: AppData,
      objShow: false,
      progress: 60,
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
  components: {
    ActivityGroup,
    VideoPlayer,
    MultiChoice,
    FeedbackDisplay
  },
  watch: {
    user( auth ) {
      if ( !auth ) this.$router.replace( '/login' )
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
    toggleObjectives() {
      this.objShow = !this.objShow;
    },
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
  }
}
</script>

<style lang="scss" scoped>
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

// -----------------------------------------------------
// Lesson Information
// -----------------------------------------------------

.lesson-info {
    margin-bottom: 2.5rem;
    .course-title {
        font-size: 1.2rem;
        margin: 2.5rem 0 0.5rem;
    }

    .lesson-title {
        margin: 0;
        font-size: 2.4rem;
    }

    .lesson-description {
        font-size: 1.02rem;
        font-style: italic;
        margin: 0.7rem 0 1rem;
    }

    .progress {
        display: inline-block;
        width: 5.6rem;
        height: 0.7rem;
        border-radius: 0.35rem;
    }

    .badge {
        display: inline-block;
        margin-right: 0.6rem;
    }

    // Dark/Light Theme Styles -------------------------

    .dark {
        .course-title {
            color: $dark-gray-light;
        }
    }

    .light {
        .course-title {
            color: $light-text-color;
        }
    }
}
</style>
