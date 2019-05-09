<!-- Template -->
<template lang="html">
<svg id="chart"
         v-bind:width="chartWidth"
         v-bind:height="chartHeight"
         v-on:click="checkData">
      <g>
        <!-- Chart Background -->
        <rect width="100%"
              height="100%"
              class="chart-bg"></rect>
        <!-- Price Axis Label -->
        <text x="0"
              y="15"
              class="chart-num">Price</text>
        <!-- Price Labels -->
        <text x="0"
              v-for="(price,index) in priceReverse"
              v-bind:key="'price-' + index"
              v-bind:y="priceOffset + (priceLineHeight * index)"
              class="chart-num">{{price}}</text>
        <!-- Price Lines -->
        <line v-for="(price,index) in prices"
              v-bind:y1="priceOffset + (priceLineHeight * index)"
              v-bind:y2="priceOffset + (priceLineHeight * index)"
              v-bind:key="'line-' + index"
              class="chart-pline"
              v-bind:x1="priceOffset"
              x2="96%" />
      </g>
      <!-- Candlestick -->
      <g
        v-for="(candle, index) in candles"
        v-bind:key="`candle-${index}`">
        <!-- Candle Top Wick -->
        <line v-bind:x1="155 * (index + 1)"
              v-bind:x2="155 * (index + 1)"
              v-bind:y1="candle.high"
              v-bind:y2="candle.low"
              class="candle-wick" />
        <!-- Candle Body -->
        <rect width="60"
              v-bind:x="125 * (index + 1)"
              v-bind:y="candle.open"
              v-bind:height="candle.close"
              v-bind:class="`candle-${candle.close > candle.open ? 'green' : 'red'}`" />
      </g>
    </svg>
  </template>


<script>
export default {
  name: 'candle-chart',
  props: {
    candles: {
      type: Array,
      default() { return [] }
    },
    height: {
      type: Number,
      default: 500
    },
    width: {
      type: Number,
      default: 100
    },
    prices: {
      type: Array,
      default() { return [] }
    },
    priceOffset: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
    }
  },
  computed: {
    chartWidth() { return `${this.width}%` },
    chartHeight() { return `${this.height}px` },
    priceLength() { return this.prices.length },
    priceReverse() { return this.prices.slice().sort((a,b) => b - a) },
    priceLineHeight() { return this.height/this.priceLength }
  },
  methods: {
    checkData() {console.log(this.chartCandles, this.candles)}
  }
}
</script>


<style lang="scss" scoped>
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

// -----------------------------------------------------
// Candle Builder
// -----------------------------------------------------

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
            stroke-dasharray: 0;
        }
    }

    .candle-controls {
        margin: 40px 0 0 5px;
        padding: 18px 10px 8px;
        border-radius: $border-radius;

        @media(min-width: 576px) {
            padding: 7px 10px 0;
        }

        .slidecontainer {
            margin-bottom: 10px;
            width: 100%;

            &:first-child {
                label {
                    margin-top: 0;
                }
            }

            @media(min-width: 768px) {
                margin-bottom: 0;
            }

            label {
                display: block;
                color: #eee;
                margin: 5px 0 10px;
                font-size: 0.95rem;

                @media(min-width: 768px) {
                    font-size: 0.85rem;
                    margin: 5px 0 0;

                }
            }

            .slide {
                -webkit-appearance: none;
                appearance: none;
                width: 100%;
                height: 10px;
                background: #777;
                border-radius: 10px;
                outline: none;

                @media(min-width: 768px) {
                    height: 8px;
                }
            }

            .slide::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 30px;
                height: 30px;
                border-radius: 15px;
                background: #fff;
                cursor: pointer;

                @media(min-width: 576px) {
                    width: 20px;
                    height: 20px;
                    border-radius: 10px;
                }
            }

            .slide::-moz-range-thumb {
                width: 30px;
                height: 30px;
                border-radius: 15px;
                background: #fff;
                cursor: pointer;

                @media(min-width: 576px) {
                    width: 20px;
                    height: 20px;
                    border-radius: 10px;
                }
            }
        }

        .candlecolor {
            margin-bottom: 14px;

            p {
                display: inline-block;
                margin: 3px 0 0;
                font-size: 1rem;
                position: relative;
                top: 5px;

                @media(min-width: 768px) {
                    font-size: 0.85rem;
                    margin: 3px 0 0;
                    top: 0;
                }
            }

            .switch {
                display: inline-block;
                position: relative;
                width: 65px;
                height: 35px;
                margin: 10px 10px 0 0;

                @media(min-width: 576px) {
                    width: 45px;
                    height: 25px;
                }

                input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: $green;
                    -webkit-transition: 0.4s;
                    transition: 0.4s;
                }

                .slider:before {
                    position: absolute;
                    content: "";
                    height: 29px;
                    width: 29px;
                    left: 4px;
                    bottom: 3px;

                    background-color: white;
                    -webkit-transition: 0.4s;
                    transition: 0.4s;

                    @media(min-width: 576px) {
                        height: 17px;
                        width: 17px;
                        left: 4px;
                        bottom: 4px;
                    }
                }

                input:checked + .slider {
                    background-color: $red;
                }

                input:focus + .slider {
                    box-shadow: 0 0 1px $red;
                }

                input:checked + .slider:before {
                    -webkit-transform: translateX(28px);
                    -ms-transform: translateX(28px);
                    transform: translateX(28px);

                    @media(min-width: 576px) {
                        -webkit-transform: translateX(19px);
                        -ms-transform: translateX(19px);
                        transform: translateX(19px);
                    }
                }

                .slider.round {
                    border-radius: 34px;
                }

                .slider.round:before {
                    border-radius: 50%;
                }
            }
        }

        @media(min-width: 576px) {
            margin: 0;

            .slide {
                width: 150px;
            }
        }

    }

// Dark/Light Theme Styles -----------------------------

.dark {
        h3 {
            color: #fff;
        }

        .chart-bg {
            fill: $dark-group-bg;
        }
        .chart-num {
            fill: #ddd;
        }
        .chart-pline {
            stroke: #888;
        }

        .candle-wick {
            stroke: $gray;
        }

        .candle-controls {
            background: $dark-pane-bg;
            border: 1px solid $dark-pane-border;

            .slidecontainer {
                label {
                    color: #eee;
                }

                .slide {
                    background: $dark-slide-bg;
                }

                .slide::-webkit-slider-thumb {
                    background: $dark-slide-handle;
                }

                .slide::-moz-range-thumb {
                    background: $dark-slide-handle;
                }

            }

            .candlecolor {
                p {
                    color: #eee;
                }
            }
        }
}

.light {
        h3 {
            color: $light-text-color;
        }

        .chart-bg {
            fill: $light-group-bg;
        }
        .chart-num {
            fill: #333;
        }
        .chart-pline {
            stroke: #999;
        }

        .candle-wick {
            stroke: #444;
        }

        .candle-controls {
            background: $light-pane-bg;
            border: 1px solid $light-pane-border;

            .slidecontainer {
                label {
                    color: #333;
                }

                .slide {
                    background: $light-slide-bg;
                }

                .slide::-webkit-slider-thumb {
                    background: $light-slide-handle;
                }

                .slide::-moz-range-thumb {
                    background: $light-slide-handle;
                }
            }

            .candlecolor {
                p {
                    color: #333;
                }
            }
        }
}
</style>
