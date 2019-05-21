<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Unfilled Slider</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <h2>Unfilled Order Slider (w/o Labels)</h2>
    </b-col>
  </b-row>
  <unfilled-slider v-bind:labels="false"></unfilled-slider>
  <b-row>
    <b-col>
      <h2>Unfilled Order Slider (with Labels)</h2>
    </b-col>
  </b-row>
  <unfilled-slider v-bind:labels="true"></unfilled-slider>
</b-container>
</template>

<script>
import UnfilledSlider from '~/components/activities/custom/unfilled_slider'

export default {
  components: {
    UnfilledSlider
  }
}
</script>

<style lang="scss">
h2 {
    margin: 20px 0 50px;
}
</style>
