<!-- Template -->
<template lang="html">
<div class="row candle-builder">
  <div class="col-sm-12">
    <h3>Candle Builder</h3>
  </div>
  <div class="col-sm-8 col-md-8 col-lg-8">
    <!-- Candle Builder Chart -->
    <svg id="chart"
         width="100%"
         v-bind:height="chartHeight">
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
              v-for="(price,index) in cbdata.cdata.prices"
              v-bind:key="'price-' + index"
              v-bind:y="50 + (40 * index)"
              class="chart-num">{{price}}</text>
        <!-- Price Lines -->
        <line v-for="(price,index) in cbdata.cdata.prices"
              v-bind:y1="50 + (40 * index)"
              v-bind:y2="50 + (40 * index)"
              v-bind:key="'line-' + index"
              class="chart-pline"
              x1="50"
              x2="96%" />
      </g>
      <!-- Candlestick -->
      <g>
        <!-- Candle Top Wick -->
        <line x1="155"
              x2="155"
              v-bind:y1="chartBodyTop"
              v-bind:y2="chartWickTop"
              class="candle-wick" />
        <!-- Candle Body -->
        <rect width="60"
              v-bind:x="125"
              v-bind:y="chartBodyTop"
              v-bind:height="chartBodyHeight"
              v-bind:class="chartBodyColor" />
        <!-- Candle Bottom Wick -->
        <line x1="155"
              x2="155"
              v-bind:y1="chartBodyHeight + chartBodyTop"
              v-bind:y2="chartWickBottom"
              class="candle-wick" />
      </g>
    </svg>
  </div>
  <div class="col-sm-4 col-md-4 col-lg-4">
    <!-- Candle Builder Controls -->
    <div class="candle-controls">
      <!-- Top Wick Slider -->
      <div class="slidecontainer">
        <label>Top Wick</label>
        <input type="range"
               v-model="rangeWickTop"
               min="0"
               max="10"
               step="1"
               class="slide"
               v-on:input="changeCandle('WickTop')">
      </div>
      <!-- Top Body Slider -->
      <div class="slidecontainer">
        <label>Top of Body</label>
        <input type="range"
               v-model="rangeBodyTop"
               min="0"
               max="10"
               step="1"
               class="slide"
               v-on:input="changeCandle('BodyTop')">
      </div>
      <!-- Bottom Body Slider -->
      <div class="slidecontainer">
        <label>Bottom of Body</label>
        <input type="range"
               v-model="rangeBodyBottom"
               min="0"
               max="10"
               step="1"
               class="slide"
               v-on:input="changeCandle('BodyBottom')">
      </div>
      <!-- Bottom Wick Slider -->
      <div class="slidecontainer">
        <label>Bottom Wick</label>
        <input type="range"
               v-model="rangeWickBottom"
               min="0"
               max="10"
               step="1"
               class="slide"
               v-on:input="changeCandle('WickBottom')">
      </div>
      <!-- Color Slider -->
      <div class="candlecolor">
        <label class="switch">
          <input type="checkbox"
                 v-model="candleRed"
                 v-on:change="changeCandle('BodyColor')">
          <span class="slider round"></span>
        </label>
        <p>Color</p>
      </div>
    </div>
  </div>
</div>
</template>


<script>
export default {
  name: 'candle-builder',
  data() {
    return {
      chartTop: 250,
      sliderMax: 10,
      chartBaseHeight: 51,
      chartTick: 20,
      bodyBase: 5,
      bodyTop: 0,
      bodyBottom: 0,
      wickTop: 0,
      wickBottom: 0,
      candleRed: false,
      rangeBodyTop: 0,
      rangeBodyBottom: 0,
      rangeWickTop: 0,
      rangeWickBottom: 0
    }
  },
  computed: {
    //chartTop () {55 + ((this.cbdata.cdata.prices.length - 1) * 50)},
    chartHeight() {
      return this.chartBaseHeight + ( ( this.cbdata.cdata.prices.length - 1 ) * this.chartTick * 2 )
    },
    cBodyTop() {
      return this.bodyTop
    },
    cBodyBottom() {
      return Math.max( this.bodyTop - this.bodyBottom, 0 )
    },
    cWickTop() {
      return Math.max( this.wickTop - this.bodyTop, 0 )
    },
    cWickBottom() {
      return Math.max( this.bodyBottom - this.wickBottom, 0 )
    },
    chartBodyTop() {
      return this.chartTop - ( this.chartTick * this.bodyTop ) - this.bodyBase / 2
    },
    chartBodyHeight() {
      return this.bodyBase + ( this.cBodyBottom * this.chartTick )
    },
    chartBodyColor() {
      return this.candleRed ? 'candle-red' : 'candle-green'
    },
    chartWickTop() {
      return Math.max( 0, this.chartBodyTop - ( this.chartTick * this.cWickTop ) )
    },
    chartWickBottom() {
      return Math.max( 0, this.chartBodyHeight + this.chartBodyTop + ( this.chartTick * this.cWickBottom ) )
    }
  },
  props: [ 'cbdata' ],
  methods: {
    makeInteger( str ) {
      return parseInt( str, 10 )
    },
    returnData() {
      return this.$data
    },
    changeCandle( part ) {
      this[ `modify${part}` ]();
      this.$emit( 'candleChange', {
        open: this.candleRed ? this.bodyTop : this.bodyBottom,
        close: this.candleRed ? this.bodyBottom : this.bodyTop,
        high: this.wickTop,
        low: this.wickBottom
      } );
    },
    modifyBodyColor() {},
    modifyBodyTop() {
      this.bodyTop = this.makeInteger( this.rangeBodyTop );
      this.bodyBottom = this.bodyBottom > this.bodyTop ? this.bodyTop : this.bodyBottom;
      this.wickTop = this.wickTop < this.bodyTop ? this.bodyTop : this.wickTop;
      this.rangeBodyBottom = this.bodyBottom;
      this.rangeWickTop = this.wickTop;
    },
    modifyBodyBottom() {
      const bodyBottom = this.makeInteger( this.rangeBodyBottom );
      this.bodyBottom = bodyBottom > this.bodyTop ? this.bodyTop : bodyBottom;
      this.wickBottom = this.bodyBottom < this.wickBottom ? this.bodyBottom : this.wickBottom;
      this.rangeBodyBottom = this.bodyBottom;
      this.rangeWickBottom = this.wickBottom;
    },
    modifyWickTop() {
      const wickTop = this.makeInteger( this.rangeWickTop );
      this.wickTop = wickTop < this.bodyTop ? this.bodyTop : wickTop;
      this.rangeWickTop = this.wickTop;
    },
    modifyWickBottom() {
      const wickBottom = this.makeInteger( this.rangeWickBottom );
      this.wickBottom = this.bodyBottom < wickBottom ? this.bodyBottom : wickBottom;
      this.rangeWickBottom = this.wickBottom;
    }
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

.candle-builder {
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

}

// Dark/Light Theme Styles -----------------------------

.dark {
    .candle-builder {

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
}

.light {
    .candle-builder {

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
}
</style>
