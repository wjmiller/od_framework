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
      <h2 class="chart-header">Days of Trading (Side Details)</h2>
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
                    v-bind:detail-pane="true"
                    v-bind:detail-position="'side'"
                    v-bind:time-label="'Days'"
                    v-bind:time-label-interval="4">
      </candle-chart>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="12">
      <h2 class="chart-header second">Days of Trading (Top Details)</h2>
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
                    v-bind:detail-pane="true"
                    v-bind:detail-position="'top'"
                    v-bind:time-label="'Days'"
                    v-bind:time-label-interval="4">
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
      chartLines: [ 20, 30 ],
      candles: [
        {
          open: 4,
          close: 2,
          high: 7,
          low: 1,
          label: '4/1'
        },
        {
          open: 2,
          close: 1,
          high: 4,
          low: 1,
          label: '4/2'
        },
        {
          open: 1,
          close: 6,
          high: 8,
          low: 1,
          label: '4/3'
        },
        {
          open: 6,
          close: 12,
          high: 16,
          low: 4,
          label: '4/5'
        },
        {
          open: 12,
          close: 16,
          high: 19,
          low: 8,
          label: '4/6'
        },
        {
          open: 16,
          close: 17,
          high: 23,
          low: 14,
          label: '4/7'
        },
        {
          open: 17,
          close: 15,
          high: 22,
          low: 13,
          label: '4/8'
        },
        {
          open: 15,
          close: 16,
          high: 17,
          low: 12,
          label: '4/9'
        },
        {
          open: 16,
          close: 11,
          high: 16,
          low: 11,
          label: '4/10'
        },
        {
          open: 11,
          close: 7,
          high: 14,
          low: 5,
          label: '4/11'
        },
        {
          open: 7,
          close: 5,
          high: 9,
          low: 1,
          label: '4/12'
        },
        {
          open: 5,
          close: 7,
          high: 10,
          low: 3,
          label: '4/13'
        },
        {
          open: 7,
          close: 6,
          high: 9,
          low: 4,
          label: '4/14'
        },
        {
          open: 6,
          close: 10,
          high: 15,
          low: 4,
          label: '4/15'
        },
        {
          open: 10,
          close: 15,
          high: 18,
          low: 7,
          label: '4/16'
        },
        {
          open: 15,
          close: 20,
          high: 24,
          low: 14,
          label: '4/17'
        },
        {
          open: 20,
          close: 23,
          high: 26,
          low: 17,
          label: '4/18'
        },
        {
          open: 23,
          close: 25,
          high: 27,
          low: 25,
          label: '4/19'
        },
        {
          open: 25,
          close: 24,
          high: 30,
          low: 22,
          label: '4/20'
        },
        {
          open: 24,
          close: 23,
          high: 27,
          low: 21,
          label: '4/21'
        },
        {
          open: 23,
          close: 18,
          high: 26,
          low: 14,
          label: '4/22'
        },
        {
          open: 18,
          close: 15,
          high: 23,
          low: 13,
          label: '4/23'
        },
        {
          open: 15,
          close: 14,
          high: 17,
          low: 13,
          label: '4/24'
        },
        {
          open: 14,
          close: 16,
          high: 18,
          low: 12,
          label: '4/25'
        },
        {
          open: 16,
          close: 22,
          high: 24,
          low: 12,
          label: '4/26'
        },
        {
          open: 22,
          close: 30,
          high: 34,
          low: 20,
          label: '4/27'
        },
        {
          open: 30,
          close: 26,
          high: 32,
          low: 22,
          label: '4/28'
        },
        {
          open: 26,
          close: 30,
          high: 32,
          low: 21,
          label: '4/29'
        },
        {
          open: 30,
          close: 31,
          high: 33,
          low: 27,
          label: '4/30'
        },
        {
          open: 31,
          close: 29,
          high: 33,
          low: 26,
          label: '5/1'
        },
        {
          open: 29,
          close: 20,
          high: 30,
          low: 18,
          label: '5/2'
        },
        {
          open: 20,
          close: 15,
          high: 25,
          low: 11,
          label: '5/3'
        },
        {
          open: 15,
          close: 9,
          high: 18,
          low: 6,
          label: '5/4'
        },
        {
          open: 9,
          close: 6,
          high: 11,
          low: 4,
          label: '5/5'
        },
        {
          open: 6,
          close: 7,
          high: 8,
          low: 3,
          label: '5/6'
        },
        {
          open: 7,
          close: 4,
          high: 9,
          low: 2,
          label: '5/7'
        },
        {
          open: 4,
          close: 6,
          high: 9,
          low: 3,
          label: '5/8'
        },
        {
          open: 6,
          close: 15,
          high: 17,
          low: 3,
          label: '5/9'
        },
        {
          open: 15,
          close: 18,
          high: 21,
          low: 12,
          label: '5/10'
        },
        {
          open: 18,
          close: 16,
          high: 23,
          low: 11,
          label: '5/11'
        },
        {
          open: 16,
          close: 17,
          high: 19,
          low: 10,
          label: '5/12'
        },
        {
          open: 17,
          close: 13,
          high: 18,
          low: 8,
          label: '5/13'
        }
      ],
      candles2: [
        {
          open: 4,
          close: 2,
          high: 7,
          low: 1,
          label: '4/1'
        },
        {
          open: 2,
          close: 1,
          high: 4,
          low: 1,
          label: '4/2'
        },
        {
          open: 1,
          close: 6,
          high: 8,
          low: 1,
          label: '4/3'
        },
        {
          open: 6,
          close: 12,
          high: 16,
          low: 4,
          label: '4/5'
        },
        {
          open: 12,
          close: 16,
          high: 19,
          low: 8,
          label: '4/6'
        },
        {
          open: 16,
          close: 17,
          high: 23,
          low: 14,
          label: '4/7'
        },
        {
          open: 17,
          close: 15,
          high: 22,
          low: 13,
          label: '4/8'
        },
        {
          open: 15,
          close: 16,
          high: 17,
          low: 12,
          label: '4/9'
        },
        {
          open: 16,
          close: 11,
          high: 16,
          low: 11,
          label: '4/10'
        },
        {
          open: 11,
          close: 7,
          high: 14,
          low: 5,
          label: '4/11'
        },
        {
          open: 7,
          close: 5,
          high: 9,
          low: 1,
          label: '4/12'
        },
        {
          open: 5,
          close: 7,
          high: 10,
          low: 3,
          label: '4/13'
        },
        {
          open: 7,
          close: 6,
          high: 9,
          low: 4,
          label: '4/14'
        },
        {
          open: 6,
          close: 10,
          high: 15,
          low: 4,
          label: '4/15'
        },
        {
          open: 10,
          close: 15,
          high: 18,
          low: 7,
          label: '4/16'
        },
        {
          open: 15,
          close: 20,
          high: 24,
          low: 14,
          label: '4/17'
        },
        {
          open: 20,
          close: 23,
          high: 26,
          low: 17,
          label: '4/18'
        },
        {
          open: 23,
          close: 25,
          high: 27,
          low: 25,
          label: '4/19'
        },
        {
          open: 25,
          close: 24,
          high: 30,
          low: 22,
          label: '4/20'
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
