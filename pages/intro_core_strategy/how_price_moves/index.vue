<template>
<b-container>
  <b-row>
    <b-col>
      <nuxt-link to="/intro_core_strategy"
                 class="btn btn-secondary">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Lesson</nuxt-link>
    </b-col>
  </b-row>
  <section class="intro-section">
    <b-row>
      <b-col md="6"
             lg="7">
        <div class="lesson-info">
          <div class="course-title">Intro to Core Strategy</div>
          <h1 class="lesson-title">How Price Moves</h1>
          <div class="lesson-description">Here is a description for this lesson. It briefly explains what is covered in the How Price Moves lesson.</div>
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
</b-container>
</template>

<script>
import VideoPlayer from '~/components/activities/video_player'
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
  fetch( {
    store
  } ) {
    const course = {
        id: 'intro_core',
        title: 'Intro to Core Strategy'
      },
      lesson = {
        id: 'intro_core_how_price_moves',
        title: 'How Price Moves'
      }

    store.commit( 'setCourse', course )
    store.commit( 'setLesson', lesson )
  },
  data() {
    return {
      progress: 60
    }
  },
  components: {
    VideoPlayer
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
