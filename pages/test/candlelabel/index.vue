<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Candle Labeler</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col lg="8">
      <p class="question">
        Click on a candle until it has the correct label. Continue until you have labeled each candle. B = Base, L = Leg
      </p>
    </b-col>
  </b-row>
  <candle-label v-bind:candles="candles"
                v-bind:correct-labels="correctLabels"
                v-bind:price-range="[0,32]">
  </candle-label>
  <div class="spacer"></div>
  <b-row>
    <b-col lg="8">
      <p class="question">
        Click on each gap candle until it has the correct label (Chart candles not accurate). I = Inside, O = Outside
      </p>
    </b-col>
  </b-row>
  <candle-label v-bind:candles="candles"
                v-bind:correct-labels="correctLabels2"
                v-bind:label-types="['I', 'O']"
                v-bind:label-indexes="labelIndexes"
                v-bind:price-range="[0,32]">
  </candle-label>
  <div class="spacer"></div>
  <b-row>
    <b-col lg="8">
      <p class="question">
        Click on each gap candle until it has the correct label (Chart candles not accurate). P = Professional, N = Novice
      </p>
    </b-col>
  </b-row>
  <candle-label v-bind:candles="candles"
                v-bind:correct-labels="correctLabels3"
                v-bind:label-types="['P', 'N']"
                v-bind:label-indexes="labelIndexes"
                v-bind:price-range="[0,32]">
  </candle-label>
</b-container>
</template>

<script>
import CandleLabel from '~/components/activities/custom/candle_label'

export default {
  components: {
    CandleLabel
  },
  data() {
    return {
      candles: [
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
        }
      ],
      correctLabels: [
        'B', 'B', 'L', 'L', 'L', 'B', 'B', 'B', 'L', 'L', 'B', 'B', 'B'
      ],
      correctLabels2: [
        null, null, 'I', null, null, null, null, 'O', null, null, 'I', null, null
      ],
      correctLabels3: [
        null, null, 'P', null, null, null, null, 'N', null, null, 'P', null, null
      ],
      labelIndexes: [ 2, 7, 10 ]
    }
  }
}
</script>

<style lang="scss" scoped>
.spacer {
    margin-bottom: 100px;
}

.question {
    font-size: 1.05rem;
    margin-bottom: 15px;
}
</style>
