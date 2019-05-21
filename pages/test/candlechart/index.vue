<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Candle Chart</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="12">
      <h2 class="chart-header">First Day of Trading (Side Details)</h2>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="12">
      <candle-chart v-bind:candles="candles"
                    v-bind:height="260"
                    v-bind:force-range="[0,40]"
                    v-bind:price-display="5"
                    v-bind:price-width="60"
                    v-bind:candle-width="8"
                    v-bind:candle-spacing="16"
                    v-bind:detail-pane="true">
      </candle-chart>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="12">
      <h2 class="chart-header second">First Day of Trading (Top Details)</h2>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="12">
      <candle-chart v-bind:candles="candles"
                    v-bind:height="300"
                    v-bind:force-range="[0,40]"
                    v-bind:price-display="5"
                    v-bind:price-width="60"
                    v-bind:candle-width="12"
                    v-bind:candle-spacing="24"
                    v-bind:detail-pane="false">
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
        {
          open: 4,
          close: 2,
          high: 7,
          low: 1
        },
        {
          open: 2,
          close: 1,
          high: 4,
          low: 1
        },
        {
          open: 1,
          close: 6,
          high: 8,
          low: 1
        },
        {
          open: 6,
          close: 12,
          high: 16,
          low: 4
        },
        {
          open: 12,
          close: 16,
          high: 19,
          low: 8
        },
        {
          open: 16,
          close: 17,
          high: 23,
          low: 14
        },
        {
          open: 17,
          close: 15,
          high: 22,
          low: 13
        },
        {
          open: 15,
          close: 16,
          high: 17,
          low: 12
        },
        {
          open: 16,
          close: 11,
          high: 16,
          low: 11
        },
        {
          open: 11,
          close: 7,
          high: 14,
          low: 5
        },
        {
          open: 7,
          close: 5,
          high: 9,
          low: 1
        },
        {
          open: 5,
          close: 7,
          high: 10,
          low: 3
        },
        {
          open: 7,
          close: 6,
          high: 9,
          low: 4
        },
        {
          open: 6,
          close: 10,
          high: 15,
          low: 4
        },
        {
          open: 10,
          close: 15,
          high: 18,
          low: 7
        },
        {
          open: 15,
          close: 20,
          high: 24,
          low: 14
        },
        {
          open: 20,
          close: 23,
          high: 26,
          low: 17
        },
        {
          open: 23,
          close: 25,
          high: 27,
          low: 25
        },
        {
          open: 25,
          close: 24,
          high: 30,
          low: 22
        },
        {
          open: 24,
          close: 23,
          high: 27,
          low: 21
        },
        {
          open: 23,
          close: 18,
          high: 26,
          low: 14
        },
        {
          open: 18,
          close: 15,
          high: 23,
          low: 13
        },
        {
          open: 15,
          close: 14,
          high: 17,
          low: 13
        },
        {
          open: 14,
          close: 16,
          high: 18,
          low: 12
        },
        {
          open: 16,
          close: 22,
          high: 24,
          low: 12
        },
        {
          open: 22,
          close: 30,
          high: 34,
          low: 20
        },
        {
          open: 30,
          close: 26,
          high: 32,
          low: 22
        },
        {
          open: 26,
          close: 30,
          high: 32,
          low: 21
        },
        {
          open: 30,
          close: 31,
          high: 33,
          low: 27
        },
        {
          open: 31,
          close: 29,
          high: 33,
          low: 26
        },
        {
          open: 29,
          close: 20,
          high: 30,
          low: 18
        },
        {
          open: 20,
          close: 15,
          high: 25,
          low: 11
        },
        {
          open: 15,
          close: 9,
          high: 18,
          low: 6
        },
        {
          open: 9,
          close: 6,
          high: 11,
          low: 4
        },
        {
          open: 6,
          close: 7,
          high: 8,
          low: 3
        },
        {
          open: 7,
          close: 4,
          high: 9,
          low: 2
        },
        {
          open: 4,
          close: 6,
          high: 9,
          low: 3
        },
        {
          open: 6,
          close: 15,
          high: 17,
          low: 3
        },
        {
          open: 15,
          close: 18,
          high: 21,
          low: 12
        },
        {
          open: 18,
          close: 16,
          high: 23,
          low: 11
        },
        {
          open: 16,
          close: 17,
          high: 19,
          low: 10
        },
        {
          open: 17,
          close: 13,
          high: 18,
          low: 8
        }
      ]
    }
  },
  methods: {
    changeData() {
      this.candles = [
        {
          open: 6,
          close: 2,
          high: 7,
          low: 1
        },
        {
          open: 4,
          close: 5,
          high: 13,
          low: 2
        },
        {
          open: 1,
          close: 2,
          high: 8,
          low: 1
        }
      ]
    }
  },
  components: {
    CandleChart
  }
}
</script>

<style lang="scss" scoped>
.chart-header {
    font-size: 1.8rem;
    text-transform: uppercase;
    //text-align: center;
    margin-bottom: 20px;

    @media(min-width: 992px) {
        text-align: left;
        font-size: 1.8rem;
    }

    &.second {
        margin-top: 100px;
        text-align: left;

        @media(min-width: 992px) {
            text-align: center;
        }
    }
}
</style>
