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
  <b-row>
    <b-col md="6"
           lg="7">
      <div class="course-info">
        <h1 class="course-title">Jumpstart</h1>
        <b-progress v-bind:value="progress"></b-progress>
        <div class="course-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
          ea commodo consequat.</div>
        <b-badge pill>1.5 hrs</b-badge>
      </div>
    </b-col>
    <b-col md="6"
           lg="5">
      <video controls
             class="video-intro"
             poster="/images/video_placeholder.png">
        <source src="~/assets/videos/sample.mp4"
                type="video/mp4">
        Your browser does not support the video tag.
      </video>
    </b-col>
  </b-row>
  <b-row>
    <b-col class="course-lessons">
      <h2>Lessons</h2>
      <b-list-group>
        <nuxt-link to="od_js/od_js_01"
                   class="list-group-item d-flex flex-row list-group-item-action">
          <div class="p-6">
            <i class="icon-play"></i>
          </div>
          <div class="p-6">
            <div>
              <h5>Unfilled Orders and Price Change</h5>
              <b-badge pill>30 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Unfilled Orders and Price Change lesson.</p>
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
        id: 'od_js_00',
        title: 'Home'
      }

    store.commit( 'set_course', course )
    store.commit( 'set_lesson', lesson )
  }
}
</script>

<style lang="scss" scoped>
.course-info {
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
        font-size: 1rem;
        margin: 0.9rem 0;
    }
}

.list-group-item {

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

    @media(min-width: 768px) {

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

.course-lessons {
    margin: 50px 0 0;

    @media(min-width:768px) {
        margin: 2.95rem 0 0 1.2rem;
    }

    h2 {
        margin-bottom: 0.8rem;

        @media(min-width: 768px) {
            margin-bottom: 0.5rem;
        }
    }

}
</style>
