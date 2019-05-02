<template>
<section>
  <navbar v-on:notes-toggle="toggleNotes"
          v-bind:open="notesOpen"></navbar>
  <nuxt class="page-content" />
  <foot></foot>
  <notes v-on:close-notes="toggleNotes"
         v-bind:open="notesOpen"></notes>
</section>
</template>

<script>
import navbar from '../components/ui/navbar'
import foot from '../components/ui/foot'
import notes from '../components/ui/notes'
import {
  mapGetters
} from 'vuex'

export default {
  components: {
    navbar,
    foot,
    notes
  },
  computed: {
    ...mapGetters( [ 'getUserPrefs' ] )
  },
  data() {
    return {
      notesOpen: false
    }
  },
  methods: {
    toggleNotes() {
      this.notesOpen = !this.notesOpen
    }
  },
  head() {
    return {
      htmlAttrs: {
        class: this.getUserPrefs.theme_dark ? 'dark' : 'light'
      },
      bodyAttrs: {
        class: this.notesOpen ? 'noscroll' : ''
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.page-content {
    min-height: calc(100vh - 355px);
}
</style>
