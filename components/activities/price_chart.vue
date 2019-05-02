<!-- Template -->
<template lang="html">
<div class="price-chart row">
  <div class="col-sm-12">
    <h3>Price Chart</h3>
  </div>
  <div class="col-sm-12">
    <!-- Price Chart -->
    <svg id="pchart"
         width="100%"
         v-bind:height="88 + ((pcdata.prices.length - 1) * 40)">
      <g>
        <!-- Chart Background -->
        <rect width="100%"
              height="100%"
              class="chart-bg"></rect>
        <!-- Price Axis Label -->
        <text x="0"
              y="15"
              class="chart-num">Price</text>
        <!-- Price Values -->
        <text v-for="(price,index) in pcdata.prices"
              v-bind:key="'price-' + index"
              x="0"
              v-bind:y="50 + (40 * index)"
              class="chart-num">{{price}}</text>
        <!-- Price Lines -->
        <g>
          <line v-for="(price,index) in pcdata.prices"
                v-bind:key="'pline-' + index"
                x1="50"
                v-bind:y1="50 + (40 * index)"
                x2="100%"
                v-bind:y2="50 + (40 * index)"
                class="chart-pline" />
        </g>
        <!-- Time Interval Lines -->
        <line v-for="(time,index) in pcdata.timeIntervals"
              v-bind:key="'tline-' + index"
              v-bind:x1="70 + (40 * index)"
              v-bind:y1="58 + (40 * (pcdata.prices.length - 1))"
              v-bind:x2="70 + (40 * index)"
              v-bind:y2="50 + (40 * (pcdata.prices.length - 1))"
              class="chart-tline" />
        <!-- Time Interval Values -->
        <text v-for="(time,index) in pcdata.timeIntervals"
              v-bind:key="'time-' + index"
              v-bind:x="66 + (40 * index)"
              v-bind:y="74 + (40 * (pcdata.prices.length - 1))"
              class="chart-time">{{time}}</text>
        <!-- Time Axis Label -->
        <text v-bind:x="113 + (40 * (pcdata.timeIntervals.length - 1))"
              v-bind:y="74 + (40 * (pcdata.prices.length - 1))"
              class="chart-num">{{pcdata.timeLabel}}</text>
        <!-- Chart Lines -->
        <g>
          <line v-for="(point,index) in pricePointData.lines"
                v-bind:key="'ppline-' + index"
                v-bind:x1="point[0]"
                v-bind:y1="point[1]"
                v-bind:x2="point[2]"
                v-bind:y2="point[3]"
                class="chart-ppline" />
        </g>
        <!-- Chart Points -->
        <circle v-for="(point,index) in pricePointData.points"
                v-bind:key="'ppoint-' + index"
                v-bind:cx="point[0]"
                v-bind:cy="point[1]"
                r="5"
                class="price-point"></circle>
      </g>
    </svg>
  </div>
</div>
</template>


<script>
export default {
  name: 'price-chart',
  props: [ 'pcdata' ],
  data() {
    return {
      pricePointData: [],
      chartTick: 40,
      pointMargin: 70,
      lineMargin: 50,
      priceBase: 10
    }
  },
  created() {
    this.pricePointData = this.pcdata.pricePoints.reduce( ( memo, price, ix, arr ) => {
      const px = this.pointMargin + ( ix * this.chartTick );
      const py = this.lineMargin + ( ( this.priceBase - price ) * this.chartTick / 2 );
      memo.points.push( [ px, py ] );
      if ( arr[ ix + 1 ] ) {
        memo.lines.push( [
          px,
          py,
          this.pointMargin + ( ( ix + 1 ) * this.chartTick ),
          this.lineMargin + ( ( this.priceBase - arr[ ix + 1 ] ) * this.chartTick / 2 )
        ] );
      }
      return memo;
    }, {
      lines: [],
      points: []
    } );
  }
}
</script>


<style lang="scss" scoped>
//------------------------------------------------------
// Import Variables
//------------------------------------------------------

@import '~assets/scss/variables.scss';

//------------------------------------------------------
// Price Chart
//------------------------------------------------------

.price-chart {
    margin-bottom: 15px;

    h3 {
        font-size: 1.05rem;
        font-weight: 400;
        text-align: center;
        margin-bottom: 5px;
        border-radius: $border-radius;
    }

    .chart-num {
        font: 0.875rem pt-sans-pro;
    }

    .chart-time {
        font: 813rem pt-sans-pro;
    }

    .chart-pline {
        stroke-width: 1;
        stroke-dasharray: 5;

        &:last-child {
            stroke-dasharray: 0;
        }
    }

    .chart-ppline {
        stroke-width: 3;
    }

    .chart-tline {
        stroke-width: 1;
    }
}

// Dark/Light Theme Styles -----------------------------

.dark {
    .price-chart {
        h3 {
            color: #fff;
        }

        .chart-bg {
            fill: $dark-group-bg;
        }
        .chart-num,
        .chart-time {
            fill: $dark-chart-text;
        }
        .chart-pline,
        .chart-tline {
            stroke: $dark-chart-lines;
        }

        .chart-ppline {
            stroke: $dark-chart-curve;
        }

        .price-point {
            fill: $dark-blue;
            stroke: $dark-chart-points;
            stroke-width: 4;
        }
    }
}

.light {
    .price-chart {
        h3 {
            color: $light-text-color;
        }

        .chart-bg {
            fill: $light-group-bg;
        }
        .chart-num,
        .chart-time {
            fill: $light-chart-text;
        }
        .chart-pline,
        .chart-tline {
            stroke: $light-chart-lines;
        }

        .chart-ppline {
            stroke: $light-chart-curve;
        }

        .price-point {
            fill: #fff;
            stroke: $light-chart-points;
            stroke-width: 4;
        }
    }
}
</style>
