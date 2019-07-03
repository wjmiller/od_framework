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
  <b-row class="intro-container">
    <b-col md="6"
           lg="7">
      <div class="lesson-info">
        <div class="course-title">Intro to Core Strategy</div>
        <h1 class="lesson-title">Wholesale vs Retail</h1>
        <div class="lesson-description">Here is a description for this lesson. It briefly explains what is covered in the Wholesale vs Retail lesson.</div>
        <b-badge pill>8 min</b-badge>
        <b-progress v-bind:value="progress"></b-progress>
      </div>
    </b-col>
    <b-col md="6"
           lg="5">
      <video-player source="../../videos/life_of_candle.mp4"
                    poster="../../images/video_posters/life_of_candle.png" />
    </b-col>
  </b-row>
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
        id: 'intro_core_wholesale_retail',
        title: 'Wholesale vs Retail'
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
