<template lang="html">
<div class="row candle-row">
  <div class="col-sm-12 col-md-12 col-lg-4">
    <price-chart v-bind:pcdata="candle.candlechart.cdata" />
  </div>
  <div class="col-sm-12 col-md-12 col-lg-5">
    <candle-builder v-bind:cbdata="candle.candlechart"
                    v-on:candleChange="isCorrect" />
  </div>
  <div class="col-sm-12 col-md-12 col-lg-3">
    <candle-feedback v-bind:theme="theme"
                     v-bind:active="active"
                     v-bind:feedbackData="feedbackData"
                     v-bind:correct="correct"
                     v-bind:checked="checked" />
  </div>
</div>
</template>

<script>
import CandleBuilder from './candle_builder.vue'
import PriceChart from '../subcomponents/price_chart.vue'
import CandleFeedback from './candle_feedback.vue'

export default {
  name: 'candle-row',
  props: [ 'candle', 'theme', 'actId' ],
  data() {
    return {
      active: true,
      correct: false,
      checked: false,
      feedbackData: {},
      checkData: {}
    }
  },
  methods: {
    isCorrect( data ) {
      this.feedbackData = {
        open: Math.abs( this.candle.candlechart.csdata.open - data.open ),
        close: Math.abs( this.candle.candlechart.csdata.close - data.close ),
        high: Math.abs( this.candle.candlechart.csdata.high - data.high ),
        low: Math.abs( this.candle.candlechart.csdata.low - data.low ),
      }
      this.checked = false;
      this.correct = this.feedbackData.open === 0 && this.feedbackData.close === 0 && this.feedbackData.high === 0 && this.feedbackData.low === 0 ? true : false;
      this.$emit( 'candle-correct', this.correct );
    }
  },
  components: {
    CandleBuilder,
    CandleFeedback,
    PriceChart
  }
}
</script>

<style lang="scss" scoped>
//------------------------------------------------------
// Import Variables
//------------------------------------------------------

@import '~assets/scss/variables.scss';

//------------------------------------------------------
// Candle Row
//------------------------------------------------------

.activity-group {
    .candle-row {
        padding-bottom: 30px;
        margin-bottom: 50px;

        @media(min-width: 576px) {
            padding-bottom: 5px;
            margin-bottom: 25px;
        }
    }
}

// Dark/Light Theme Styles -----------------------------

.dark {
    .activity-group {
        .candle-row {
            border-bottom: 1px solid lighten($dark-pane-border, 10%);

            @media(min-width: 576px) {
                border-bottom: 1px solid $dark-pane-border;
            }
        }
    }
}

.light {
    .activity-group {
        .candle-row {
            border-bottom: 1px solid $light-pane-border;
        }
    }
}
</style>
