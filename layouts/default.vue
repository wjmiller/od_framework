<template>
<section>
  <navbar v-on:notes_toggle="toggle_notes"
          v-bind:open="notes_open"></navbar>
  <nuxt class="page-content" />
  <foot></foot>
  <notes v-on:close_notes="toggle_notes"
         v-bind:open="notes_open"></notes>
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
    ...mapGetters( [ 'get_user_prefs' ] )
  },
  data() {
    return {
      notes_open: false
    }
  },
  methods: {
    toggle_notes() {
      this.notes_open = !this.notes_open
    }
  },
  head() {
    return {
      htmlAttrs: {
        class: this.get_user_prefs.theme_dark ? 'dark' : 'light'
      },
      bodyAttrs: {
        class: this.notes_open ? 'noscroll' : ''
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
