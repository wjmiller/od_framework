<template>
<main>
  <b-container>
    <b-row>
      <b-col>
        <nuxt-link to="/template"
                   class="btn btn-secondary">
          <fa :icon="['fas', 'chevron-left']"
              aria-label="left arrow" /> Exit Lesson</nuxt-link>
      </b-col>
    </b-row>
    <!-- Lesson Introduction -->
    <section class="intro-section">
      <b-row>
        <b-col md="6"
               lg="7">
          <div class="lesson-info">
            <div class="course-title">Course Title</div>
            <h1 class="lesson-title">Lesson Title</h1>
            <div class="lesson-description">Here is a description for this lesson. It briefly explains what is covered in the lesson.</div>
            <b-badge pill>10 min</b-badge>
            <b-progress v-bind:value="progress"></b-progress>
          </div>
        </b-col>
        <b-col md="6"
               lg="5">
          <video-player source="../../videos/life_of_candle.mp4"
                        poster="../../images/video_posters/life_of_candle.png" />
        </b-col>
      </b-row>
    </section>
    <!-- Lesson Topic and Subtopic (Text, Images, Links) -->
    <section>
      <b-row>
        <b-col md="12">
          <h2>Topic A Header</h2>
        </b-col>
        <b-col class="mrg-bottom"
               md="6">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <a class="link download"
             target="_blank"
             href="https://google.com">Download Link</a>
        </b-col>
        <b-col md="6">
          <images v-bind:images="['../../images/placeholders/image_0.png', '../../images/placeholders/image_1.png', '../../images/placeholders/image_2.png']"
                  v-bind:controls="true"></images>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <h3>Topic A Subheader</h3>
        </b-col>
        <b-col class="mrg-bottom"
               md="6">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <a class="link"
             target="_blank"
             href="https://google.com">Link to a webpage</a>
        </b-col>
        <b-col md="6">
          <images v-bind:images="['../../images/placeholders/image_1.png']"
                  v-bind:controls="false"></images>
        </b-col>
      </b-row>
    </section>
    <!-- Lesson Activity -->
    <section>
      <b-row>
        <b-col md="12">
          <h2>Topic B Header</h2>
        </b-col>
        <b-col class="mrg-bottom"
               md="9">
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </b-col>
        <b-col md="12">
          <candle-label v-bind:candles="candles"
                        v-bind:correct-labels="correctLabels"
                        v-bind:price-range="[0,32]">
          </candle-label>
        </b-col>
      </b-row>

    </section>
  </b-container>
</main>
</template>

<script>
import VideoPlayer from '~/components/activities/video_player'
import Images from '~/components/subcomponents/images'
import CandleLabel from '~/components/activities/custom/candle_label'
//import xAPI from '~/plugins/xapi.js'

import {
  mapGetters
} from 'vuex'

export default {
  computed: {
    ...mapGetters( [ 'getUserPrefs' ] ),
    theme() {
      return this.getUserPrefs.theme_dark ? 'dark' : 'light'
    }
  },
  components: {
    VideoPlayer,
    Images,
    CandleLabel
  },
  fetch( {
    store
  } ) {
    const course = {
        id: 'course_id',
        title: 'Course Title'
      },
      lesson = {
        id: 'lesson_1_id',
        title: 'Lesson Title'
      }

    store.commit( 'setCourse', course )
    store.commit( 'setLesson', lesson )
  },
  data() {
    return {
      progress: 60,
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
        }
      ],
      correctLabels: [
        'B', 'B', 'L', 'L', 'L', 'B', 'B', 'B', 'L', 'L', 'B', 'B', 'B'
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

<style lang="scss"></style>
