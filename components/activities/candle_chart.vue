<!-- Template -->
<template>
<div class="candle-chart"
     v-bind:class="{'no-pane':!detailPane || (detailPane && detailPosition == 'top')}">
  <div class="chart-wrapper">
    <div class="chart-info"
         v-if="detailPane && (detailPosition == 'top')">
      <span>Open: {{currentCandle.open}}</span>
      <span>Close: {{currentCandle.close}}</span>
      <span>High: {{currentCandle.high}}</span>
      <span>Low: {{currentCandle.low}}</span>
    </div>
    <ul class="chart-key"
        v-if="regions.length > 0">
      <li v-for="region in regions">
        {{region.label}}
        <span class="dot"></span>
      </li>
    </ul>
    <div class="chart"
         ref="chart">
      <div>

        <svg class="chart-candles"
             ref="chart_candles"
             v-bind:viewBox="candleChart.x + ' 0 ' + candleChart.width + ' ' + `${height + chartPadding}`"
             v-bind:width="candleChart.width">
          <!-- Region -->
          <g v-if="regions.length > 0"
             class="chart-regions">
            <rect v-for="region in chartRegions"
                  v-bind:key="region.label"
                  v-bind:ref="region.label"
                  v-bind:x="region.x"
                  v-bind:y="region.y"
                  v-bind:width="region.width"
                  v-bind:height="region.height" />
          </g>

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

          <g v-if="chartLines">

            <!-- Enter Line -->
            <line x1="0"
                  v-bind:x2="priceLineWidth"
                  v-bind:y1="enterLineY"
                  v-bind:y2="enterLineY"
                  class="chart-pline" />

            <g>
              <!-- Enter Label Box -->
              <rect width="46"
                    height="21"
                    v-bind:x="candleChart.x"
                    v-bind:y="enterLineY - 20"
                    class="chart-label-bg"></rect>

              <!-- Enter Label -->
              <text v-bind:x="candleChart.x + 7"
                    v-bind:y="enterLineY - 5"
                    class="chart-label">Enter</text>
            </g>

          </g>

          <g v-if="chartLines">

            <!-- Exit Line -->
            <line v-bind:x1="candleChart.x + 55"
                  v-bind:x2="priceLineWidth"
                  v-bind:y1="exitLineY"
                  v-bind:y2="exitLineY"
                  class="chart-pline" />

            <g>
              <!-- Exit Label Box -->
              <rect width="40"
                    height="21"
                    v-bind:x="candleChart.x + 55"
                    v-bind:y="exitLineY - 20"
                    class="chart-label-bg"></rect>

              <!-- Exit Label -->
              <text v-bind:x="candleChart.x + 62"
                    v-bind:y="exitLineY - 5"
                    class="chart-label">Exit</text>
            </g>

          </g>

          <g v-if="timeline">
            <!-- Timeline Labels -->
            <text v-bind:x="0"
                  v-bind:y="priceLineY + 17"
                  class="chart-tlabel">{{timeLabel}}</text>

            <text v-for="(candle, ix) in totalCandles"
                  v-bind:key="`tlabel-${ix}`"
                  v-if="ix % timeLabelInterval == 0"
                  v-bind:x="(priceOffset + (candleSpacing * (ix + 1))) - (candleWidth / 2)"
                  v-bind:y="priceLineY + 17"
                  class="chart-tlabel">{{candle.label}}</text>

            <!-- Timeline -->
            <line v-bind:x1="0"
                  v-bind:x2="priceLineWidth"
                  v-bind:y1="priceLineY"
                  v-bind:y2="priceLineY"
                  class="chart-tline" />
          </g>

          <!-- Chart  -->
          <rect v-bind:width="chartWidth"
                v-bind:height="`${height + chartPadding}px`"
                class="chart-canvas"></rect>
        </svg>

        <vue-slider v-if="candleChart.totalWidth > candleChart.width"
                    v-model="candleNum"
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
      </svg>
    </div>
  </div>
  <div class="candle-details"
       v-if="detailPane && (detailPosition == 'side')">
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
    totalCandles: {
      type: Array,
      default () {
        return this.candles
      }
    },
    regions: {
      type: Array,
      default () {
        return []
      }
    },
    height: {
      type: Number,
      default: 260
    },
    width: {
      type: Number,
      default: 100
    },
    detailPane: {
      type: Boolean,
      default: false
    },
    detailPosition: {
      type: String,
      default: 'side'
    },
    priceOffset: {
      type: Number,
      default: 50
    },
    chartPadding: {
      type: Number,
      default: 60
    },
    forceRange: {
      type: Array
    },
    timeline: {
      type: Boolean,
      default: false
    },
    timeLabel: {
      type: String
    },
    timeLabelInterval: {
      type: Number
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
      default: 20
    },
    candleSpacing: {
      type: Number,
      default: 40
    },
    chartLines: {
      type: Array
    },
    candleHighlight: {
      type: Boolean,
      default: true
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
      return this.prices.slice()
        .sort( ( a, b ) => b - a )
    },
    priceLineHeight() {
      return this.height / this.priceLength
    },
    priceLineWidth() {
      return this.candleChart.totalWidth > this.candleChart.width ? this.candleChart.totalWidth : this.candleChart.width
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
    },
    chartRegions() {
      return this.regions.map( ( region, ix ) => {
        const regionCandles = [ ...this.chartCandles.slice( region.range[ 0 ], ( region.range[ 1 ] + 1 ) ) ]
        const y1 = Math.min.apply( Math, regionCandles.map( function ( o ) {
          return o.line.y1;
        } ) )
        const y2 = Math.max.apply( Math, regionCandles.map( function ( o ) {
          return o.line.y2;
        } ) )

        return {
          x: this.priceOffset + ( this.chartPadding / 2 ) + ( this.candleSpacing * region.range[ 0 ] ),
          y: y1,
          width: regionCandles.length * this.candleSpacing - ( this.candleSpacing - this.candleWidth ),
          height: y2 - y1,
          label: region.label
        }
      } )
    },
    enterLineY() {
      return this.chartOffset + this.height - ( ( this.chartLines[ 0 ] - this.priceRange[ 0 ] ) / ( this.priceRange[ 1 ] - this.priceRange[ 0 ] ) * this.height )
    },
    exitLineY() {
      return this.chartOffset + this.height - ( ( this.chartLines[ 1 ] - this.priceRange[ 0 ] ) / ( this.priceRange[ 1 ] - this.priceRange[ 0 ] ) * this.height )
    },
    priceLineY() {
      return ( this.chartPadding - 20 ) + this.height - ( ( this.priceRange[ 0 ] ) / ( this.priceRange[ 1 ] - this.priceRange[ 0 ] ) * this.height )
    },
    priceTextY() {
      return ( this.chartPadding - 15 ) + this.height - ( ( this.chartLines[ 1 ] - this.priceRange[ 0 ] ) / ( this.priceRange[ 1 ] - this.priceRange[ 0 ] ) * this.height )
    }
  },
  watch: {
    candles: {
      handler: function ( newValue, oldValue ) {
        if ( newValue.length > oldValue.length ) {
          this.candleNum = this.candles.length - 1
          this.init( this.candles.length - 1 )
        } else {
          this.candleNum = 0
          this.init( 0 )
          this.candleChart.x = 0
        }
      },
      deep: true
    }
  },
  methods: {
    init( candleIndex ) {
      if ( this.candles.length > 0 ) {
        this.$emit( 'candle-change', candleIndex )
        this.candleChart.totalWidth = ( this.candles.length * this.candleSpacing ) + ( 100 + this.priceWidth )
        this.currentCandle = this.candles[ candleIndex ]
        this.adjustChart()
      } else {
        this.$emit( 'candle-change', 0 )
        this.candleChart.totalWidth = this.candleChart.width
      }
      this.handleResize()

    },
    handleResize() {
      this.candleChart.width = this.$refs.chart.clientWidth - this.priceWidth
    },
    adjustChart() {
      if ( this.candleChart.totalWidth > this.candleChart.width ) {
        const increment = ( this.candleChart.totalWidth - this.candleChart.width ) / this.candles.length
        this.candleChart.x = this.candleNum * increment

        if ( this.candleHighlight ) {
          for ( const ix in this.$refs[ 'candlebody' ] ) {
            this.$refs[ 'candlebody' ][ ix ].style.strokeWidth = 0
          }
          this.$refs[ 'candlebody' ][ this.candleNum ].style.strokeWidth = 4
          this.currentCandle = this.candles[ this.candleNum ]
        }


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
    this.init( 0 )
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
        margin-bottom: 50px;

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
            background: lighten($dark-blue, 3%);
            border: 1px solid lighten($dark-blue, 15%);
            font-size: 1rem;
            font-weight: 600;
            padding: 10px 5%;
            text-transform: uppercase;
            width: 100%;
            margin-bottom: 15px;

            @media(min-width: 768px) {
                padding: 10px 10%;
            }
        }

        .chart-key {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            flex-wrap: wrap;
            list-style-type: none;
            margin-bottom: 0;
            padding: 0;

            li {
                margin-right: 25px;

                span.dot {
                    margin-left: 3px;
                    width: 10px;
                    height: 10px;
                    top: 2px;
                }
            }
        }

        .chart {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;

            .chart-regions {

                rect {
                    stroke-width: 1;

                    &:nth-child(1) {
                        fill: rgba(255,19,197, 0.2);
                        stroke: rgb(255,19,197);
                    }
                    &:nth-child(2) {
                        fill: rgba(255,210,0, 0.2);
                        stroke: rgb(255,210,0);
                    }
                    &:nth-child(3) {
                        fill: rgba(77,189,255, 0.2);
                        stroke: rgb(77,189,255);
                    }
                    &:nth-child(4) {
                        fill: rgba(255,107,13, 0.2);
                        stroke: rgb(255,107,13);
                    }
                    &:nth-child(5) {
                        fill: rgba(176,89,235, 0.2);
                        stroke: rgb(176,89,235);
                    }
                    &:nth-child(6) {
                        fill: rgba(11,217,145, 0.2);
                        stroke: rgb(11,217,145);
                    }
                    &:nth-child(7) {
                        fill: rgba(10,141,255, 0.2);
                        stroke: rgb(10,141,255);
                    }
                }
            }

            .vue-slider {
                margin-top: 25px;

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
                    background: lighten($dark-blue, 3%);
                    border: 1px solid lighten($dark-blue, 15%);
                    border-radius: 0;
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
            border: 1px solid lighten($dark-blue, 15%);

            .detail-header {
                padding: 15px 20px;
                background: lighten($dark-blue, 7%);
                border-bottom: 1px solid lighten($dark-blue, 15%);
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

.chart-canvas {
    fill: rgba(255,255,255,0);
}

.chart-label,
.chart-num,
.chart-tlabel {
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
    stroke-width: 1;
    stroke-dasharray: 5;

    &:last-child {
        //stroke-dasharray: 0;
    }
}

.chart-tline {
    stroke-width: 1;
}

// Dark/Light Theme Styles -----------------------------

.dark {

    .chart {
        .chart-regions {}
    }

    .chart-num,
    .chart-tlabel {
        fill: #ddd;
    }

    .chart-label {
        fill: $dark-blue;
    }

    .chart-label-bg {
        fill: #ddd;
    }

    .chart-pline {
        stroke: rgba(255,227,44, 0.6); //rgba(232,116,248, 0.8); rgba(255,227,44, 0.6);
    }

    .chart-tline {
        stroke: rgba(255,255,255,0.2);
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
                background: #fcfcfc;
                border: 1px solid #bbbbbb;
                color: darken($light-text-color, 10%);
            }

            .chart {
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

        .candle-details {

            .detail-container {
                border: 1px solid #bbbbbb;

                .detail-header {
                    background: rgba(0,0,0,0.03);
                    border-bottom: 1px solid #bbbbbb;
                    color: $light-header-color;
                }

                .detail-pane {
                    background: #fcfcfc; //rgba(0,0,0,0.03);
                    color: darken($light-text-color, 10%);
                }
            }
        }

        .chart-num,
        .chart-tlabel {
            fill: $light-header-color;
        }

        .chart-label {
            fill: #fff;
        }

        .chart-label-bg {
            fill: $light-header-color;
        }

        .chart-pline {
            stroke: $light-header-color;
        }

        .chart-tline {
            stroke: rgba(0,0,0,0.3);
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
