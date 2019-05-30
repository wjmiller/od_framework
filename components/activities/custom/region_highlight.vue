<template>
<b-row class="region-highlight">
  <b-col lg="12">

    <b-btn class="add-region-btn"
           v-if="addRegionButton"
           v-on:click="openAddRegion">
      <span class="plus"></span> Add Region
    </b-btn>

    <ul class="region-key"
        v-if="chartRegions.length > 0 || addRegionButton">
      <li v-for="r in chartRegions"
          v-on:click="setRegion(r)"
          ref="region-btn">
        {{r.label}}
        <span class="dot"></span>
      </li>
      <!--
      <li class="add-region-btn"
          v-if="addRegionButton"
          v-on:click="openAddRegion">
        <span class="plus"></span> Add Region
      </li>
    -->
    </ul>
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
  <b-col lg="12">
    <div class="slider-cont"
         v-if="region">
      <h3>{{region.label}} Controls</h3>
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
      <b-btn class="remove-region"
             v-if="addRegionButton"
             v-on:click="removeRegion"><span></span> Remove Region</b-btn>
    </div>
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

import {
  mapGetters
} from 'vuex'

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
      this.region = this.chartRegions[ val.index ]
      for ( const ix in this.$refs[ 'region-btn' ] ) {
        this.$refs[ 'region-btn' ][ ix ].style.background = 'rgba(0,0,0,0)'
      }
      console.log( this.$refs[ 'region-btn' ] )
      this.$refs[ 'region-btn' ][ val.index ].style.background = this.getUserPrefs.theme_dark ? '#2b314d' : 'rgba(0,0,0,0.15)'
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
        setTimeout( () => {
          this.setRegion( {
            index: this.regionsArr.length - 1
          } )
        }, 100 )
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
    },
    removeRegion() {
      this.regionsArr.splice( this.region.index, 1 )
      this.region = null
    },
    checkRegions() {

    }
  },
  computed: {
    ...mapGetters( [ 'getUserPrefs' ] ),
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

    .chart {
        .chart-wrapper {
            margin-bottom: 30px;
        }
    }

    .add-region-btn {
        padding: 0.2rem 1.2rem;
        font-size: 1rem;
        margin-bottom: 25px;
    }

    .region-key {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        list-style-type: none;
        margin-bottom: 0;
        padding: 0;

        li {
            margin-right: 0;
            padding: 0.2rem 0.7rem;
            border-radius: 20px;
            border: 4px solid rgba(0,0,0,0);
            margin-bottom: 10px;

            &:hover {
                cursor: pointer;
                background: lighten($dark-blue, 10%) !important;
            }

            span.dot {
                margin-left: 3px;
                width: 10px;
                height: 10px;
                top: 2px;
            }

            /*

            &:last-child {
                margin-left: 20px;
            }

            &:first-child {
                margin-left: 0;
            }

            &.add-region-btn {
                padding: 0.2rem 0.7rem;
                font-size: 1rem;

                &:hover {
                    cursor: pointer;
                    //background: lighten($purple-med, 4%) !important;
                }
            }

            */
        }
    }

    .region-select {
        display: block;
        width: 100%;
        min-width: 210px;
        margin-bottom: 30px;
    }

    .add-region-btn {

        span {
            margin-right: 5px;
            position: relative;
            top: 1px;

            &:before {
                content: "\f055";
                font-family: "custom-icons";
            }
        }

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
        justify-content: flex-start;
        margin-bottom: 50px;

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

        h3 {
            margin: 0 auto 25px;

            @media(min-width: 992px) {
                margin: 30px auto 25px;
            }
        }

        span {
            margin-bottom: 35px;
            font-size: 1.1rem;
        }

        .vue-slider {
            display: block;
            padding: 0 !important;
            width: 70% !important;

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

        .remove-region {
            margin-top: 60px;
            padding: 0.3rem 1.4rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 50px;
            align-self: center;
            text-align: center;
            color: #fff;
            background: lighten($dark-body-bg, 3%);
            border: 4px solid lighten($dark-body-bg, 17%);

            span {
                position: relative;
                font-size: 0.9rem;
                margin-right: 6px;

                &:before {
                    content: "\f1f8";
                    font-family: "custom-icons";
                }
            }

            &:hover {
                color: #fff;
                background: darken($red, 5%); //lighten($dark-body-bg, 8%);
                border: 4px solid darken($red, 5%);
            }

            &:focus {
                outline: 0;
            }

            &:disabled {
                opacity: 0.4;
                color: lighten($dark-gray-med, 30%);
                border: 4px solid lighten($dark-gray-med, 30%);
                cursor: not-allowed;
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
