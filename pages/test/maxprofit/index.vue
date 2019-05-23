<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Max Profit</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col lg="8">
      <p class="question">
        Place the <b>Enter</b> and <b>Exit</b> points on the chart below to capture the maximum profit that could have been achieved during this trading period.
      </p>
    </b-col>
  </b-row>
  <max-profit v-bind:candles1="candles2"
              v-bind:chart-height="260"
              v-bind:chart-lines="chartLines1"
              v-bind:candle-highlight="false"
              v-bind:profit-potential="[33,0,0]">
  </max-profit>
  <div class="spacer"></div>
  <b-row>
    <b-col lg="8">
      <p class="question">
        Place the <b>Enter</b> and <b>Exit</b> points for a trade on the chart below and click <b>Resume Trading</b> to see if you can fill a trade for a profit.
      </p>
    </b-col>
  </b-row>
  <max-profit v-bind:candles1="candles1"
              v-bind:candles2="candles2"
              v-bind:progressive="true"
              v-bind:chart-height="260"
              v-bind:chart-lines="chartLines2"
              v-bind:enter-disabled="true"
              v-bind:candle-highlight="false"
              v-bind:profit-potential="[33,0,0]">
  </max-profit>
</b-container>
</template>

<script>
import MaxProfit from '~/components/activities/custom/max_profit'

export default {
  components: {
    MaxProfit
  },
  data() {
    return {
      chartLines1: [ 0, 0 ],
      chartLines2: [ 1, 0 ],
      candles1: [
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
        }
      ],
      candles2: [
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

.spacer {
    margin-bottom: 100px;
}

.question {
    font-size: 1.05rem;
    margin-bottom: 15px;
}
</style>
