<template>
<b-container>
  <b-row>
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Course</nuxt-link>
    </b-col>
  </b-row>
  <b-row class="intro-container">
    <b-col md="6"
           lg="7">
      <div class="course-info">
        <h1 class="course-title">Jumpstart</h1>
        <b-progress v-bind:value="progress"></b-progress>
        <div class="course-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
        <b-badge pill>1.5 hrs</b-badge>
      </div>
    </b-col>
    <b-col md="6"
           lg="5">
      <video-player source="../videos/life_of_candle.mp4"
                    poster="../images/video_posters/life_of_candle.png" />
    </b-col>
  </b-row>
  <b-row>
    <b-col class="course-lessons">
      <h2>Lessons</h2>
      <b-list-group>
        <nuxt-link to="/od_js/od_js_01"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Unfilled Orders and Price Change</h5>
              <b-badge pill>30 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Unfilled Orders and Price Change
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import VideoPlayer from '~/components/activities/video_player'

export default {
  fetch( {
    store
  } ) {
    const course = {
        id: 'od_js',
        title: 'Jumpstart'
      },
      lesson = {
        id: 'od_js_00',
        title: 'Home'
      }

    store.commit( 'setCourse', course )
    store.commit( 'setLesson', lesson )
  },
  data() {
    return {
      progress: 40
    }
  },
  components: {
    VideoPlayer
  }
}
</script>

<style lang="scss" scoped>
// -----------------------------------------------------
// Course Information
// -----------------------------------------------------

.course-info {
    margin-bottom: 2.5rem;

    @media(min-width: 768px) {
        margin-bottom: 0;
    }

    .course-title {
        margin: 2.5rem 0 1.4rem;
        font-size: 3.2rem;
    }
    .progress {
        width: 5.6rem;
        height: 0.7rem;
        border-radius: 0.35rem;
    }
    .course-description {
        font-size: 1.05rem;
        margin: 0.9rem 0;
    }
}

// -----------------------------------------------------
// Lesson Listings
// -----------------------------------------------------

.course-lessons {

    @media (min-width: 768px) {
        margin: 0 0 0 1.2rem;
    }

    h2 {
        margin-bottom: 0.8rem;

        @media (min-width: 768px) {
            margin-bottom: 0.5rem;
        }
    }

    .list-group-item {
        display: flex;
        flex-direction: row;

        .icon-play {
            display: none;
            font-size: 3.5rem;
            margin: 0 0.7rem 0 0;
        }

        h5 {
            font-size: 1.15rem;
            margin: 0 0.9rem 0.6rem 0;
        }

        .badge {
            margin-bottom: 0.6rem;
        }

        .progress {
            width: 5.6rem;
            height: 0.7rem;
            border-radius: 0.35rem;
        }

        @media (min-width: 768px) {
            .icon-play {
                display: block;
            }

            h5 {
                margin: 0 0.9rem 0.3rem 0;
            }

            .badge {
                margin-bottom: 0.3rem;
            }
        }
    }
}
</style>
