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

export default {
  components: {
    navbar,
    foot,
    notes
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
  }
}
</script>

<style lang="scss" scoped>
.page-content {
    min-height: calc(100vh - 355px);
}
</style>
