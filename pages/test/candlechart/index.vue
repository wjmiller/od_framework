<template>
<b-container>
  <b-row>
    <b-col cols="12">
      <candle-chart
      v-bind:prices="[1,2,3,4,5,6,7,8,9,10]"
      v-bind:candles="candles"
      >
      </candle-chart>
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
        {open: 3, close: 8, high: 10, low: 1},
        {open: 6, close: 4, high: 7, low: 3}
      ]
    }
  },
  components: {
    CandleChart
  }
}
</script>


</style>
