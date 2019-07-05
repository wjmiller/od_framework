<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Activity</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col md="6">
      <sketchpad
        v-bind:ratio="0.66675"
        v-on:sketch-json="getJSON"
       />
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import Sketchpad from '~/components/subcomponents/sketchpad'

export default {
  name: 'lesson',
  data() {
    return {
      size: 5
    }
  },
  components: {
    Sketchpad
  },
  methods: {
    getJSON(data) {
      console.log(data)
    }
  }
}
</script>

<style lang="scss">
</style>
