<template>
<b-row class="region-highlight">
  <b-col lg="9">
    <candle-chart v-bind:candles="candles"
                  v-bind:regions="chartRegions"
                  v-bind:time-label="timeLabel"
                  v-bind:time-label-interval="timeLabelInterval"
                  v-bind:height="chartHeight"
                  v-bind:force-range="priceRange"
                  v-bind:price-display="priceDisplay"
                  v-bind:price-width="priceWidth"
                  v-bind:candle-width="candleWidth"
                  v-bind:candle-spacing="candleSpacing"
                  v-bind:candle-highlight="candleHighlight">
    </candle-chart>
  </b-col>
  <b-col lg="3">
    <v-select class="region-select"
              v-if="chartRegions.length > 0"
              v-model="region"
              v-bind:options="chartRegions"
              v-on:input="setRegion"
              v-bind:placeholder="'Edit region'"
              v-bind:searchable="false"
              v-bind:clearable="false">
      <template slot="option"
                slot-scope="option">
        {{ option.label }} <span class="dot"></span>
      </template>

    </v-select>
    <div class="slider-cont"
         v-if="region">
      <h3>Edit Location</h3>

      <span v-html=""></span>
      <vue-slider v-model="region.range"
                  v-on:change="updateRegion"
                  v-bind:direction="'ltr'"
                  v-bind:min="0"
                  v-bind:max="candles.length - 1"
                  v-bind:tooltip="'none'"
                  v-bind:enable-cross="false"
                  v-bind:min-range="0"
                  v-bind:interval="sliderInterval">
      </vue-slider>
    </div>

    <b-btn class="add-region"
           v-if="addRegionButton"
           v-on:click="openAddRegion">Add New Region</b-btn>
  </b-col>
  <div v-if="addingRegion"
       class="add-region-cont">
    <div class="add-region-bg"></div>
    <div class="add-region">
      <div class="add-region-header"><span>Select Region Type</span></div>
      <div class="add-region-body">
        <v-select v-model="regionType"
                  v-bind:options="regionTypes"
                  v-bind:placeholder="'Choose type'"
                  v-on:input="cancelError"
                  v-bind:searchable="false"
                  v-bind:clearable="false">
          <template slot="option"
                    slot-scope="option">
            {{ option.label }}
          </template>

        </v-select>
        <div class="add-region-btns">
          <b-btn v-on:click="cancelRegion">Cancel</b-btn>
          <b-btn v-on:click="addRegion">Create</b-btn>
        </div>
        <div class="add-region-error"
             v-if="addError">Please select a region type.</div>
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
      region: null,
      regionsArr: [ ...this.regions ],
      addError: false,
      addingRegion: false,
      regionType: null
    }
  },
  props: {
    candles: {
      type: Array,
      default () {
        return []
      }
    },
    regions: {
      type: Array,
      default () {
        return []
      }
    },
    chartHeight: {
      type: Number,
      default: 260
    },
    timeLabel: {
      type: String
    },
    timeLabelInterval: {
      type: Number
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
    candleHighlight: {
      type: Boolean,
      default: false
    },
    sliderInterval: {
      type: Number,
      default: 1
    },
    regionTypes: {
      type: Array,
      default () {
        return []
      }
    },
    addRegionButton: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setRegion( val ) {
      console.log( this.chartRegions[ val.index ] )
      this.region = this.chartRegions[ val.index ]
    },
    updateRegion() {
      const newRegions = [ ...this.regionsArr ]
      newRegions[ this.region.index ] = this.region
      this.regionsArr = newRegions
    },
    addRegion() {
      if ( this.regionType ) {
        this.regionsArr = [ ...this.regionsArr, {
          label: this.regionType.label
        } ]
        this.addingRegion = false
      } else {
        this.addError = true
      }
    },
    openAddRegion() {
      this.addingRegion = true
    },
    cancelRegion() {
      this.addError = false
      this.regionType = null
      this.addingRegion = false
    },
    cancelError() {
      this.addError = false
    }
  },
  computed: {
    chartRegions() {
      return this.regionsArr.map( ( item, ix ) => {
        return {
          label: item.label,
          index: ix,
          range: [ item.range ? item.range[ 0 ] : 0, item.range ? item.range[ 1 ] : 0 ]
        }
      } )
    }
  }

}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';
@import '~assets/scss/mixins.scss';

.region-highlight {
    position: relative;
    padding-bottom: 20px;

    .region-select {
        display: block;
        width: 100%;
        min-width: 210px;
        margin-bottom: 30px;
    }

    .add-region {
        width: 100%;
        //margin-top: 30px;
    }

    .add-region-cont {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1005;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .add-region-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: $dark-blue;
            opacity: 0.4;
            z-index: 1005;
        }

        .add-region {
            width: 90%;
            max-width: 450px;
            background: lighten($dark-blue, 3%);
            border: 1px solid lighten($dark-blue, 17%);
            align-self: center;
            margin-top: 160px;
            z-index: 1010;

            @media(min-width: 768px) {
                margin-top: 50px;
            }

            .add-region-header {
                font-size: 1.4rem;
                font-weight: 600;
                text-align: center;
                padding: 20px 25px;
                background: lighten($dark-blue, 8%);
                border-bottom: 1px solid lighten($dark-blue, 17%);
            }

            .add-region-body {
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                padding: 30px 25px 10px;
                font-size: 1.15rem;
                font-weight: 600;

                .v-select {
                    margin-bottom: 25px;
                }

                .add-region-btns {
                    align-self: center;
                    margin-bottom: 15px;

                    button:first-child {
                        @include button-color($gray, 6%);
                        margin-right: 15px;
                    }
                }

                .add-region-error {
                    color: $red;
                    font-size: 1rem;
                    text-align: center;
                    margin-bottom: 10px;

                }
            }
        }
    }

    .slider-cont {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 50px;
        height: 90px;

        @media(min-width: 768px) {
            height: 80px;
        }

        .vue-slider,
        h3,
        span {
            align-self: center;
        }

        h3,
        span {
            font-size: 1.3rem;
            text-transform: uppercase;
        }

        span {
            margin-bottom: 35px;
            font-size: 1.1rem;
        }

        .vue-slider {
            display: block;
            padding: 0 !important;
            width: calc(100% - 40px) !important;

            .vue-slider-rail {
                height: 12px;
                border-radius: 0;
                background: lighten($dark-blue, 5%);
                border: 1px solid lighten($dark-blue, 15%);

                .vue-slider-process {
                    border-radius: 6px;
                    background: none !important;
                }

                .vue-slider-dot {
                    width: 40px;

                    .vue-slider-dot-handle {
                        width: 40px;
                        height: 40px;
                        position: relative;
                        top: -14px;
                        left: -13px;
                        text-align: center;
                        line-height: 40px;
                        z-index: 1000;
                        font-size: 26px;

                        &:before {
                            //content: "\e90f";
                            //font-family: "custom-icons";
                            content: "R";
                            color: $dark-blue;
                            font-weight: 600;
                        }

                    }

                }

                > div:nth-child(2) {
                    .vue-slider-dot-handle {
                        &:before {
                            content: "L";
                        }
                    }
                }

            }

        }
    }

    .start-btn {
        width: 100%;
        margin-top: 50px;
    }
}

.light {

    .region-highlight {

        .add-region-cont {
            .add-region-bg {
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

            .add-region {
                background: #fcfcfc;
                border: 1px solid #bbbbbb;

                .add-region-header {
                    background: rgba(0,0,0,0.03);
                    border-bottom: 1px solid #bbbbbb;
                    color: $light-header-color;
                }

                .add-region-body {
                    color: darken($light-text-color, 10%);

                    .v-select {
                        margin-bottom: 30px;

                        .vs__dropdown-toggle {
                            border: 1px solid #bbbbbb;
                        }

                        .vs__dropdown-menu {
                            border: 1px solid #bbbbbb;

                            li {
                                color: $dark-blue;

                                &:hover {
                                    background: $light-header-color;
                                    color: #ffffff;
                                }
                            }
                        }

                        .vs__dropdown-option--highlight {
                            background: $light-header-color;
                            color: #ffffff;
                        }
                    }
                }
            }
        }

        .slider-cont {
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
        }
    }

}
</style>
