<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Unfilled Select</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <h2>Unfilled Order Select (w/o Labels)</h2>
    </b-col>
  </b-row>
  <unfilled-select v-bind:labels="false"></unfilled-select>
  <b-row>
    <b-col>
      <h2>Unfilled Order Select (with Labels)</h2>
    </b-col>
  </b-row>
  <unfilled-select v-bind:labels="true"></unfilled-select>
</b-container>
</template>

<script>
import UnfilledSelect from '~/components/activities/custom/unfilled_select'

export default {
  components: {
    UnfilledSelect
  }
}
</script>

<style lang="scss">
h2 {
    margin: 20px 0 25px;
}
</style>
