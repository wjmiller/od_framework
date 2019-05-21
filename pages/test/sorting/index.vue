<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Sorting</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col md="8">
      <p class="question">
        Create a RBR formation from the candles below and then check to see if you ordered them correctly.
      </p>
      <candle-sort v-bind:candles="candles"
                   v-bind:canvasHeight="200"
                   v-bind:candleWidth="40"
                   v-bind:candleSpacing="60"
                   v-bind:priceHigh="30"
                   v-bind:priceLow="0">
      </candle-sort>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import CandleSort from '~/components/activities/candle_sort'

export default {
  components: {
    CandleSort
  },
  data() {
    return {
      type: 'candles',
      candles: [
        {
          open: 3,
          close: 9,
          high: 11,
          low: 1
        },
        {
          open: 9,
          close: 8,
          high: 13,
          low: 5
        },
        {
          open: 8,
          close: 17,
          high: 20,
          low: 5
        }
      ]
    }
  }
}
</script>

<style lang="scss">
.question {
    font-size: 1.15rem;
    font-weight: 600;
}
</style>
