<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Candle Chart</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="12">
      <h2 class="chart-header">First Day of Trading (Side Details)</h2>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="12">
      <candle-chart v-bind:candles="candles"
                    v-bind:height="260"
                    v-bind:price-display="5"
                    v-bind:price-width="60"
                    v-bind:candle-width="8"
                    v-bind:candle-spacing="12"
                    v-bind:detail-pane="true"
                    v-bind:candle-highlight="false"
                    v-bind:detail-position="'side'">
      </candle-chart>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="9">
      <div ref="sketchpad"
           width="600"
           height="400"></div>
    </b-col>
    <b-col cols="3">
      <b-button-group>
        <b-button v-on:click="clearPad">Clear</b-button>
        <b-button v-on:click="calcCandleData">Switch Data</b-button>
      </b-button-group>
      <div>
        <label for="range-1"># of Candles</label>
        <b-form-input id="range-1"
                      v-model.number="candleCount"
                      type="range"
                      min="0"
                      max="100"
                      step="5"></b-form-input>
        <div class="mt-2">Value: {{ candleCount }}</div>
      </div>
      <div>
        <label for="range-1">Random Wick Size</label>
        <b-form-input id="range-1"
                      v-model.number="wickVariable"
                      type="range"
                      min="0"
                      max="10"
                      step="1"></b-form-input>
        <div class="mt-2">Value: {{ wickVariable }}</div>
      </div>
      <b-row>
        <b-col cols="6">
          <label for="prince-range-start">Price Start</label>
          <b-form-input type="number"
                        name="price-range-start"
                        v-model.number="priceRange[0]"></b-form-input>
        </b-col>
        <b-col cols="6">
          <label for="prince-range-end">Price End</label>
          <b-form-input type="number"
                        name="price-range-end"
                        v-model.number="priceRange[1]"></b-form-input>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import CandleChart from '~/components/activities/candle_chart'
import sketchpad from 'responsive-sketchpad'
import AppData from '~/assets/data/app_data.js'

import {
  mapGetters
} from 'vuex'

export default {
  name: 'lesson',
  data() {
    return {
      candleCount: 30,
      wickVariable: 1,
      chartLines: [ 20, 30 ],
      candles: [ {
        open: 1,
        close: 2,
        high: 3,
        low: 4
      } ],
      priceRange: [ 10, 20 ]
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
          memo.y[ 0 ] = Math.min( memo.y[ 0 ], invertYCanvas( item.start.y ), invertYCanvas( item.end.y ) )
          memo.y[ 1 ] = Math.max( memo.y[ 1 ], invertYCanvas( item.start.y ), invertYCanvas( item.end.y ) )
          return memo
        }, {
          x: [ 1, 0 ],
          y: [ 1, 0 ]
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

        if ( this.candles.length > 0 && candleData.length > 0 ) {
          this.candles = candleData
        }
      }

    },
    clearPad() {
      this.pad.clear()
    }
  },
  computed: {
    ...mapGetters( [ 'getUserPrefs' ] ),
    theme() {
      return this.getUserPrefs.theme_dark ? 'dark' : 'light'
    },
    padColor() {
      return this.theme === 'dark' ? '#FFFFFF' : '#000000'
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
    }
  },
  mounted() {
    var el = this.$refs.sketchpad;
    this.pad = new sketchpad(
      el, {
        line: {
          color: this.padColor,
          size: 5
        }
      } );
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
</style>
