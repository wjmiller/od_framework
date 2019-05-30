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
        Use the sliders to move the <b>Enter</b> and <b>Exit</b> targets on the chart below to capture the maximum profit that could have been achieved during this trading period.
      </p>
    </b-col>
  </b-row>
  <max-profit v-bind:candles1="candlesCombined"
              v-bind:chart-lines="chartLines1"
              v-bind:time-label="'Time'"
              v-bind:time-label-interval="2">
  </max-profit>
  <div class="spacer"></div>
  <b-row>
    <b-col lg="8">
      <p class="question">
        This activity allows you to begin a trading day and move the <b>Exit</b> target as time moves along.
      </p>
    </b-col>
  </b-row>
  <max-profit v-bind:progressive="true"
              v-bind:candles1="candles1"
              v-bind:candles2="candles2"
              v-bind:chart-lines="chartLines2"
              v-bind:time-label="'Time'"
              v-bind:time-label-interval="2"
              v-bind:enter-disabled-at="'09:30'">
  </max-profit>
  <div class="spacer"></div>
  <b-row>
    <b-col lg="8">
      <p class="question">
        This activity allows you to begin a trading day and move the <b>Exit</b> target until 12:30, then it locks.
      </p>
    </b-col>
  </b-row>
  <max-profit v-bind:progressive="true"
              v-bind:candles1="candles1"
              v-bind:candles2="candles2"
              v-bind:chart-lines="chartLines2"
              v-bind:time-label="'Time'"
              v-bind:time-label-interval="2"
              v-bind:enter-disabled-at="'09:30'"
              v-bind:exit-disabled-at="'12:30'">
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
      ],
      candles2: [
        {
          open: 4,
          close: 2,
          high: 7,
          low: 1,
          label: '09:30'
        },
        {
          open: 2,
          close: 1,
          high: 4,
          low: 1,
          label: '09:45'
        },
        {
          open: 1,
          close: 6,
          high: 8,
          low: 1,
          label: '10:00'
        },
        {
          open: 6,
          close: 12,
          high: 16,
          low: 4,
          label: '10:15'
        },
        {
          open: 12,
          close: 16,
          high: 19,
          low: 8,
          label: '10:30'
        },
        {
          open: 16,
          close: 17,
          high: 23,
          low: 14,
          label: '10:45'
        },
        {
          open: 17,
          close: 15,
          high: 22,
          low: 13,
          label: '11:00'
        },
        {
          open: 15,
          close: 16,
          high: 17,
          low: 12,
          label: '11:15'
        },
        {
          open: 16,
          close: 11,
          high: 16,
          low: 11,
          label: '11:30'
        },
        {
          open: 11,
          close: 7,
          high: 14,
          low: 5,
          label: '11:45'
        },
        {
          open: 7,
          close: 5,
          high: 9,
          low: 1,
          label: '12:00'
        },
        {
          open: 5,
          close: 7,
          high: 10,
          low: 3,
          label: '12:15'
        },
        {
          open: 7,
          close: 6,
          high: 9,
          low: 4,
          label: '12:30'
        },
        {
          open: 6,
          close: 10,
          high: 15,
          low: 4,
          label: '12:45'
        },
        {
          open: 10,
          close: 15,
          high: 18,
          low: 7,
          label: '01:00'
        },
        {
          open: 15,
          close: 20,
          high: 24,
          low: 14,
          label: '01:15'
        },
        {
          open: 20,
          close: 23,
          high: 26,
          low: 17,
          label: '01:30'
        },
        {
          open: 23,
          close: 25,
          high: 27,
          low: 25,
          label: '01:45'
        },
        {
          open: 25,
          close: 24,
          high: 30,
          low: 22,
          label: '02:00'
        },
        {
          open: 24,
          close: 23,
          high: 27,
          low: 21,
          label: '02:15'
        },
        {
          open: 23,
          close: 18,
          high: 26,
          low: 14,
          label: '02:30'
        },
        {
          open: 18,
          close: 15,
          high: 23,
          low: 13,
          label: '02:45'
        },
        {
          open: 15,
          close: 14,
          high: 17,
          low: 13,
          label: '03:00'
        },
        {
          open: 14,
          close: 16,
          high: 18,
          low: 12,
          label: '03:15'
        },
        {
          open: 16,
          close: 22,
          high: 24,
          low: 12,
          label: '03:30'
        },
        {
          open: 22,
          close: 26,
          high: 29,
          low: 20,
          label: '03:45'
        },
        {
          open: 26,
          close: 29,
          high: 29,
          low: 22,
          label: '04:00'
        }
      ]
    }
  },
  computed: {
    candlesCombined() {
      return [ ...this.candles1, ...this.candles2 ]
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
