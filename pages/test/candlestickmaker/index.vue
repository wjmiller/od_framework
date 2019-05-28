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
                    v-bind:detail-position="'side'">
      </candle-chart>
    </b-col>
  </b-row>
  <b-row>
    <b-col cols="9">
      <div ref="sketchpad" width="600" height="400"></div>
    </b-col>
    <b-col cols="3">
      <b-button-group>
      <b-button v-on:click="clearPad">Clear</b-button>
      <b-button v-on:click="calcCandleData">Switch Data</b-button>
    </b-button-group>
    <div>
    <label for="range-1"># of Candles</label>
    <b-form-input id="range-1" v-model.number="candleCount" type="range" min="0" max="100" step="5"></b-form-input>
    <div class="mt-2">Value: {{ candleCount }}</div>
    </div>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import CandleChart from '~/components/activities/candle_chart'
import sketchpad from 'responsive-sketchpad'

export default {
  name: 'lesson',
  data() {
    return {
      candleCount: 30,
      chartLines: [ 20, 30 ],
      candles: [{open: 1, close: 2, high: 3, low: 4}]
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
    calcCandleData() {
      const priceRange = [25, 29]
      const numOfCandles = this.candleCount
      const padData = this.pad.toJSON()

      const pointData = padData && padData.strokes && padData.strokes[0] ? padData.strokes[0].points : []

      if (pointData.length > 0) {
        const invertYCanvas = y => 1 - y
        const decimals2 = val => Math.floor(val * 100)/100
        const candles = Math.min(numOfCandles, pointData.length)

        const ranges = pointData.reduce((memo, item) => {
          memo.x[0] = Math.min(memo.x[0], item.x)
          memo.x[1] = Math.max(memo.x[1], item.x)
          memo.y[0] = Math.min(memo.y[0], invertYCanvas(item.y))
          memo.y[1] = Math.max(memo.y[1], invertYCanvas(item.y))
          return memo
        }, {x: [1, 0], y: [1, 0]})

        const xDiff = ranges.x[1] - ranges.x[0]
        const yDiff = ranges.y[1] - ranges.y[0]
        const priceDiff = priceRange[1] - priceRange[0]

        const convertYToPrice = y => priceRange[0] + decimals2(priceDiff * ((invertYCanvas(y) - ranges.y[0])/yDiff))

        //(canvasHeight - y)



        const xValues = Array(numOfCandles)
          .fill()
          .map((item, ix) => ranges.x[0] + (xDiff/candles*ix))

        const lineData = pointData.reduce((memo, item, ix, arr) => {
          const nextInArr = arr[ix + 1] || arr[ix]
          memo.push({
            start: {x: item.x, y: item.y},
            end: {x: nextInArr.x, y: nextInArr.y}
          })
          return memo
        }, []);

        const reducedLines = lineData.reduce((memo, item) => {
          const inMemo = memo.find(m => m.start.x === item.start.x)
          if (inMemo) {
            inMemo.end = {x: item.end.x, y: convertYToPrice(item.end.y)}
          } else {
            memo.push({start: {x: item.start.x, y: convertYToPrice(item.start.y)}, end: {x: item.end.x, y: convertYToPrice(item.end.y)}})
          }
          return memo
        }, [])


        xValues.forEach(item => {
        	const inReduced = reducedLines.find(rl => rl.start.x === item)
        	if (!inReduced) {
              const itemToSplit = reducedLines.find(rl => rl.start.x < item && rl.end.x > item)
              const endValues = {x: itemToSplit.end.x, y: itemToSplit.end.y}
              const splitValue = {
                x: item,
                y: itemToSplit.start.y + (itemToSplit.end.x - item)/(itemToSplit.end.x - itemToSplit.start.x)*(itemToSplit.end.y - itemToSplit.start.y)
              }
              itemToSplit.end = splitValue
              reducedLines.push({start: splitValue, end: endValues})
            }
        });

        reducedLines.sort((a, b) => a.start.x - b.start.x)


        const candleData = xValues.reduce((memo, item, ix, arr) => {
          const highValue = arr[ix + 1] || (ranges.x[1] + 1)
          const lines = reducedLines.filter(rl => rl.start.x >= item && rl.start.x < highValue)
          const lineEnds = lines.map(l => l.end.y)
          memo.push({
            open: decimals2(lines[0].start.y),
            close: decimals2(lines[lines.length - 1].end.y),
            high: decimals2(Math.max(...lineEnds, lines[0].start.y)),
            low: decimals2(Math.min(...lineEnds, lines[0].start.y)),
          })
          return memo
        }, [])

        if (this.candles.length > 0) {
          this.candles = candleData
        }
      }


    },
    clearPad() {
      this.pad.clear()
    }
  },
  components: {
    CandleChart
  },
  watch: {
    candleCount() {
      this.calcCandleData()
    }
  },
  mounted() {
    var el = this.$refs.sketchpad;
    this.pad = new sketchpad(
    el,
    {
      line: {
          color: '#000000',
          size: 5
      }
    });
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
