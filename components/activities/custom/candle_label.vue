<template>
<b-row class="candle-label">
  <b-col lg="12">
    <div class="label-toolbar">
      <b-btn v-on:click="evalLabels"
             class="eval-labels-btn">
        <span></span> Check Labels
      </b-btn>
    </div>
    <candle-chart v-on:change-label="changeLabel"
                  v-bind:candles="candles"
                  v-bind:candle-labels="labels"
                  v-bind:feedback="showFeedback"
                  v-bind:label-types="labelTypes"
                  v-bind:timeline="true"
                  v-bind:time-label="timeLabel"
                  v-bind:time-label-interval="timeLabelInterval"
                  v-bind:height="chartHeight"
                  v-bind:force-range="priceRange"
                  v-bind:price-display="priceDisplay"
                  v-bind:price-width="priceWidth"
                  v-bind:candle-width="candleWidth"
                  v-bind:candle-spacing="candleSpacing"
                  v-bind:candle-highlight="false">
    </candle-chart>
  </b-col>
</b-row>
</template>

<script>
import CandleChart from '~/components/activities/candle_chart'

export default {
  components: {
    CandleChart
  },
  data() {
    return {
      labels: this.candles.map( ( item, ix ) => {
        return {
          label: '?',
          correct: false
        }
      } ),
      showFeedback: false,
      currentCandle: this.candles[ 0 ]
    }
  },
  props: {
    candles: {
      type: Array,
      default () {
        return []
      }
    },
    labelTypes: {
      type: Array,
      default () {
        return [ 'B', 'L' ]
      }
    },
    correctLabels: {
      type: Array,
      default: null
    },
    timeLabel: {
      type: String,
      default: 'Time'
    },
    timeLabelInterval: {
      type: Number,
      default: 2
    },
    chartHeight: {
      type: Number,
      default: 300
    },
    priceRange: {
      type: Array,
      default () {
        return [ 0, 40 ]
      }
    },
    priceDisplay: {
      type: Number,
      default: 10
    },
    priceWidth: {
      type: Number,
      default: 60
    },
    candleWidth: {
      type: Number,
      default: 30
    },
    candleSpacing: {
      type: Number,
      default: 60
    }
  },
  methods: {
    changeLabel( ix ) {
      this.showFeedback = false
      const currentLabelIx = this.labelTypes.indexOf( this.labels[ ix ].label )
      const label = currentLabelIx < this.labelTypes.length - 1 ? this.labelTypes[ currentLabelIx + 1 ] : this.labelTypes[ 0 ]

      this.$set( this.labels, ix, {
        label: label,
        correct: this.labels[ ix ].correct
      } )
    },
    evalLabels() {
      for ( let ix in this.correctLabels ) {
        const correct = this.correctLabels[ ix ] == this.labels[ ix ].label
        correct ? this.$set( this.labels, ix, {
          label: this.labels[ ix ].label,
          correct: true
        } ) : this.$set( this.labels, ix, {
          label: this.labels[ ix ].label,
          correct: false
        } )
      }
      this.showFeedback = true
    }
  }
}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

.candle-label {
    position: relative;
}

.label-toolbar {
    min-height: 42px;
    margin-bottom: 10px;

    .eval-labels-btn {
        margin-right: 15px;
        vertical-align: top;
        padding: 0.3rem 1.2rem 0.4rem;
        font-size: 1rem;

        span {
            margin-right: 3px;

            &:before {
                content: "\e065";
                font-family: "custom-icons";
            }
        }
    }
}
</style>
