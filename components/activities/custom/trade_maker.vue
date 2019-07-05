<template>
<b-row class="trade-maker">
  <b-col lg="9">
    <candle-chart v-on:candle-change="setCurrentCandle"
                  v-bind:candles="candles"
                  v-bind:total-candles="totalCandles"
                  v-bind:timeline="true"
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
                    v-bind:height="'160px'"
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
                    v-bind:height="'160px'"
                    v-bind:tooltip="'none'"
                    v-bind:interval="sliderInterval"
                    v-bind:disabled="exitDisabled || resultsReady">
        </vue-slider>
      </div>
      <div v-if="addStop"
           class="slider-group stop">
        <h3>Stop</h3>
        <span v-html="tradeTargets[2].toFixed(2)"></span>
        <vue-slider v-model="tradeTargets[2]"
                    v-bind:direction="'btt'"
                    v-bind:min="priceRange[0]"
                    v-bind:max="priceRange[1]"
                    v-bind:height="'160px'"
                    v-bind:tooltip="'none'"
                    v-bind:interval="sliderInterval"
                    v-bind:disabled="stopDisabled || resultsReady">
        </vue-slider>
      </div>
    </div>
    <b-btn class="start-btn"
           v-on:click="resumeTrading"
           v-if="progressive && !resultsReady"
           v-bind:disabled="tradingResumed">{{resumeTradingText}}</b-btn>
    <b-btn class="start-btn"
           v-on:click="checkTrade"
           v-bind:class="{'btn-success': progressive && resultsReady}"
           v-if="!progressive || (progressive && resultsReady)">{{checkTradeText}}</b-btn>
  </b-col>
  <div v-if="submitted"
       class="results-cont">
    <div class="results-bg"></div>
    <bounce class="od-loader"
            v-if="resultsLoad"></bounce>
    <div class="results"
         v-if="!resultsLoad">
      <div class="results-header"><span>Results</span></div>
      <div class="results-body">
        <div class="results-message">{{resultsMessage}}</div>
        <div v-if="profit == maxProfit"
             class="match-message">You matched the max profit potential!</div>
      </div>
      <div class="results-footer">
        <b-btn v-on:click="reset">Done</b-btn>
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
      checkTradeText: this.progressive ? 'View Results' : 'Check Profitability',
      tradeTargets: [ ...this.chartLines ],
      resultsMessage: null,
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
    stopDisabledAt: {
      type: String,
      default () {
        return 'none'
      }
    },
    addStop: {
      type: Boolean,
      default: false
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
    checkTrade() {
      this.resultsLoad = true
      this.submitted = true
      this.resultsMessage = this.evalTargets()

      setTimeout( () => {
        this.resultsLoad = false
      }, 1500 )
    },
    evalTargets() {
      const entry = this.checkTarget( 0, this.startIndex ) + 1
      const exit = entry ? this.checkTarget( 1, entry ) + 1 : 0
      const stop = entry ? this.checkTarget( 2, entry ) + 1 : 0
      let message = ''

      if ( !entry ) message = 'Price did not hit your target entry.'
      if ( !exit ) message = 'Price did not hit your target exit.'

      if ( !this.addStop || ( this.addStop && !stop ) ) {
        if ( !entry || !exit ) {
          return message
        } else if ( entry && exit ) {
          return 'Your trade was successful for a profit of +' + this.profit
        }
      } else if ( this.addStop && stop ) {
        if ( !entry ) return message
        if ( !exit ) {
          if ( stop > entry ) {
            return 'You stopped out for a loss of -' + this.loss
          }
        } else {
          if ( exit < stop && stop > entry ) {
            return 'Your trade was successful for a profit of +' + this.profit
          } else if ( exit > stop && stop > entry ) {
            return 'You stopped out for a loss of -' + this.loss
          }
        }
      }
    },
    checkTarget( targetIx, startIx ) {
      return this.totalCandles.findIndex( ( val, ix ) => {
        return ix >= startIx && this.tradeTargets[ targetIx ] >= this.totalCandles[ ix ].low && this.tradeTargets[ targetIx ] <= this.totalCandles[ ix ].high
      } )
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
    startIndex() {
      return this.progressive ? this.candles1.length : 0
    },
    profit() {
      const profit = Math.max( this.tradeTargets[ 0 ], this.tradeTargets[ 1 ] ) - Math.min( this.tradeTargets[ 0 ], this.tradeTargets[ 1 ] )
      return profit.toFixed( 2 )
    },
    loss() {
      const loss = Math.max( this.tradeTargets[ 0 ], this.tradeTargets[ 2 ] ) - Math.min( this.tradeTargets[ 0 ], this.tradeTargets[ 2 ] )
      return loss.toFixed( 2 )
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
    isLong() {
      return this.tradeTargets[ 0 ] <= this.tradeTargets[ 1 ]
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
    },
    stopDisabled() {
      if ( this.stopDisabledAt === 'none' ) return false
      else return this.totalCandles.findIndex( o => o.label === this.stopDisabledAt ) <= this.currentCandle ? true : false
    }
  }

}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

.trade-maker {
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

                .results-message {
                    text-align: center;
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
            height: 200px;
        }

        .slider-group {
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
                display: none;
            }

            span {
                margin-bottom: 25px;
                font-size: 1.2rem;
                font-weight: 600;
            }

            .vue-slider {
                width: 12px !important;
                padding: 0 !important;

                .vue-slider-rail {
                    border-radius: 0;
                    background: lighten($dark-blue, 3%);
                    border: 1px solid lighten($dark-blue, 15%);
                    height: 120px;

                    @media(min-width: 768px) {
                        height: 160px;
                    }
                }

                .vue-slider-process {
                    border-radius: 0;
                    background: none !important;
                }

                .vue-slider-dot {
                    width: 100%;

                    .vue-slider-dot-handle {
                        width: 54px;
                        height: 30px;
                        position: relative;
                        top: -14px;
                        left: -20px;
                        text-align: center;
                        line-height: 30px;
                        z-index: 1000;
                        font-size: 17px;
                        border-radius: 0;

                        &:before {
                            content: "Enter";
                            font-weight: 600;
                            color: $dark-blue;
                        }

                    }
                }
            }

            &:nth-child(2) {
                .vue-slider {
                    .vue-slider-dot {
                        .vue-slider-dot-handle {
                            &:before {
                                content: "Exit";
                            }
                        }
                    }
                }
            }

            &.stop {
                .vue-slider {
                    .vue-slider-dot {
                        .vue-slider-dot-handle {
                            //background: $red;

                            &:before {
                                content: "Stop";
                                //color: #fff;
                            }
                        }
                    }
                }
            }
        }

        .slider-group:first-child:nth-last-child(2),
        .slider-group:first-child:nth-last-child(2) ~ .slider-group {
            width: 50%;
        }

        .slider-group:first-child:nth-last-child(3),
        .slider-group:first-child:nth-last-child(3) ~ .slider-group {
            width: 33.3333%;
        }
    }

    .start-btn {
        width: 100%;
        margin-top: 50px;
    }
}

.light {

    .trade-maker {

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

                &.stop {
                    .vue-slider {
                        .vue-slider-dot {
                            .vue-slider-dot-handle {
                                //background: darken($red, 5%);

                                &:before {
                                    content: "Stop";
                                    //color: #fff;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}
</style>
