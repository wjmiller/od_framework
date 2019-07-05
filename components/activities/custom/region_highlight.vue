<template>
<div class="region-highlight">
  <activity-lock v-bind:locked="locked"
                 v-bind:data="lockedData"></activity-lock>
  <div>

    <div class="region-toolbar">
      <b-btn v-if="addRegionButton"
             v-on:click="openAddRegion"
             class="add-region-btn">
        <span class="plus"></span> Add Region
      </b-btn>

      <b-btn v-if="addRevealButton"
             v-on:click="showRegions"
             class="reveal-region-btn">
        <span></span> Reveal Regions
      </b-btn>

      <b-btn v-if="correctRegions"
             v-on:click="checkRegions"
             class="eval-region-btn">
        <span></span> Check Regions
      </b-btn>

      <div class="fb-dropdown"
           v-if="feedbackPhase > 0"
           v-bind:class="{'fb-open': feedbackOpen}">
        <div class="fb-header"
             v-on:click="toggleFeedbackOpen">
          Feedback
        </div>
        <div class="fb-menu"
             v-show="feedbackOpen">
          <div class="fb-group"
               v-if="feedbackPhase > 0">
            <span v-if="activityCorrect"
                  class="correct">Correct</span>
            <span v-if="!activityCorrect"
                  class="incorrect">Incorrect</span>
          </div>
          <div class="fb-group"
               v-if="feedbackPhase > 0">
            <div class="fb-group-header">
              Hint 1: Total Regions / Total Types
            </div>
            <div class="fb-group-body">
              {{evaluation.typeLength.message}}
            </div>
          </div>
          <div class="fb-group"
               v-if="feedbackPhase > 1">
            <div class="fb-group-header">
              Hint 2: Your Number of Each Region Type
            </div>
            <div class="fb-group-body"
                 v-html="evaluation.regionLengths.message">
            </div>
          </div>
        </div>
      </div>
    </div>

    <ul class="region-key"
        v-if="!hiddenActivity"
        v-bind:class="{'active' : chartRegions.length > 0 || addRegionButton}">
      <li v-for="r in chartRegions"
          v-on:click="setRegion(r)"
          ref="region-btn">
        {{r.label}}
        <span class="dot"
              v-bind:class="`${r.color}`"></span>
      </li>
    </ul>
    <candle-chart v-bind:candles="candles"
                  v-bind:regions="chartRegions"
                  v-bind:timeline="true"
                  v-bind:time-label="timeLabel"
                  v-bind:time-label-interval="timeLabelInterval"
                  v-bind:height="chartHeight"
                  v-bind:force-range="priceRange"
                  v-bind:price-display="priceDisplay"
                  v-bind:price-width="priceWidth"
                  v-bind:candle-width="candleWidth"
                  v-bind:candle-spacing="candleSpacing"
                  v-bind:candle-highlight="candleHighlight"
                  v-bind:feedback="feedbackMode"
                  v-bind:hidden-regions="hiddenRegions">
    </candle-chart>
  </div>
  <div>
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
                  v-bind:interval="sliderInterval"
                  v-bind:disabled="region.solved">
      </vue-slider>
      <b-btn class="remove-region"
             v-if="addRegionButton"
             v-on:click="removeRegion"><span></span> Remove Region</b-btn>
    </div>
  </div>

  <div v-if="activityCorrect && correctShow"
       class="correct-cont">
    <div class="correct-bg"></div>
    <div class="correct-body">
      <div class="correct-message">
        <span>Congratulations!</span>
        <span>You found all of the correct formations on the chart!</span>
      </div>
      <b-btn class="correct-close"
             v-on:click="closeCorrect">Close</b-btn>
    </div>
  </div>

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
        <v-select v-model="regionColor"
                  v-bind:options="regionColors"
                  v-bind:placeholder="'Choose color'"
                  v-bind:searchable="false"
                  v-bind:clearable="false">
          <template slot="option"
                    slot-scope="option">
            {{ option.label }}
            <span class="dot"
                  v-bind:class="`${option.label}`"></span>
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
</div>
</template>

<script>
import CandleChart from '~/components/activities/candle_chart'
import ActivityLock from '~/components/utilities/activity_lock'
import {
  BDropdown
} from 'bootstrap-vue';

import {
  mapGetters
} from 'vuex'

Array.prototype.contains = function ( value ) {
  for ( var i = 0; i < this.length; i++ ) {
    if ( this[ i ] === value )
      return true;
  }
  return false;
}

export default {
  components: {
    CandleChart,
    ActivityLock
  },
  data() {
    return {
      region: null,
      regionsArr: [ ...this.regions ],
      activityCorrect: false,
      correctShow: false,
      addError: false,
      addingRegion: false,
      regionType: null,
      regionColor: null,
      evaluation: {
        typeLength: {
          match: null,
          message: null
        },
        regionLengths: {
          lengths: [],
          message: null
        }
      },
      feedbackPhase: 0,
      feedbackMode: false,
      feedbackOpen: false,
      hiddenActivity: this.hiddenRegions
    }
  },
  props: {
    locked: {
      type: Boolean,
      default: false
    },
    lockedData: {
      default: null
    },
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
    correctRegions: {
      type: Array
    },
    chartHeight: {
      type: Number,
      default: 260
    },
    timeline: {
      type: Boolean
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
    regionColors: {
      type: Array,
      default () {
        return [
          'default', 'pink', 'yellow', 'light-blue', 'orange', 'purple', 'teal', 'blue'
        ]
      }
    },
    addRegionButton: {
      type: Boolean,
      default: false
    },
    hiddenRegions: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    setRegion( val ) {
      this.region = this.chartRegions[ val.index ]
      for ( var i = 0; i < this.$refs[ 'region-btn' ].length; i++ ) {
        this.$refs[ 'region-btn' ][ i ].style.borderColor = this.getUserPrefs.theme_dark ? '#2b314d' : '#CCCCCC'
      }
      this.$refs[ 'region-btn' ][ val.index ].style.borderColor = this.getUserPrefs.theme_dark ? '#DDDDDD' : '#5158c1'
    },
    updateRegion() {
      const newRegions = [ ...this.regionsArr ]
      newRegions[ this.region.index ] = this.region
      this.regionsArr = newRegions
      if ( this.correctRegions ) this.evaluate()
    },
    addRegion() {
      if ( this.regionType ) {
        this.regionsArr = [ ...this.regionsArr, {
          label: this.regionType,
          color: this.regionColor
        } ]

        setTimeout( () => {
          this.setRegion( {
            index: this.regionsArr.length - 1
          } )
        }, 0 )

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
      this.regionColor = null
      this.addingRegion = false
    },
    cancelError() {
      this.addError = false
    },
    removeRegion() {
      this.regionsArr.splice( this.region.index, 1 )
      this.region = null
    },
    showRegions() {
      this.hiddenRegions = false
    },
    closeCorrect() {
      this.correctShow = false
    },
    checkTypeLength() {
      const correctArr = this.prepArray( this.correctRegions )
      this.evaluation.typeLength.message = 'You will find ' + this.correctRegions.length + ' total formations on this chart composed of ' + correctArr.length + ' different types.'
    },
    checkRegionLengths() {
      const correctArr = this.prepArray( this.correctRegions )
      const userArr = this.prepArray( this.chartRegions )
      let messageStr = ''

      for ( let i = 0; i < correctArr.length; i++ ) {
        const ranges = 0
        const matchingType = userArr.filter( ( o ) => {
          return o.type === correctArr[ i ].type
        } )

        if ( matchingType.length > 0 ) ranges = matchingType[ 0 ].ranges.length

        this.evaluation.regionLengths.lengths[ i ] = {
          type: correctArr[ i ].type,
          message: correctArr[ i ].type + ': ' + ranges + ' of ' + correctArr[ i ].ranges.length
        }
      }

      for ( const r of this.evaluation.regionLengths.lengths ) {
        messageStr = messageStr + r.message + ' <br/>'
      }

      messageStr = messageStr + '<br/><em>If you have the correct number of each region type, check your region placements.</em>'

      this.evaluation.regionLengths.message = messageStr
    },
    checkSequence() {
      const arr = [ ...this.correctRegions ]
      let seqString = ''
      arr.sort( function ( a, b ) {
        const num1 = a.range[ 0 ]
        const num2 = b.range[ 0 ]
        return ( num1 < num2 ) ? -1 : ( num1 > num2 ) ? 1 : 0;
      } )

      for ( let i = 0; i < arr.length; i++ ) {
        i == arr.length - 1 ? seqString = seqString + arr[ i ].label : seqString = seqString + arr[ i ].label + ', '
      }
    },
    checkRegion( arr, region ) {
      // Create array containing objects of region stats measured against each correct region
      const regionData =
        arr.map( function ( obj, ix ) {
          return {
            ix: ix,
            type: obj.label === region.label,
            range: JSON.stringify( obj.range ) === JSON.stringify( region.range )
          }
        } )

      // If the region matches a correct region in type and range, store in variable
      const correct = regionData.filter( ( o ) => {
        return o.type == true && o.range == true
      } )

      if ( correct.length > 0 ) {
        // If the region is correct, set that region in the regionsArr value to correct = true
        this.regionsArr[ region.index ].correct = true
      } else {
        this.regionsArr[ region.index ].correct = false
        // Get the regions that match type and store them in variable
        const typeMatch = regionData.filter( ( o ) => {
          return o.type == true
        } )

        if ( typeMatch.length > 0 ) {
          const sums = []
          for ( let a = 0; a < typeMatch.length; a++ ) {
            sums.push( this.correctRegions[ typeMatch[ a ].ix ].range[ 0 ] + this.correctRegions[ typeMatch[ a ].ix ].range[ 1 ] )
          }
          const closestIx = typeMatch[ sums.indexOf( Math.min( ...sums ) ) ].ix
          this.regionsArr[ region.index ].typeMatch = true
          this.regionsArr[ region.index ].rangeMatch = false
          this.regionsArr[ region.index ].rangeDiff = []
          this.regionsArr[ region.index ].rangeDiff[ 0 ] = Math.max( this.correctRegions[ closestIx ].range[ 0 ], region.range[ 0 ] ) - Math.min( this.correctRegions[ closestIx ].range[ 0 ], region.range[ 0 ] )
          this.regionsArr[ region.index ].rangeDiff[ 1 ] = Math.max( this.correctRegions[ closestIx ].range[ 1 ], region.range[ 1 ] ) - Math.min( this.correctRegions[ closestIx ].range[ 1 ], region.range[ 1 ] )

        } else {
          // Get the regions that match type and store them in variable
          const rangeMatch = regionData.filter( ( o ) => {
            return o.range == true
          } )

          if ( rangeMatch.length > 0 ) {
            this.regionsArr[ region.index ].typeMatch = false
            this.regionsArr[ region.index ].rangeMatch = true
          } else {
            this.regionsArr[ region.index ].typeMatch = null
            this.regionsArr[ region.index ].rangeMatch = null
          }
        }
      }
    },
    checkRegions() {
      this.isActivityCorrect()

      if ( !this.activityCorrect ) {
        this.feedbackPhase++

        if ( this.feedbackPhase < 3 ) {
          this.feedbackPhase == 1 ? this.checkTypeLength() : this.checkRegionLengths()
          this.feedbackOpen = true
        } else if ( this.feedbackPhase == 3 ) {
          this.evaluate()
          this.feedbackMode = true
        }
      } else {
        this.correctShow = true
        this.feedbackMode = true
      }
    },
    isActivityCorrect() {

      const userArr = this.prepArray( this.chartRegions )
      const correctArr = this.prepArray( this.correctRegions )

      JSON.stringify( userArr ) == JSON.stringify( correctArr ) ? this.activityCorrect = true : this.activityCorrect = false
    },
    toggleFeedbackOpen() {
      this.feedbackOpen = !this.feedbackOpen
    },
    evaluate() {
      // Evaluate each region to see if it is correct or not
      for ( let i = 0; i < this.chartRegions.length; i++ ) {
        const match = this.checkRegion( this.correctRegions, this.chartRegions[ i ] )
      }

      // Reset the region so that the controls can be disabled if needed
      if ( this.region ) this.setRegion( this.region )

      this.isActivityCorrect()
      if ( this.activityCorrect && this.feedbackMode ) {
        this.correctShow = true
      }
    },
    prepArray( arr ) {
      const types = {}
      const preppedArray = []

      for ( var i = 0; i < arr.length; i++ ) {
        const type = arr[ i ].label
        if ( !types[ type ] ) {
          types[ type ] = []
        }
        if ( !types[ type ].contains( arr[ i ].range ) ) {
          types[ type ].push( arr[ i ].range )
        }
      }

      for ( const type in types ) {
        types[ type ].sort( function ( a, b ) {
          const num1 = a[ 0 ]
          const num2 = b[ 0 ]
          return ( num1 < num2 ) ? -1 : ( num1 > num2 ) ? 1 : 0;
        } )

        preppedArray.push( {
          type: type,
          ranges: types[ type ]
        } )
      }

      preppedArray.sort( function ( a, b ) {
        const typeA = a.type.toLowerCase();
        const typeB = b.type.toLowerCase();
        return ( typeA < typeB ) ? -1 : ( typeA > typeB ) ? 1 : 0;
      } );

      return preppedArray
    }
  },
  computed: {
    ...mapGetters( [ 'getUserPrefs' ] ),
    fbMode: {
      get() {
        return this.feedbackMode
      },
      set( evalValue ) {
        return evalValue
      }
    },
    addRevealButton() {
      return this.hiddenActivity
    },
    chartRegions() {
      return this.regionsArr.map( ( item, ix ) => {
        return {
          label: item.label,
          index: ix,
          color: item.hasOwnProperty( 'color' ) ? item.color : 'pink',
          range: [ item.range ? item.range[ 0 ] : 0, item.range ? item.range[ 1 ] : 0 ],
          correct: item.hasOwnProperty( 'correct' ) ? item.correct : false,
          typeMatch: item.hasOwnProperty( 'typeMatch' ) ? item.typeMatch : null,
          rangeMatch: item.hasOwnProperty( 'rangeMatch' ) ? item.rangeMatch : null,
          rangeDiff: item.hasOwnProperty( 'rangeDiff' ) ? item.rangeDiff : null
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

    .region-toolbar {
        min-height: 42px;
        margin-bottom: 10px;

        .add-region-btn {
            margin-right: 8px;
            vertical-align: top;
        }

        .eval-region-btn {
            margin-right: 15px;
            vertical-align: top;
        }

        .fb-dropdown {
            display: inline-block;
            position: relative;
            width: 360px;

            .fb-header {
                position: relative;
                background: $dark-blue;
                border: 1px solid lighten($dark-blue, 17%);
                font-weight: 600;
                color: #fff;
                width: 100%;
                padding: 0.35rem 1rem;

                &:hover {
                    cursor: pointer;
                }

                &:after {
                    content: "";
                    border-top: 0.4em solid;
                    border-right: 0.4em solid transparent;
                    border-bottom: 0;
                    border-left: 0.4em solid transparent;
                    position: absolute;
                    right: 1rem;
                    top: 1rem;
                }
            }

            .fb-menu {
                width: 100%;
                background: $dark-blue;
                border: 1px solid lighten($dark-blue, 17%);
                border-top: 0;
                color: #fff;
                font-weight: 600;
                padding: 0.9rem 1rem 0.4rem;
                position: absolute;
                top: 39px;
                z-index: 1010;

                .fb-group {
                    margin-bottom: 15px;

                    .correct,
                    .incorrect {
                        color: $red;
                        font-weight: 600;
                        font-size: 1.1rem;
                    }

                    .correct {
                        color: $green;
                    }

                    .fb-group-header {
                        margin-bottom: 5px;
                    }

                    .fb-group-body {
                        color: #ccc;
                        font-weight: 400;
                    }
                }
            }

            &.fb-open {
                .fb-header {
                    color: rgba(255,255,255,0.3);

                    &:after {
                        color: #fff;
                        border-top: 0;
                        border-right: 0.4em solid transparent;
                        border-bottom: 0.4em solid;
                        border-left: 0.4em solid transparent;
                    }
                }
            }
        }

        .add-region-btn {
            display: inline-block;
        }
    }

    .add-region-btn,
    .eval-region-btn,
    .reveal-region-btn {
        padding: 0.3rem 1.2rem 0.4rem;
        font-size: 1rem;
    }

    .region-key {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;
        list-style-type: none;
        visibility: hidden;
        min-height: 3rem;
        margin-bottom: 0;
        padding: 0;

        &.active {
            visibility: visible;
        }

        li {
            margin-right: 10px;
            padding: 0.2rem 0.7rem;
            border-radius: 20px;
            margin-top: 10px;
            border: 4px solid lighten($dark-blue, 10%);

            &:hover {
                cursor: pointer;
                border: 4px solid #ddd !important;
            }

            span.dot {
                margin-left: 3px;
                width: 10px;
                height: 10px;
                top: 2px;
            }
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
            margin-right: 4px;
            position: relative;
            top: 1px;

            &:before {
                content: "\f055";
                font-family: "custom-icons";
            }
        }

    }

    .eval-region-btn {
        span {
            margin-right: 3px;
            &:before {
                content: "\e065";
                font-family: "custom-icons";
            }
        }
    }

    .reveal-region-btn {
        span {
            margin-right: 3px;
            &:before {
                content: "\e8f4";
                font-family: "custom-icons";
            }
        }
    }

    .add-region-cont,
    .correct-cont {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1005;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;

        .add-region-bg,
        .correct-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: $dark-blue;
            opacity: 0.4;
            z-index: 1005;
        }

        .add-region,
        .correct-body {
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

            .correct-message {
                text-align: center;
                margin-bottom: 26px;

                span {
                    display: block;
                }

                span:nth-child(1) {
                    font-weight: 600;
                    font-size: 1.4rem;
                    margin-bottom: 0.9rem;
                }
                span:nth-child(2) {
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: #ccc;
                }
            }

            .correct-close {
                display: block;
                width: 104px;
                margin: 0 auto;
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
                    margin-bottom: 15px;

                    &:nth-child(2) {
                        margin-bottom: 25px;
                    }
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

        .correct-body {
            padding: 1.8rem 1.5rem 1.5rem;
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
                background: darken($red, 5%);
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

        .region-toolbar {
            .fb-dropdown {
                .fb-header {
                    background: #fff;
                    border: 1px solid #bbbbbb;
                    color: $light-text-color;
                }

                .fb-menu {
                    background: #fff;
                    border: 1px solid #bbbbbb;
                    color: darken($light-text-color, 10%);

                    .fb-group {

                        .correct {
                            color: $green-med;
                        }
                        .incorrect {
                            color: darken($red,5%);
                        }

                        .fb-group-body {
                            color: darken($light-text-color, 20%);
                        }
                    }
                }

                &.fb-open {
                    .fb-header {
                        color: rgba(0,0,0,0.4);

                        &:after {
                            color: $light-text-color;
                        }
                    }
                }
            }
        }

        .region-key {
            li {
                border: 4px solid #cccccc;

                &:hover {
                    cursor: pointer;
                    border: 4px solid $purple-med !important;
                }
            }
        }

        .add-region-cont,
        .correct-cont {
            .add-region-bg,
            .correct-bg {
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

            .add-region,
            .correct-body {
                background: #fcfcfc;
                border: 1px solid #bbbbbb;

                .add-region-header {
                    background: rgba(0,0,0,0.03);
                    border-bottom: 1px solid #bbbbbb;
                    color: $light-header-color;
                }

                .correct-message {
                    span:nth-child(1) {
                        color: $light-header-color;
                    }
                    span:nth-child(2) {
                        color: lighten($light-text-color, 15%);
                    }
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

                .vue-slider-rail {
                    background: rgba(0,0,0,0.03);
                    border: 1px solid #bbbbbb;
                    .vue-slider-dot-handle {
                        background: $light-header-color;
                        box-shadow: none;
                        &:before {
                            color: #fff;
                        }
                    }
                }
            }

            .remove-region {
                background: #fff;
                border-color: #ccc;
                color: $light-text-color;

                &:hover {
                    color: #fff;
                    background: darken($red, 5%);
                    border-color: darken($red, 5%);
                }
            }

        }
    }

}
</style>
