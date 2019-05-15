<template>
<b-container>
  <b-row>
    <b-col cols="12">
      <candle-chart
      v-bind:candles="candles"
      v-bind:height="500"
      >
      </candle-chart>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <b-button
        v-on:click="changeData"
      >
      Change Data
    </b-button>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import CandleChart from '~/components/activities/candle_chart'

export default {
  name: 'lesson',
  data() {
    return {
      candles: [
        {open: 3.40, close: 8.20, high: 10, low: 1.5},
        {open: 6, close: 4, high: 10, low: 3},
        {open: 0, close: 2, high: 8, low: 0}
      ]
    }
  },
  methods: {
    changeData() {
      this.candles = [
        {open: 6, close: 2, high: 7, low: 1},
        {open: 4, close: 5, high: 13, low: 2},
        {open: 1, close: 2, high: 8, low: 1}
      ]
    }
  },
  components: {
    CandleChart
  }
}
</script>


</style>
