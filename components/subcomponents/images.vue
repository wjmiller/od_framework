<template>
<div>
  <viewer v-bind:options="options"
          v-bind:images="images"
          v-on:inited="inited"
          v-on:click="show"
          class="viewer"
          v-bind:class="{'multiple': multiple}"
          ref="viewer">
    <template slot-scope="scope">
      <figure>
        <img v-for="src in scope.images"
             v-bind:src="src"
             v-bind:key="src">
      </figure>
    </template>
  </viewer>
</div>
</template>

<script>
import 'viewerjs/dist/viewer.css'
import Viewer from "v-viewer/src/component.vue"

console.log()

export default {
  components: {
    Viewer
  },
  props: {
    images: {
      type: Array,
      default () {
        return []
      }
    },
    controls: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: {
        navbar: this.controls,
        toolbar: false,
        title: false,
        rotatable: false,
        zoomable: true
      }
    }
  },
  methods: {
    inited( viewer ) {
      this.$viewer = viewer
    },
    show() {
      this.$viewer.show()
    }
  },
  computed: {
    multiple() {
      return this.images.length > 1
    }
  }
}
</script>

<style lang="scss">
//------------------------------------------------------
// Import Variables
//------------------------------------------------------

@import '~assets/scss/variables.scss';
</style>
