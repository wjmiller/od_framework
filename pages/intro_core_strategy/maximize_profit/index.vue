<template>
<main>
  <b-container>
    <b-row>
      <b-col>
        <nuxt-link to="/intro_core_strategy"
                   class="btn btn-secondary">
          <fa :icon="['fas', 'chevron-left']"
              aria-label="left arrow" /> Exit Lesson</nuxt-link>
      </b-col>
    </b-row>
    <section class="intro-section no-video">
      <b-row>
        <b-col md="6"
               lg="7">
          <div class="lesson-info">
            <div class="course-title">Intro to Core Strategy</div>
            <h1 class="lesson-title">Maximize Your Profit</h1>
            <div class="lesson-description">Here is a description for this lesson. It briefly explains what is covered in the Maximize Your Profit lesson.</div>
            <b-badge pill>10 min</b-badge>
            <b-progress v-bind:value="progress"></b-progress>
          </div>
        </b-col>
      </b-row>
    </section>
    <section>
      <b-row>
        <b-col md="7">
          <h2>Poll</h2>
          <img v-bind:src="'../../images/placeholders/poll_placeholder.png'" />
        </b-col>
      </b-row>
    </section>
    <section>
      <b-row>
        <b-col md="8">
          <p>
            The good news is, whatever your goal may be, the path to achieving it is the same. You need to unlock your potential to more accurately and consistently make money.
          </p>
        </b-col>
      </b-row>
      <b-row>
        <b-col lg="9">
          <h2>Activity</h2>
          <p class="question">
            Use the sliders to move the <b>Enter</b> and <b>Exit</b> targets on the chart to capture the maximum profit that could have been achieved during this trading period.
          </p>
        </b-col>
      </b-row>
      <trade-maker v-bind:candles1="candles"
                   v-bind:chart-lines="chartLines"
                   v-bind:time-label="'Time'"
                   v-bind:time-label-interval="2">
      </trade-maker>
    </section>
    <section>
      <b-row>
        <b-col md="9">
          <p>
            Of course, the problem is you can’t enter a trade already knowing what the outcome is going to be. So try again with another chart and set your entry and exit lines that will maximize your profit based on where you think the price
            will
            go.
            Then reveal the chart to see how you did.
          </p>
        </b-col>
      </b-row>
      <trade-maker v-bind:progressive="true"
                   v-bind:candles1="candles2"
                   v-bind:candles2="candles3"
                   v-bind:chart-lines="chartLines2"
                   v-bind:time-label="'Time'"
                   v-bind:candle-width="15"
                   v-bind:candle-spacing="30"
                   v-bind:price-range="[10,20]"
                   v-bind:time-label-interval="2"
                   v-bind:enter-disabled-at="'10:15'"
                   v-bind:exit-disabled-at="'10:15'">
      </trade-maker>
    </section>
    <section>
      <b-row>
        <b-col md="9">
          <p>This time was a lot more difficult, obviously, but so much more true to reality. Predicting when price will move up or down is not an easy task. But you have to make those predictions more accurately if you hope to consistently make
            a
            profit.</p>
          <p>But what if you could analyze previous changes in price to help you make more consistent and accurate predictions? What if you could apply the same principles as professionals do in their trading plans?</p>
          <p>As an example, look at the following chart and place your entry at a price near the middle of this pattern: [show pattern]. Then place your exit at a price near the middle of this pattern: [show pattern]. Then see how you do in
            making a
            profit.</p>
        </b-col>
      </b-row>
      <trade-maker v-bind:progressive="true"
                   v-bind:candles1="candles2"
                   v-bind:candles2="candles3"
                   v-bind:chart-lines="chartLines2"
                   v-bind:time-label="'Time'"
                   v-bind:candle-width="15"
                   v-bind:candle-spacing="30"
                   v-bind:price-range="[10,20]"
                   v-bind:time-label-interval="2"
                   v-bind:enter-disabled-at="'10:15'"
                   v-bind:exit-disabled-at="'10:15'">
      </trade-maker>
    </section>
    <section>
      <b-row>
        <b-col md="9">
          <p>Alright, admittedly, we knew what price was going to do in this example, but it does illustrate what you will be able to do by learning the principles and developing the skills in this course. You shouldn’t expect to profit in every
            trade
            (in fact, we’re going to show you how it is OK to lose more than win), but you can expect to become a better predictor of how price will move so you can find opportunities that provide low risk and high reward.</p>
        </b-col>
      </b-row>
    </section>
  </b-container>
</main>
</template>

<script>
import VideoPlayer from '~/components/activities/video_player'
//import xAPI from '~/plugins/xapi.js'

import {
  mapGetters
} from 'vuex'

import TradeMaker from '~/components/activities/custom/trade_maker'

export default {
  computed: {
    ...mapGetters( [ 'getUserPrefs' ] ),
    theme() {
      return this.getUserPrefs.theme_dark ? 'dark' : 'light'
    }
  },
  components: {
    TradeMaker,
    VideoPlayer
  },
  fetch( {
    store
  } ) {
    const course = {
        id: 'intro_core',
        title: 'Intro to Core Strategy'
      },
      lesson = {
        id: 'intro_core_intro_max_profit',
        title: 'Maximize Your Profit'
      }

    store.commit( 'setCourse', course )
    store.commit( 'setLesson', lesson )
  },
  data() {
    return {
      progress: 60,
      chartLines: [ 0, 0 ],
      chartLines2: [ 10, 10 ],
      candles: [
        {
          open: 4,
          close: 2,
          high: 7,
          low: 1,
          label: '09:30'
        },
        {
          open: 2,
          close: 1,
          high: 4,
          low: 1,
          label: '09:45'
        },
        {
          open: 1,
          close: 6,
          high: 8,
          low: 1,
          label: '10:00'
        },
        {
          open: 6,
          close: 12,
          high: 16,
          low: 4,
          label: '10:15'
        },
        {
          open: 12,
          close: 16,
          high: 19,
          low: 8,
          label: '10:30'
        },
        {
          open: 16,
          close: 17,
          high: 23,
          low: 14,
          label: '10:45'
        },
        {
          open: 17,
          close: 15,
          high: 22,
          low: 13,
          label: '11:00'
        },
        {
          open: 15,
          close: 16,
          high: 17,
          low: 12,
          label: '11:15'
        },
        {
          open: 16,
          close: 11,
          high: 16,
          low: 11,
          label: '11:30'
        },
        {
          open: 11,
          close: 7,
          high: 14,
          low: 5,
          label: '11:45'
        },
        {
          open: 7,
          close: 5,
          high: 9,
          low: 1,
          label: '12:00'
        },
        {
          open: 5,
          close: 7,
          high: 10,
          low: 3,
          label: '12:15'
        },
        {
          open: 7,
          close: 6,
          high: 9,
          low: 4,
          label: '12:30'
        },
        {
          open: 6,
          close: 10,
          high: 15,
          low: 4,
          label: '12:45'
        },
        {
          open: 10,
          close: 15,
          high: 18,
          low: 7,
          label: '01:00'
        },
        {
          open: 15,
          close: 20,
          high: 24,
          low: 14,
          label: '01:15'
        },
        {
          open: 20,
          close: 23,
          high: 26,
          low: 17,
          label: '01:30'
        },
        {
          open: 23,
          close: 25,
          high: 27,
          low: 25,
          label: '01:45'
        },
        {
          open: 25,
          close: 24,
          high: 30,
          low: 22,
          label: '02:00'
        },
        {
          open: 24,
          close: 23,
          high: 27,
          low: 21,
          label: '02:15'
        },
        {
          open: 23,
          close: 18,
          high: 26,
          low: 14,
          label: '02:30'
        },
        {
          open: 18,
          close: 15,
          high: 23,
          low: 13,
          label: '02:45'
        },
        {
          open: 15,
          close: 14,
          high: 17,
          low: 13,
          label: '03:00'
        },
        {
          open: 14,
          close: 16,
          high: 18,
          low: 12,
          label: '03:15'
        },
        {
          open: 16,
          close: 22,
          high: 24,
          low: 12,
          label: '03:30'
        },
        {
          open: 22,
          close: 26,
          high: 29,
          low: 20,
          label: '03:45'
        },
        {
          open: 26,
          close: 29,
          high: 29,
          low: 22,
          label: '04:00'
        }
      ],
      candles2: [
        {
          open: 15.92,
          close: 16.21,
          high: 16.21,
          low: 15.86,
          label: "10:00"
        },
        {
          open: 16.21,
          close: 16.62,
          high: 16.63,
          low: 15.75,
          label: "10:15"
        },
        {
          open: 16.62,
          close: 16.85,
          high: 16.89,
          low: 16.62,
          label: "10:30"
        },
        {
          open: 16.85,
          close: 17.62,
          high: 17.62,
          low: 16.85,
          label: "10:45"
        },
        {
          open: 17.62,
          close: 16.83,
          high: 17.84,
          low: 16.6,
          label: "11:00"
        },
        {
          open: 16.83,
          close: 14.87,
          high: 17.17,
          low: 14.87,
          label: "11:15"
        },
        {
          open: 14.87,
          close: 13.52,
          high: 14.87,
          low: 13.52,
          label: "11:30"
        },
        {
          open: 13.52,
          close: 14.23,
          high: 14.23,
          low: 13.21,
          label: "11:45"
        },
        {
          open: 14.23,
          close: 14.48,
          high: 14.48,
          low: 14.07,
          label: "12:00"
        },
        {
          open: 14.48,
          close: 14.8,
          high: 14.9,
          low: 14.08,
          label: "12:15"
        },
        {
          open: 14.8,
          close: 15.13,
          high: 15.38,
          low: 14.8,
          label: "12:30"
        },
        {
          open: 15.13,
          close: 11.92,
          high: 15.22,
          low: 11.82,
          label: "12:45"
        },
        {
          open: 11.92,
          close: 14.46,
          high: 14.67,
          low: 11.92,
          label: "01:00"
        },
        {
          open: 14.46,
          close: 13.49,
          high: 14.55,
          low: 13.08,
          label: "01:15"
        },
        {
          open: 13.49,
          close: 13.02,
          high: 13.68,
          low: 12.88,
          label: "01:30"
        },
        {
          open: 13.02,
          close: 12.96,
          high: 13.57,
          low: 12.96,
          label: "01:45"
        },
        {
          open: 12.96,
          close: 12.75,
          high: 13.27,
          low: 12.56,
          label: "02:00"
        },
        {
          open: 12.75,
          close: 11.75,
          high: 12.96,
          low: 11.53,
          label: "02:15"
        },
        {
          open: 11.75,
          close: 11.81,
          high: 11.81,
          low: 10.06,
          label: "02:30"
        },
        {
          open: 11.81,
          close: 11.84,
          high: 12.33,
          low: 11.73,
          label: "02:45"
        },
        {
          open: 11.84,
          close: 13.68,
          high: 13.68,
          low: 11.84,
          label: "03:00"
        },
        {
          open: 13.68,
          close: 13.52,
          high: 13.68,
          low: 13.01,
          label: "03:15"
        },
        {
          open: 13.52,
          close: 14.88,
          high: 14.88,
          low: 13.19,
          label: "03:30"
        },
        {
          open: 14.88,
          close: 14.27,
          high: 15.38,
          low: 13.92,
          label: "03:45"
        },
        {
          open: 14.27,
          close: 14.49,
          high: 15.09,
          low: 14.27,
          label: "04:00"
        },
        {
          open: 14.49,
          close: 12.66,
          high: 14.54,
          low: 12.66,
          label: "04:15"
        },
        {
          open: 12.66,
          close: 13.44,
          high: 13.96,
          low: 12.66,
          label: "04:30"
        },
        {
          open: 13.44,
          close: 13.91,
          high: 13.91,
          low: 13.42,
          label: "04:45"
        },
        {
          open: 13.91,
          close: 13.86,
          high: 14.05,
          low: 13.78,
          label: "10:00"
        }
      ],
      candles3: [
        {
          open: 13.86,
          close: 14.74,
          high: 14.92,
          low: 13.86,
          label: "10:15"
        },
        {
          open: 14.74,
          close: 14.95,
          high: 15.22,
          low: 14.74,
          label: "10:30"
        },
        {
          open: 14.95,
          close: 15.52,
          high: 15.52,
          low: 14.7,
          label: "10:45"
        },
        {
          open: 15.52,
          close: 16.38,
          high: 16.38,
          low: 15.52,
          label: "11:00"
        },
        {
          open: 16.38,
          close: 15.25,
          high: 16.44,
          low: 15.07,
          label: "11:15"
        },
        {
          open: 15.25,
          close: 14.74,
          high: 15.41,
          low: 14.59,
          label: "11:30"
        },
        {
          open: 14.74,
          close: 15.02,
          high: 15.16,
          low: 14.74,
          label: "11:45"
        },
        {
          open: 15.02,
          close: 14.3,
          high: 15.45,
          low: 14.3,
          label: "12:00"
        },
        {
          open: 14.3,
          close: 13.01,
          high: 14.3,
          low: 13.01,
          label: "12:15"
        },
        {
          open: 13.01,
          close: 12.85,
          high: 13.65,
          low: 12.85,
          label: "12:30"
        },
        {
          open: 12.85,
          close: 12.18,
          high: 12.85,
          low: 11.68,
          label: "12:45"
        },
        {
          open: 12.18,
          close: 11.51,
          high: 12.35,
          low: 11.5,
          label: "01:00"
        },
        {
          open: 11.51,
          close: 12.32,
          high: 12.65,
          low: 11.22,
          label: "01:15"
        },
        {
          open: 12.32,
          close: 12.17,
          high: 12.71,
          low: 11.93,
          label: "01:30"
        },
        {
          open: 12.17,
          close: 12.99,
          high: 12.99,
          low: 12.17,
          label: "01:45"
        },
        {
          open: 12.99,
          close: 12.18,
          high: 13.17,
          low: 11.92,
          label: "02:00"
        },
        {
          open: 12.18,
          close: 12.19,
          high: 12.19,
          low: 11.85,
          label: "02:15"
        },
        {
          open: 12.19,
          close: 13.26,
          high: 13.38,
          low: 12,
          label: "02:30"
        },
        {
          open: 13.26,
          close: 13.76,
          high: 13.97,
          low: 13.06,
          label: "02:45"
        },
        {
          open: 13.76,
          close: 14.65,
          high: 15.01,
          low: 13.51,
          label: "03:00"
        },
        {
          open: 14.65,
          close: 14.77,
          high: 15.28,
          low: 14.46,
          label: "03:15"
        },
        {
          open: 14.77,
          close: 15.38,
          high: 15.44,
          low: 14.38,
          label: "03:30"
        },
        {
          open: 15.38,
          close: 15.48,
          high: 15.48,
          low: 15.04,
          label: "03:45"
        },
        {
          open: 15.48,
          close: 16.19,
          high: 16.48,
          low: 15.44,
          label: "04:00"
        },
        {
          open: 16.19,
          close: 16.17,
          high: 16.19,
          low: 15.53,
          label: "04:15"
        },
        {
          open: 16.17,
          close: 17.27,
          high: 17.27,
          low: 16.13,
          label: "04:30"
        },
        {
          open: 17.27,
          close: 17.31,
          high: 18.13,
          low: 17.09,
          label: "04:45"
        },
        {
          open: 17.31,
          close: 16.75,
          high: 17.31,
          low: 16.52,
          label: "10:00"
        },
        {
          open: 16.75,
          close: 16.41,
          high: 16.75,
          low: 16.25,
          label: "10:15"
        },
        {
          open: 16.41,
          close: 15.42,
          high: 16.74,
          low: 15.09,
          label: "10:30"
        },
        {
          open: 15.42,
          close: 15.04,
          high: 15.64,
          low: 15.04,
          label: "10:45"
        },
        {
          open: 15.04,
          close: 15.33,
          high: 15.66,
          low: 14.46,
          label: "11:00"
        },
        {
          open: 15.33,
          close: 15.28,
          high: 15.35,
          low: 15.25,
          label: "11:15"
        },
        {
          open: 15.28,
          close: 16.81,
          high: 17.18,
          low: 15.28,
          label: "11:30"
        },
        {
          open: 16.81,
          close: 17.27,
          high: 17.53,
          low: 16.58,
          label: "11:45"
        },
        {
          open: 17.27,
          close: 17.86,
          high: 17.86,
          low: 17.24,
          label: "12:00"
        },
        {
          open: 17.86,
          close: 18.92,
          high: 19.26,
          low: 17.56,
          label: "12:15"
        },
        {
          open: 18.92,
          close: 19.07,
          high: 19.1,
          low: 18.67,
          label: "12:30"
        },
        {
          open: 19.07,
          close: 19.96,
          high: 20.28,
          low: 18.95,
          label: "12:45"
        }
      ]
    }
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

.spacer {
    margin-bottom: 60px;
}

.question {
    font-weight: 400;
    font-size: 1rem;
}

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
