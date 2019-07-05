<template>
<main>
  <b-container>
    <b-row>
      <b-col>
        <nuxt-link class="btn btn-secondary"
                   to="/">
          <fa :icon="['fas', 'chevron-left']"
              aria-label="left arrow" /> My Courses</nuxt-link>
      </b-col>
    </b-row>
    <b-row class="intro-container">
      <b-col md="6"
             lg="7">
        <div class="course-info">
          <h1 class="course-title">Course Title</h1>
          <b-progress v-bind:value="progress"></b-progress>
          <div class="course-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
          <b-badge pill>3.5 hrs</b-badge>
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
          <nuxt-link to="/template/lesson/"
                     class="list-group-item list-group-item-action">
            <div class="icon-play"></div>
            <div>
              <div>
                <h5>Lesson Title</h5>
                <b-badge pill>10 min</b-badge>
              </div>
              <p>Here is a description for this lesson. It briefly explains what is covered in the lesson.</p>
              <b-progress v-bind:value="progress">
              </b-progress>
            </div>
          </nuxt-link>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</main>
</template>

<script>
import VideoPlayer from '~/components/activities/video_player'

export default {
  fetch( {
    store
  } ) {
    const course = {
        id: 'course_id',
        title: 'Course Title'
      },
      lesson = {
        id: 'lesson_home_id',
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

<style lang="scss"></style>
