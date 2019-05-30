<template>
<b-row class="max-profit">
  <b-col lg="9">
    <candle-chart v-on:candle-change="setCurrentCandle"
                  v-bind:candles="candles"
                  v-bind:total-candles="totalCandles"
                  v-bind:time-label="timeLabel"
                  v-bind:time-label-interval="timeLabelInterval"
                  v-bind:height="chartHeight"
                  v-bind:force-range="priceRange"
                  v-bind:price-display="priceDisplay"
                  v-bind:price-width="priceWidth"
                  v-bind:candle-width="candleWidth"
                  v-bind:candle-spacing="candleSpacing"
                  v-bind:chart-lines="tradeTargets"
                  v-bind:candle-highlight="candleHighlight">
    </candle-chart>
  </b-col>
  <b-col lg="3">
    <div class="slider-cont">
      <div class="slider-group">
        <h3>Enter</h3>
        <span v-html="tradeTargets[0].toFixed(2)"></span>
        <vue-slider v-model="tradeTargets[0]"
                    v-bind:direction="'btt'"
                    v-bind:min="priceRange[0]"
                    v-bind:max="priceRange[1]"
                    v-bind:height="'100%'"
                    v-bind:tooltip="'none'"
                    v-bind:interval="sliderInterval"
                    v-bind:disabled="enterDisabled || resultsReady">
        </vue-slider>
      </div>
      <div class="slider-group">
        <h3>Exit</h3>
        <span v-html="tradeTargets[1].toFixed(2)"></span>
        <vue-slider v-model="tradeTargets[1]"
                    v-bind:direction="'btt'"
                    v-bind:min="priceRange[0]"
                    v-bind:max="priceRange[1]"
                    v-bind:height="'100%'"
                    v-bind:tooltip="'none'"
                    v-bind:interval="sliderInterval"
                    v-bind:disabled="exitDisabled || resultsReady">
        </vue-slider>
      </div>
    </div>
    <b-btn class="start-btn"
           v-on:click="resumeTrading"
           v-if="progressive && !resultsReady"
           v-bind:disabled="tradingResumed">{{resumeTradingText}}</b-btn>
    <b-btn class="start-btn"
           v-on:click="checkProfit"
           v-bind:class="{'btn-success': progressive && resultsReady}"
           v-if="!progressive || (progressive && resultsReady)">{{checkProfitText}}</b-btn>
  </b-col>
  <div v-if="submitted"
       class="results-cont">
    <div class="results-bg"></div>
    <bounce class="od-loader"
            v-if="resultsLoad"></bounce>
    <div class="results"
         v-if="!resultsLoad">
      <div class="results-header"><span v-if="error">Out of Bounds</span><span v-if="!error">Results</span></div>
      <div class="results-body">
        <div v-if="error"
             class="results-error">
          Please place your Enter and Exit points within the chart's highest and lowest traded price.
        </div>
        <div v-if="!error && unfilled"
             class="results-unfilled">
          Your sell order was not filled because price did not hit your exit target.
        </div>
        <div v-if="!error && !unfilled">
          <div><span>Your Profit:</span><span>+{{profit}}</span></div>
          <div><span>Max Profit Potential:</span><span>+{{maxProfit}}</span></div>
        </div>
        <div v-if="!error && profit == maxProfit"
             class="match-message">You matched the max profit potential!</div>
      </div>
      <div class="results-footer">
        <b-btn v-if="error"
               v-on:click="clearError">Try Again</b-btn>
        <b-btn v-if="!error"
               v-on:click="reset">Done</b-btn>
      </div>
    </div>
  </div>
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
      origCandles: [ ...this.candles1 ],
      candles: [ ...this.candles1 ],
      checkProfitText: this.progressive ? 'View Results' : 'Check Profitability',
      tradeTargets: [ ...this.chartLines ],
      resultsLoad: false,
      resultsReady: false,
      tradingResumed: false,
      submitted: false,
      error: false,
      unfilled: false,
      currentCandle: 0
    }
  },
  props: {
    candles1: {
      type: Array,
      default () {
        return []
      }
    },
    candles2: {
      type: Array,
      default () {
        return []
      }
    },
    chartHeight: {
      type: Number,
      default: 260
    },
    chartLines: {
      type: Array,
      default () {
        return [ 0, 0 ]
      }
    },
    timeLabel: {
      type: String
    },
    timeLabelInterval: {
      type: Number
    },
    enterDisabledAt: {
      type: String,
      default () {
        return 'none'
      }
    },
    exitDisabledAt: {
      type: String,
      default () {
        return 'none'
      }
    },
    startBtnLabel: {
      type: String,
      default: 'Start Trading'
    },
    progressBtnLabel: {
      type: String,
      default: 'In Progress'
    },
    priceRange: {
      type: Array,
      default () {
        return [ 0, 40 ]
      }
    },
    priceDisplay: {
      type: Number,
      default: 5
    },
    priceWidth: {
      type: Number,
      default: 60
    },
    candleWidth: {
      type: Number,
      default: 20
    },
    candleSpacing: {
      type: Number,
      default: 40
    },
    detailPane: {
      type: Boolean,
      default: false
    },
    detailPosition: {
      type: String,
      default: 'top'
    },
    candleHighlight: {
      type: Boolean,
      default: false
    },
    sliderInterval: {
      type: Number,
      default: 1
    },
    progressive: {
      type: Boolean,
      default: false
    },
    breakpoint: {
      type: Number,
      default: 5
    }
  },
  methods: {
    checkProfit() {
      this.resultsLoad = true
      this.submitted = true

      if ( Math.max( this.tradeTargets[ 0 ], this.tradeTargets[ 1 ] ) > this.priceHigh || Math.min( this.tradeTargets[ 0 ], this.tradeTargets[ 1 ] ) < this.priceLow ) {
        this.progressive ? this.unfilled = true : this.error = true
      }

      setTimeout( () => {
        this.resultsLoad = false
      }, 1500 )
    },
    reset() {
      this.submitted = this.unfilled = this.error = this.resultsReady = false
      this.tradeTargets = [ ...this.chartLines ]
      this.candles = [ ...this.origCandles ]

      if ( this.progressive ) {
        this.tradingResumed = false
      }
    },
    clearError() {
      this.submitted = false
      this.error = false
    },
    resumeTrading() {
      let i = 0
      let oldCandles = [ ...this.candles ]
      this.tradingResumed = true

      const interval = setInterval( () => {
        if ( i === this.candles2.length - 1 ) {
          clearInterval( interval )
          this.resultsReady = true
        }
        oldCandles = [ ...oldCandles, this.candles2[ i ] ]
        this.candles = oldCandles
        i++;
      }, 1000 );
    },
    setCurrentCandle( ev ) {
      this.currentCandle = ev
    }
  },
  computed: {
    profit() {
      const profit = Math.max( this.tradeTargets[ 0 ], this.tradeTargets[ 1 ] ) - Math.min( this.tradeTargets[ 0 ], this.tradeTargets[ 1 ] )
      return profit.toFixed( 2 )
    },
    priceHigh() {
      return Math.max.apply( Math, this.candles.map( function ( o ) {
        return o.high;
      } ) )
    },
    priceLow() {
      return Math.min.apply( Math, this.candles.map( function ( o ) {
        return o.low;
      } ) )
    },
    maxProfit() {
      const diff = Math.max( this.priceHigh, this.priceLow ) - Math.min( this.priceHigh, this.priceLow )
      return diff.toFixed( 2 )
    },
    resumeTradingText() {
      return this.tradingResumed ? this.progressBtnLabel : this.startBtnLabel
    },
    totalCandles() {
      return this.progressive ? [ ...this.candles1, ...this.candles2 ] : [ ...this.candles1 ]
    },
    enterDisabled() {
      if ( this.enterDisabledAt === 'none' ) return false
      else return this.totalCandles.findIndex( o => o.label === this.enterDisabledAt ) <= this.currentCandle ? true : false

    },
    exitDisabled() {
      if ( this.exitDisabledAt === 'none' ) return false
      else return this.totalCandles.findIndex( o => o.label === this.exitDisabledAt ) <= this.currentCandle ? true : false
    }
  }

}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

.max-profit {
    position: relative;
    padding-bottom: 20px;

    .results-cont {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1005;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .results-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: $dark-blue;
            opacity: 0.4;
            z-index: 1005;
        }

        .od-loader {
            z-index: 1005;

            .spinner {
                > div {
                    background: #fff;
                }
            }
        }

        .results {
            width: 90%;
            max-width: 450px;
            background: lighten($dark-blue, 10%);
            align-self: center;
            margin-top: 160px;
            z-index: 1010;

            @media(min-width: 768px) {
                margin-top: 50px;
            }

            .results-header {
                font-size: 1.4rem;
                font-weight: 600;
                text-align: center;
                padding: 20px 25px;
                background: lighten($dark-blue, 5%);
            }

            .results-body {
                padding: 20px 25px;
                font-size: 1.15rem;
                font-weight: 600;

                div {
                    div {
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;

                        > span:last-child {
                            color: $green;
                        }

                        &:first-child {
                            margin-bottom: 5px;
                        }
                    }
                }

                .results-error,
                .results-unfilled {
                    text-align: center;
                }

                .results-unfilled {
                    color: lighten($red, 15%);
                }

                .match-message {
                    text-align: center;
                    color: $orange;
                    margin-top: 15px;
                }
            }

            .results-footer {
                padding: 0 25px 20px;
                text-align: center;
            }
        }
    }

    .slider-cont {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        height: 160px;

        @media(min-width: 768px) {
            height: 232px;
        }

        .slider-group {
            width: 50%;
            display: flex;
            flex-direction: column;
            margin-top: 0;

            .vue-slider,
            h3,
            span {
                align-self: center;
            }

            h3,
            span {
                font-size: 1.4rem;
                text-transform: uppercase;
            }

            h3 {
                margin-bottom: 0;
            }

            span {
                margin-bottom: 35px;
                font-size: 1.1rem;
            }

            .vue-slider {
                width: 12px !important;
                padding: 0 !important;

                .vue-slider-rail {
                    border-radius: 0;
                    background: lighten($dark-blue, 3%);
                    border: 1px solid lighten($dark-blue, 15%);
                }

                .vue-slider-process {
                    border-radius: 0;
                    background: none !important;
                }

                .vue-slider-dot {
                    width: 100%;

                    .vue-slider-dot-handle {
                        width: 40px;
                        height: 40px;
                        position: relative;
                        top: -14px;
                        left: -13px;
                        text-align: center;
                        line-height: 40px;
                        z-index: 1000;
                        font-size: 36px;

                        &:before {
                            content: "\e90f";
                            font-family: "custom-icons";
                            color: $dark-blue;
                        }

                    }
                }
            }
        }
    }

    .start-btn {
        width: 100%;
        margin-top: 50px;
    }
}

.light {

    .max-profit {

        .results-cont {
            .results-bg {
                background: #fff;
                opacity: 0.6;
            }

            .od-loader {
                .spinner {
                    > div {
                        background: $light-header-color;
                    }
                }
            }

            .results {
                background: rgb(247,247,247);
                border: 1px solid #ccc;

                .results-header {
                    background: rgb(240,240,240);
                    color: $light-header-color;
                }

                .results-body {
                    color: darken($light-text-color, 10%);

                    div {
                        div {

                            > span:last-child {
                                color: $green-med;
                            }

                        }
                    }
                }
            }
        }

        .slider-cont {
            .slider-group {
                h3 {
                    color: $light-header-color;
                }

                .vue-slider {
                    .vue-slider-dot-handle {
                        background: $light-header-color;
                        box-shadow: none;
                        &:before {
                            color: #fff;
                        }
                    }
                    .vue-slider-rail {
                        background: rgba(0,0,0,0.03);
                        border: 1px solid #bbbbbb;
                    }
                }
            }
        }
    }

}
</style>
