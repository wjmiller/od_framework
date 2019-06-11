<template>
  <div class="candle-generator">
    <b-row>
      <b-col>
        <p class="instructions">
          <slot name="instructions"></slot>
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="4">
        <div class="sketchpad-container">
          <div class="sketchpad"
               ref="sketchpad"></div>
        </div>
        <div class="sketchpad-btns">
          <b-button-group>
            <b-button v-on:click="clearPad">Clear</b-button>
            <b-button v-on:click="calcCandleData">Generate</b-button>
          </b-button-group>
        </div>
      </b-col>
      <b-col cols="5" class="generator">
          <candle-chart v-bind:candles="candles"
                        v-bind:height="260"
                        v-bind:force-range="priceRange"
                        v-bind:price-display="5"
                        v-bind:price-width="60"
                        v-bind:candle-width="12"
                        v-bind:candle-spacing="18"
                        v-bind:timeline="false"
                        v-bind:detail-pane="false"
                        v-bind:candle-highlight="false">
          </candle-chart>
      </b-col>
      <b-col cols="3">
        <slot name="feedback"></slot>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import CandleChart from '~/components/activities/candle_chart'
import AppData from '~/assets/data/app_data.js'

if ( process.client ) {
  var Sketchpad = require( '~/mixins/sketchpad' )
}

import {
  mapGetters
} from 'vuex'

export default {
  name: 'draw-pattern',
  props: {
    candleCount: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      wickVariable: 0,
      labelOption: 0,
      candles: [],
      priceRange: [ 10, 20 ],
      labelStartValue: 0,
      relativeToHeight: true
    }
  },
  methods: {
    pushCandle() {
      this.candles.push( {
        open: 4,
        close: 2,
        high: 7,
        low: 1
      } )
    },
    strokeConverter( pointData ) {
      const numOfCandles = this.candleCount

      if ( pointData.length > 0 ) {
        const lineData = pointData
          .reduce( ( memo, item, ix, arr ) => {
            if ( ix === 0 ) {
              memo.last = {
                x: item.x,
                y: item.y
              }
            } else if ( item.x >= memo.last.x ) {
              memo.data.push( {
                start: {
                  x: memo.last.x,
                  y: memo.last.y
                },
                end: {
                  x: item.x,
                  y: item.y
                }
              } )
              memo.last = {
                x: item.x,
                y: item.y
              }
            }
            return memo
          }, {
            data: []
          } );

        const invertYCanvas = y => 1 - y
        const decimals2 = val => Math.floor( val * 100 ) / 100
        const candles = Math.min( numOfCandles, lineData.data.length )

        const ranges = lineData.data.reduce( ( memo, item ) => {
          memo.x[ 0 ] = Math.min( memo.x[ 0 ], item.start.x, item.end.x )
          memo.x[ 1 ] = Math.max( memo.x[ 1 ], item.start.x, item.end.x )
          if (!this.relativeToHeight) {
            memo.y[ 0 ] = Math.min( memo.y[ 0 ], invertYCanvas( item.start.y ), invertYCanvas( item.end.y ) )
            memo.y[ 1 ] = Math.max( memo.y[ 1 ], invertYCanvas( item.start.y ), invertYCanvas( item.end.y ) )
          }
          return memo
        }, {
          x: [ 1, 0 ],
          y: !this.relativeToHeight ? [ 1, 0 ] : [ 0, 1 ]
        } )

        const xDiff = ranges.x[ 1 ] - ranges.x[ 0 ]
        const yDiff = ranges.y[ 1 ] - ranges.y[ 0 ]
        const priceDiff = this.priceRange[ 1 ] - this.priceRange[ 0 ]

        const convertYToPrice = y => this.priceRange[ 0 ] + decimals2( priceDiff * ( ( invertYCanvas( y ) - ranges.y[ 0 ] ) / yDiff ) )

        //(canvasHeight - y)



        const xValues = Array( candles )
          .fill()
          .map( ( item, ix ) => ranges.x[ 0 ] + ( xDiff / candles * ix ) )

        const reducedLines = lineData.data.reduce( ( memo, item ) => {
          const inMemo = memo.find( m => m.start.x === item.start.x )
          if ( inMemo ) {
            inMemo.end = {
              x: item.end.x,
              y: convertYToPrice( item.end.y )
            }
          } else {
            memo.push( {
              start: {
                x: item.start.x,
                y: convertYToPrice( item.start.y )
              },
              end: {
                x: item.end.x,
                y: convertYToPrice( item.end.y )
              }
            } )
          }
          return memo
        }, [] )

        xValues.forEach( item => {
          const inReduced = reducedLines.find( rl => rl.start.x === item )
          if ( !inReduced && reducedLines.length > 0 ) {
            const itemToSplit = reducedLines.find( rl => rl.start.x < item && rl.end.x >= item )
            //if (!itemToSplit) {console.log(ranges, lineData, reducedLines, xValues, item, xDiff, xDiff/numOfCandles, candles)}
            const endValues = {
              x: itemToSplit.end.x,
              y: itemToSplit.end.y
            }
            const splitValue = {
              x: item,
              y: itemToSplit.start.y + ( itemToSplit.end.x - item ) / ( itemToSplit.end.x - itemToSplit.start.x ) * ( itemToSplit.end.y - itemToSplit.start.y )
            }
            itemToSplit.end = splitValue
            reducedLines.push( {
              start: splitValue,
              end: endValues
            } )
          }
        } );

        reducedLines.sort( ( a, b ) => a.start.x - b.start.x )


        const candleData = xValues.reduce( ( memo, item, ix, arr ) => {
          const highValue = arr[ ix + 1 ] || ( ranges.x[ 1 ] + 1 )
          const lines = reducedLines.filter( rl => rl.start.x >= item && rl.start.x < highValue )
          const lineEnds = lines.map( l => l.end.y )
          memo.push( {
            open: decimals2( lines[ 0 ].start.y ),
            close: decimals2( lines[ lines.length - 1 ].end.y ),
            high: decimals2( Math.max( ...lineEnds, lines[ 0 ].start.y ) ),
            low: decimals2( Math.min( ...lineEnds, lines[ 0 ].start.y ) ),
          } )
          return memo
        }, [] )

        if ( this.wickVariable > 0 ) {
          candleData.forEach( candle => {
            const candleDiff = ( candle.high - candle.low )
            const candlePricePercent = 1 - candleDiff / priceDiff
            const candleWickSize = this.wickVariable / 20
            const wickHigh = decimals2( candle.high + candlePricePercent * Math.random() * candleWickSize )
            const wickLow = decimals2( candle.low - candlePricePercent * Math.random() * candleWickSize )
            if ( Math.random() >= 0.5 ) {
              candle.high = wickHigh
            }
            if ( Math.random() >= 0.5 ) {
              candle.low = wickLow
            }
          } )
        }
        return candleData
      }

    },
    calcCandleData() {
      const padData = this.pad.toJSON()

      if ( padData && padData.strokes && padData.strokes.length > 0 ) {
        const candleData = padData.strokes.reduce( ( memo, data ) => {
          const convertedData = this.strokeConverter( data.points )
          memo = memo.concat( convertedData )
          return memo
        }, [] )



        if ( candleData.length > 0 ) {
          this.candles = this.calcLabels(candleData)
        }
      }

    },
    clearPad() {
      this.pad.clear()
    },
    calcLabels(candleData) {
      const labelType = this.candleLabelType.split(/(\d+)/)
      const startValue = this.labelStartValue
      const mainInterval = labelType[1] ? parseInt(labelType[1], 10) : 1
      const intervalType = labelType[2] || 'generic'
      const hours = [10, 11, 12, 1, 2, 3, 4]
      const hoursLength = hours.length

      const conversions = {
        generic: val => `${val}`.padStart(2, "0"),
        m: val => `${hours[Math.floor(val/60) % hoursLength]}`.padStart(2, "0") + `:` + `${val % 60}`.padStart(2, "0"),
        h: val => `${hours[val % hoursLength]}`.padStart(2, "0") + `:00`,
        d: val => {
          const date = new Date(new Date().getFullYear(), 0, val + 1)
          return `${date.getMonth() + 1}/${date.getDate() + 1}`
        }
      }

      candleData.forEach((item, ix) => item.label = conversions[intervalType](intervalType === 'd' ? startValue + ix + (Math.floor(ix/5) * 2) : startValue + (ix * mainInterval)))

      return candleData
    }
  },
  computed: {
    ...mapGetters( [ 'getUserPrefs' ] ),
    theme() {
      return this.getUserPrefs.theme_dark ? 'dark' : 'light'
    },
    padColor() {
      return this.theme === 'dark' ? '#FFFFFF' : '#112163'
    },
    candleJSON() {
      return JSON.stringify( this.candles )
    },
    candleLabelType() {
      return ["generic", "1m", "5m", "10m", "15m", "30m", "1h", "1d"][this.labelOption]
    }
  },
  components: {
    CandleChart
  },
  watch: {
    candleCount() {
      this.calcCandleData()
    },
    wickVariable() {
      this.calcCandleData()
    },
    padColor() {
      const data = this.pad.toJSON()
      this.pad.clear()
      data.strokes.forEach( stroke => stroke.color = this.padColor )
      this.pad.setLineColor( this.padColor )
      this.pad.loadJSON( data )
    },
    candles() {
      this.$emit('candles-updated', this.candles)
    }
  },
  mounted() {
    var el = this.$refs.sketchpad;
    this.pad = new Sketchpad(
      el, {
        aspectRatio: '1',
        line: {
          color: this.padColor,
          size: 5
        }
      } )
    window.onresize = e => this.pad.resize( el.offsetWidth )
  }
}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

.candle-generator {

    .sketchpad-container {
        width: 100%;
        //height: 345px;
        margin-bottom: 30px;

        .sketchpad {
            width: 100% !important;
            //height: 345px !important;
            border-radius: 8px;
            overflow: hidden;
        }
    }

    .sketchpad-btns {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        margin-bottom: 30px;

        .btn-group {
            width: 240px;
            align-self: center;
        }
    }

    .generator {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;

        .candle-chart {
            width: 100%;
            margin-bottom: 30px;

            @media(min-width: 992px) {
                width: 70%;
                margin-right: 25px;
                margin-bottom: 0;
            }

        }

        .chart-controls {
            width: 100%;

            @media(min-width: 992px) {
                width: calc(30% - 25px);
            }

            > div {
                margin-bottom: 35px;

                label {
                    display: block;
                    width: 100%;
                    font-weight: 600;
                    font-size: 1.1rem;
                    text-transform: uppercase;
                    text-align: center;
                    margin-bottom: 15px;
                }

                .vue-slider {
                    width: calc(100% - 20px) !important;
                    margin: 0 auto;

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

            .form-control {
                color: #fff;
                background: lighten($dark-blue, 3%);
                border: 1px solid lighten($dark-blue, 15%);
            }
        }
    }

}

.export-header {
    text-align: center;
    margin-top: 30px;
    text-transform: uppercase;
    font-size: 1.3rem;
}

.export-json {
    width: 100%;
    border-radius: 8px;
}

.dark {
    .candle-generator {
        .sketchpad {
            border: 1px solid lighten($dark-blue, 17%);
        }
    }

    .export-json {
        background: lighten($dark-blue, 3%);
        border: 1px solid lighten($dark-blue, 17%);
        color: #fff;
    }
}

.light {
    .candle-generator {
        .sketchpad {
            border: 1px solid #bbbbbb;
        }

        .generator {
            .chart-controls {
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

                .form-control {
                    color: $light-text-color;
                    background: #ffffff;
                    border: 1px solid #bbbbbb;
                }
            }

        }
    }

    .export-json {
        background: #fff;
        border: 1px solid #bbbbbb;
        color: $light-text-color;
    }
}

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

.instructions {
    font-size: 1.1rem;
    margin-bottom: 15px;
    text-align: center;
    font-weight: 600;
}
</style>
