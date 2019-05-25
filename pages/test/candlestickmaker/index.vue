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
                    v-bind:force-range="[0,40]"
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
      candles: [
        {open: 3, close: 4.75, high: 4.75, low: 3},
        {open: 4.75, close: 5.86, high: 5.86, low: 4.75},
        {open: 5.86, close: 7.54, high: 7.54, low: 5.86},
        {open: 7.54, close: 10.14, high: 10.14, low: 7.54},
        {open: 10.14, close: 12.41, high: 12.41, low: 10.14},
        {open: 12.41, close: 12.42, high: 12.42, low: 12.41},
        {open: 12.42, close: 13.67, high: 13.67, low: 12.42},
        {open: 13.67, close: 16.86, high: 16.86, low: 13.67},
        {open: 16.86, close: 16.95, high: 16.95, low: 16.86},
        {open: 16.95, close: 18.72, high: 18.72, low: 16.95},
        {open: 18.72, close: 18.82, high: 18.82, low: 18.72},
        {open: 18.82, close: 20.44, high: 20.44, low: 18.82},
        {open: 20.44, close: 23.52, high: 23.52, low: 20.44},
        {open: 23.52, close: 23.66, high: 23.66, low: 23.52},
        {open: 23.66, close: 26.01, high: 26.01, low: 23.66},
        {open: 26.01, close: 26.04, high: 26.04, low: 26.01},
        {open: 26.04, close: 26.51, high: 26.51, low: 26.04},
        {open: 26.51, close: 27.47, high: 27.47, low: 26.51},
        {open: 27.47, close: 28.53, high: 28.53, low: 27.47},
        {open: 28.53, close: 29, high: 29, low: 28.53},
        {open: 29, close: 28.5, high: 29, low: 28.5},
        {open: 28.5, close: 25.77, high: 28.5, low: 25.77},
        {open: 25.77, close: 22.23, high: 25.77, low: 22.23},
        {open: 22.23, close: 20.32, high: 22.23, low: 20.32},
        {open: 20.32, close: 16.45, high: 20.32, low: 16.45},
        {open: 16.45, close: 14.35, high: 16.45, low: 14.35},
        {open: 14.35, close: 13.76, high: 14.35, low: 13.76},
        {open: 13.76, close: 15.86, high: 15.86, low: 13.76},
        {open: 15.86, close: 17.06, high: 17.06, low: 15.86},
        {open: 17.06, close: 17.18, high: 17.18, low: 17.06},
        {open: 17.18, close: 16.91, high: 17.18, low: 16.91},
        {open: 16.91, close: 16.39, high: 16.91, low: 16.39},
        {open: 16.39, close: 15.5, high: 16.39, low: 15.5},
        {open: 15.5, close: 14.15, high: 15.5, low: 14.15},
        {open: 14.15, close: 10.02, high: 14.15, low: 10.02},
        {open: 10.02, close: 8.77, high: 10.02, low: 8.77},
        {open: 8.77, close: 8.31, high: 8.77, low: 8.31},
        {open: 8.31, close: 8.25, high: 8.31, low: 8.25},
        {open: 8.25, close: 5.22, high: 8.25, low: 5.22},
        {open: 5.22, close: 3.26, high: 5.22, low: 3.26},
      ]
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
    changeData() {
      this.candles = [
        {
          open: 6,
          close: 2,
          high: 7,
          low: 1
        },
        {
          open: 4,
          close: 5,
          high: 13,
          low: 2
        },
        {
          open: 1,
          close: 2,
          high: 8,
          low: 1
        }
      ]
    },
    calcCandleData() {
      var priceRange = [3, 29]
      var numOfCandles = this.candleCount
      var pointData = this.pad
        .toJSON()
        .strokes[0]
        .points

      if (pointData) {
        var invertYCanvas = y => 1 - y
        var decimals2 = val => Math.floor(val * 100)/100
        var candles = Math.min(numOfCandles, pointData.length)

        var ranges = pointData.reduce((memo, item) => {
          memo.x[0] = Math.min(memo.x[0], item.x)
          memo.x[1] = Math.max(memo.x[1], item.x)
          memo.y[0] = Math.min(memo.y[0], invertYCanvas(item.y))
          memo.y[1] = Math.max(memo.y[1], invertYCanvas(item.y))
          return memo
        }, {x: [1, 0], y: [1, 0]})

        var xDiff = ranges.x[1] - ranges.x[0]
        var yDiff = ranges.y[1] - ranges.y[0]
        var priceDiff = priceRange[1] - priceRange[0]

        var convertYToPrice = y => priceRange[0] + decimals2(priceDiff * ((invertYCanvas(y) - ranges.y[0])/yDiff))

        //(canvasHeight - y)



        var xValues = Array(numOfCandles)
          .fill()
          .map((item, ix) => ranges.x[0] + (xDiff/candles*ix))

        var lineData = pointData.reduce((memo, item, ix, arr) => {
          const nextInArr = arr[ix + 1] || arr[ix]
          memo.push({
            start: {x: item.x, y: item.y},
            end: {x: nextInArr.x, y: nextInArr.y}
          })
          return memo
        }, []);

        var reducedLines = lineData.reduce((memo, item) => {
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


        var candleData = xValues.reduce((memo, item, ix, arr) => {
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
