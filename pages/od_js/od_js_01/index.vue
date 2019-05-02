<template>

  <b-container>
    <b-row>
      <b-col>
        <nuxt-link to="/od_js" class="btn btn-secondary">
          <fa :icon="['fas', 'chevron-left']" aria-label="left arrow" /> Exit Lesson</nuxt-link>
      </b-col>
    </b-row>
    <b-row class="intro-container">
      <b-col md="6" lg="7">
        <div class="lesson-info">
          <div class="course-title">Jumpstart</div>
          <h1 class="lesson-title">Unfilled Orders and Price Change</h1>
          <div class="lesson-description">Here is a description for this lesson. It briefly explains what is covered in the Unfilled Orders and Price Change
            lesson.</div>
          <b-badge pill>30 min</b-badge>
          <b-progress v-bind:value="progress"></b-progress>
        </div>
      </b-col>
      <b-col md="6" lg="5">
        <video-player
            source="../../videos/life_of_candle.mp4"
            poster="../../images/video_posters/life_of_candle.png"
          />
      </b-col>
    </b-row>

    <!-- Lesson Activities -->
    <activity-group
      v-for="(activity, index) in data.activities"
      v-bind:key="`act-group-${index}`"
      v-bind:activity-id="`${activity.id}`"
      v-bind:activity="activity"
      v-bind:theme="data.theme"
    />
  </b-container>

</template>

<script>
import ActivityGroup from '~/components/activities/activity_group'
import VideoPlayer from '~/components/activities/video_player'
import AppData from '~/assets/data/app_data.js'
//import xAPI from '~/plugins/xapi.js'

//xAPI.setEvents(['activity-completed', 'activity-attempted'])

// Create candle data from prices
AppData.activities.forEach(activity => activity.candles.forEach(candle => {
  const prices = candle.candlechart.cdata.pricePoints;
  const close = prices.slice(-1)[0] // Get last item in array
  const open = prices[0]; // First item in array
  candle.candlechart.csdata = {
    open: open,
    close: close,
    high: Math.max(...prices),
    low: Math.min(...prices),
    candleRed: open > close // If open > close then it means the price is falling
  }
}));

export default {
  fetch({ store }) {
    const course = {
        id: 'od_js',
        title: 'Jumpstart'
      },
      lesson = {
        id: 'od_js_01',
        title: 'Unfilled Orders and Price Change'
      }

    store.commit('setCourse', course)
    store.commit('setLesson', lesson)
  },
  data() {
    return {
      data: AppData,
      objShow: false,
      progress: 60
    }
  },
  components: {
    ActivityGroup,
    VideoPlayer
  },
  watch: {
    user(auth) {
      if (!auth) this.$router.replace('/login')
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

  @import '~assets/scss/variables.scss';

  .intro-container {
    margin-bottom: 3.5rem;
  }

  .lesson-info {
    margin-bottom: 2.5rem;
    .course-title {
      font-size: 1.2rem;
      margin: 2.5rem 0 0.5rem;
    }

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
  }

</style>
