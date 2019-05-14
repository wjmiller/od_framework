<template>
<b-container>
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
