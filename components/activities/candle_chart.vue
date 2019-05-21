<!-- Template -->
<template>
<div class="candle-chart"
     v-bind:class="{'no-pane':!detailPane}">
  <div class="chart-wrapper">
    <div class="chart-info"
         v-if="!detailPane">
      <span>Open: {{currentCandle.open}}</span>
      <span>Close: {{currentCandle.close}}</span>
      <span>High: {{currentCandle.high}}</span>
      <span>Low: {{currentCandle.low}}</span>
    </div>
    <div class="chart-canvas"
         ref="chart_canvas">
      <div>

        <svg class="chart-candles"
             ref="chart_candles"
             v-bind:viewBox="candleChart.x + ' 0 ' + candleChart.width + ' ' + `${height + chartPadding}`"
             v-bind:width="candleChart.width">
          <!-- Chart Background -->
          <rect v-bind:width="chartWidth"
                v-bind:height="`${height + chartPadding}px`"
                class="chart-bg"></rect>
          <!-- Candlestick -->
          <g v-for="(candle, index) in chartCandles"
             v-bind:key="`candle-${index}`">
            <!-- Candle Top Wick -->
            <line v-bind:x1="candle.line.x1"
                  v-bind:x2="candle.line.x2"
                  v-bind:y1="candle.line.y1"
                  v-bind:y2="candle.line.y2"
                  class="candle-wick" />
            <!-- Candle Body -->
            <rect v-bind:width="candle.rect.width"
                  v-bind:x="candle.rect.x"
                  v-bind:y="candle.rect.y"
                  v-bind:height="candle.rect.height"
                  v-bind:class="`candle-${candle.rect.color}`"
                  ref="candlebody" />
          </g>
        </svg>

        <vue-slider v-model="candleNum"
                    v-bind:min="0"
                    v-bind:max="candles.length - 1"
                    v-bind:tooltip="'none'"
                    v-on:change="adjustChart()"></vue-slider>

      </div>
      <svg class="chart-prices"
           ref="chart_prices"
           v-bind:width="`${priceWidth}px`"
           v-bind:height="`${height + chartPadding}px`">
        <!-- Price Labels -->
        <text x="20"
              v-for="(price, index) in priceReverse"
              v-bind:key="'price-' + index"
              v-bind:y="pricePosition(price)"
              class="chart-num">{{displayPrice(price)}}</text>
        <!-- Price Lines -->
        <line v-for="(price, index) in prices"
              v-bind:y1="pricePosition(price)"
              v-bind:y2="pricePosition(price)"
              v-bind:key="'line-' + index"
              class="chart-pline"
              v-bind:x1="priceOffset"
              x2="96%" />
      </svg>
    </div>
  </div>
  <div class="candle-details"
       v-if="detailPane">
    <div class="detail-container">
      <div class="detail-header">
        Candle Details
      </div>
      <div class="detail-pane">
        <div>
          <span>Open: {{currentCandle.open}}</span>
          <span>Close: {{currentCandle.close}}</span>
        </div>
        <div>
          <span>High: {{currentCandle.high}}</span>
          <span>Low: {{currentCandle.low}}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'candle-chart',
  props: {
    candles: {
      type: Array,
      default () {
        return []
      }
    },
    height: {
      type: Number,
      default: 500
    },
    width: {
      type: Number,
      default: 100
    },
    detailPane: Boolean,
    priceOffset: {
      type: Number,
      default: 50
    },
    chartPadding: {
      type: Number,
      default: 40
    },
    forceRange: {
      type: Array
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
      default: 70
    }
  },
  data() {
    return {
      candleChart: {
        x: 0,
        width: 0,
        totalWidth: 0
      },
      candleNum: 0,
      currentCandle: {
        open: null,
        close: null,
        high: null,
        low: null
      }
    }
  },
  computed: {
    priceRange() {
      if ( this.forceRange && this.forceRange.length > 0 ) {
        return this.forceRange
      } else {
        const priceValues = [].concat( ...this.candles.map( item => [ item.high, item.low ] ) )
        return [ Math.min( ...priceValues ), Math.max( ...priceValues ) ]
      }
    },
    priceTick() {
      return ( this.priceRange[ 1 ] - this.priceRange[ 0 ] ) / this.priceDisplay
    },
    prices() {
      console.log( this.priceRange )
      console.log( [ this.priceRange[ 0 ], ...Array( this.priceDisplay ) ].map( ( _, ix ) => this.priceTick * ( ix + 1 ) ) )
      return [ ...Array( this.priceDisplay + 1 ) ].map( ( _, ix ) => ix === 0 ? this.priceRange[ 0 ] : this.priceRange[ 0 ] + ( this.priceTick * ( ix ) ) )
    },
    chartOffset() {
      return this.chartPadding / 2
    },
    chartWidth() {
      return `${this.width}%`
    },
    chartHeight() {
      return `${this.height}px`
    },
    priceLength() {
      return this.prices.length
    },
    priceReverse() {
      console.log( this.prices );
      return this.prices.slice()
        .sort( ( a, b ) => b - a )
    },
    priceLineHeight() {
      return this.height / this.priceLength
    },
    pricePosition() {
      return val => this.chartOffset + this.height - ( ( val - this.priceRange[ 0 ] ) / ( this.priceRange[ 1 ] - this.priceRange[ 0 ] ) * this.height )
    },
    localPrices() {
      return this.prices && this.prices.length > 0 ? this.prices : this.calcPrices( this.candles )
    },
    chartCandles() {
      const candlesLength = this.candles.length
      const priceRange = this.priceRange[ 1 ] - this.priceRange[ 0 ]
      return this.candles.reduce( ( memo, item, ix ) => {
        const color = item.close >= item.open ? 'green' : 'red'
        const rectTop = color === 'green' ? item.close : item.open
        memo.push( {
          line: {
            x1: this.priceOffset + this.candleSpacing * ( ix + 1 ),
            x2: this.priceOffset + this.candleSpacing * ( ix + 1 ),
            y1: this.pricePosition( item.high ),
            y2: this.pricePosition( item.low )
          },
          rect: {
            x: this.priceOffset + this.candleSpacing * ( ix + 1 ) - this.candleWidth / 2,
            y: this.pricePosition( rectTop ),
            height: this.pricePosition( color === 'green' ? item.open : item.close ) - this.pricePosition( rectTop ),
            width: this.candleWidth,
            color: color
          }
        } )
        return memo;
      }, [] )
    }
  },
  methods: {
    init() {
      console.log( this.candleSpacing )
      this.candleChart.totalWidth = ( this.candles.length * this.candleSpacing ) + ( 100 + this.priceWidth )
      this.currentCandle = this.candles[ 0 ]
      this.adjustChart()
      this.handleResize()
    },
    handleResize() {
      this.candleChart.width = this.$refs.chart_canvas.clientWidth - this.priceWidth
    },
    adjustChart() {
      if ( this.candleChart.totalWidth > this.candleChart.width ) {
        const increment = ( this.candleChart.totalWidth - this.candleChart.width ) / this.candles.length
        this.candleChart.x = this.candleNum * increment

        for ( const ix in this.$refs[ 'candlebody' ] ) {
          this.$refs[ 'candlebody' ][ ix ].style.strokeWidth = 0
        }
        this.$refs[ 'candlebody' ][ this.candleNum ].style.strokeWidth = 4
        this.currentCandle = this.candles[ this.candleNum ]
      }
    },
    calcPrices( prices ) {
      return prices.reduce( ( memo, item ) => {
        const values = Object.values( item )
        memo[ 0 ] = Math.min( ...values, memo[ 0 ] )
        memo[ 1 ] = Math.max( ...values, memo[ 1 ] )
        return memo
      }, [] )
    },
    displayPrice( val ) {
      return parseFloat( Math.round( val * 100 ) / 100 )
        .toFixed( 2 )
    }
  },
  mounted: function () {
    window.addEventListener( 'resize', this.handleResize )
    this.init()
  },
  beforeDestroy: function () {
    window.removeEventListener( 'resize', this.handleResize )
  }
}
</script>


<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

// -----------------------------------------------------
// Candle Chart
// -----------------------------------------------------

.candle-chart {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    @media(min-width: 992px) {
        flex-direction: row;
    }

    .chart-wrapper {
        width: 100%;
        margin-right: 30px;
        margin-bottom: 60px;

        @media(min-width: 992px) {
            width: 70%;
            margin-bottom: 0;
        }

        h2 {
            width: calc(100% - 80px);
            text-align: center;
            text-transform: uppercase;
            font-size: 1.8rem;
            margin-bottom: 20px;
        }

        .chart-info {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background: lighten($dark-blue, 7%);
            font-size: 1rem;
            font-weight: 600;
            border-radius: 40px;
            padding: 10px 5%;
            text-transform: uppercase;
            width: 100%;
            margin-bottom: 15px;

            @media(min-width: 768px) {
                padding: 10px 10%;
            }
        }

        .chart-canvas {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;

            .vue-slider {
                margin-top: 10px;

                .vue-slider-dot-handle {
                    width: 40px;
                    height: 40px;
                    position: relative;
                    top: -13px;
                    text-align: center;
                    line-height: 40px;
                    font-size: 36px;
                    transform: rotate(90deg);

                    &:before {
                        content: "\e90f";
                        font-family: "custom-icons";
                        color: $dark-blue;
                    }
                }

                .vue-slider-rail {
                    height: 12px;
                    background: lighten($dark-blue, 4%);
                }
                .vue-slider-process {
                    background: none;
                }
            }

        }

    }

    .candle-details {
        width: 100%;
        margin-top: 0;

        @media(min-width: 992px) {
            width: calc(30% - 30px);
        }

        .detail-container {
            width: 100%;
            color: #fff;

            .detail-header {
                padding: 15px 20px;
                background: lighten($dark-blue, 7%);
                font-size: 1.4rem;
                font-weight: 600;
            }

            .detail-pane {
                padding: 15px 20px;
                background: lighten($dark-blue, 3%);
                min-height: 80px;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                padding: 15px 20px;

                div {
                    width: calc(50% - 7px);
                }

                div:first-child {
                    margin-right: 14px;
                }

                span {
                    display: block;
                    font-size: 1rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }
            }
        }
    }

    &.no-pane {
        .chart-wrapper {
            width: 100%;
        }

        .candle-details {
            margin-top: 80px;
        }
    }
}

.chart-num {
    font: 0.875rem pt-sans-pro;
    font-weight: 600;
}

.candle-green,
.candle-red {
    stroke-width: 0;
}

.candle-green {
    fill: $green;
}

.candle-red {
    fill: $red;
}

.candle-wick {
    stroke-width: 2;
}

.chart-pline {
    //stroke-width: 1;
    //stroke-dasharray: 5;

    &:last-child {
        stroke-dasharray: 0;
    }
}

// Dark/Light Theme Styles -----------------------------

.dark {

    .chart-bg {
        fill: $dark-group-bg;
    }
    .chart-num {
        fill: #ddd;
    }
    .chart-pline {
        //stroke: #888;
    }

    .candle-wick {
        stroke: $gray;
    }

    .candle-green,
    .candle-red {
        stroke: #ffffff;
    }
}

.light {
    h3 {
        color: $light-text-color;
    }

    .candle-chart {

        .chart-wrapper {

            .chart-info {
                background: rgba(0,0,0, 0.06);
                color: darken($light-text-color, 10%);
            }

            .chart-canvas {
                .vue-slider {
                    .vue-slider-dot-handle {
                        background: $light-header-color;
                        box-shadow: none;
                        &:before {
                            color: #fff;
                        }
                    }
                    .vue-slider-rail {
                        background: rgba(0,0,0,0.08);
                    }
                }

            }
        }

        .candle-details {

            .detail-container {

                .detail-header {
                    background: rgba(0,0,0,0.06);
                    color: $light-header-color;
                }

                .detail-pane {
                    background: rgba(0,0,0,0.03);
                    color: darken($light-text-color, 10%);
                }
            }
        }

        .chart-bg {
            fill: $light-group-bg;
        }
        .chart-num {
            fill: #333;
        }
        .chart-pline {
            //stroke: #999;
        }

        .candle-wick {
            stroke: #444;
        }

        .candle-green,
        .candle-red {
            stroke: $light-header-color;
        }

    }
}
</style>
