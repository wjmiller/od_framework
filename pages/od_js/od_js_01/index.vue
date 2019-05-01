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
  <b-row>
    <b-col md="6"
           lg="7">
      <div class="lesson-info">
        <div class="course-title">Jumpstart</div>
        <h1 class="lesson-title">Unfilled Orders and Price Change</h1>
        <div class="lesson-description">Here is a description for this lesson. It briefly explains what is covered in the Unfilled Orders and Price Change lesson.</div>
        <b-badge pill>30 min</b-badge>
        <b-progress v-bind:value="progress"></b-progress>
      </div>
    </b-col>
    <b-col md="6"
           lg="5">
      <video controls
             class="video-intro"
             poster="../images/video_placeholder.png">
        <source src="~/assets/videos/sample.mp4"
                type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
export default {
  middleware: [ 'check_auth', 'auth' ],
  data() {
    return {
      progress: 40
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

    store.commit( 'set_course', course )
    store.commit( 'set_lesson', lesson )
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/variables.scss";

.lesson-info {
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
