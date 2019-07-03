<template>
<div>
  <div v-if="sortLoad">
    <bounce class="od-loader"></bounce>
  </div>
  <div v-if="!sortLoad"
       class="candle-sort">
    <draggable v-model="candleData"
               v-on:start="drag=true"
               v-on:end="drag=false"
               v-on:change="clearFeedback">
      <div v-for="(candle, ix) in candleData">
        <candle v-bind:key="'candle-' + ix"
                v-bind:width="candleWidth"
                v-bind:height="canvasHeight"
                v-bind:priceHigh="priceHigh"
                v-bind:priceLow="priceLow"
                v-bind:spacing="candleSpacing"
                v-bind:data="candle"></candle>
      </div>
    </draggable>
    <b-btn class="order-btn"
           v-bind:disabled="correct"
           v-on:click="checkOrder">Check Order</b-btn>
    <div v-if="showFeedback"
         class="sort-feedback"><span v-if="correct"
            class="correct">Correct</span><span v-if="!correct"
            class="incorrect">Incorrect</span></div>
  </div>
</div>
</template>

<script>
import Candle from '~/components/activities/candle'
import {
  Activity
} from '../../mixins/activity.js'

export default {
  components: {
    Candle
  },
  mixins: [ Activity ],
  props: {
    candles: {
      type: Array
    },
    canvasHeight: {
      type: Number,
      default: 140
    },
    candleWidth: {
      type: Number,
      default: 10
    },
    candleSpacing: {
      type: Number,
      default: 20
    },
    priceHigh: {
      type: Number,
      default: 20
    },
    priceLow: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      sortLoad: false,
      orig: null,
      showFeedback: false,
      candleData: this.candles
    }
  },
  methods: {
    shuffle( arr ) {
      let ctr = arr.length,
        temp, ix

      while ( ctr > 0 ) {
        ix = Math.floor( Math.random() * ctr )
        ctr--
        temp = arr[ ctr ]
        arr[ ctr ] = arr[ ix ]
        arr[ ix ] = temp
      }
      return arr
    },
    arraysEqual( arr1, arr2 ) {
      if ( arr1.length !== arr2.length )
        return false;
      for ( var i = arr1.length; i--; ) {
        if ( arr1[ i ] !== arr2[ i ] )
          return false;
      }
      return true;
    },
    checkOrder() {
      this.makeAttempt()
      this.showFeedback = true
    },
    clearFeedback() {
      if ( this.showFeedback == true ) this.showFeedback = false
    }
  },
  created() {
    this.sortLoad = true
    this.orig = [ ...this.candleData ]
    this.addCorrectTest( v => v.arraysEqual( v.candleData, v.orig ) )

    while ( this.arraysEqual( this.candleData, this.orig ) ) {
      this.shuffle( this.candleData )
    }
    setTimeout( () => {
      this.sortLoad = false
    }, 1000 )
  }
}
</script>

<style lang="scss">
//------------------------------------------------------
// Import Variables
//------------------------------------------------------

@import '~assets/scss/variables.scss';

.candle-sort > div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    position: relative;

    div {
        &:hover {
            cursor: move;
        }
    }
}

.order-btn {
    margin: 1.3rem 0;
}

.od-loader {
    .spinner {
        margin: 20px 50px;

        > div {
            background: #fff;
        }
    }
}

.sort-feedback {
    transition: opacity cubic-bezier(.71,.55,.62,1.57) 0.2s;
    font-weight: 600;
    font-size: 1.3rem;
    margin-bottom: 0.9rem;

    span.correct {
        color: $green;
        &:before {
            content: '\e908';
            font-family: 'custom-icons';
            margin-right: 5px;
        }
    }

    span.incorrect {
        color: $red;

        &:before {
            content: '\e90b';
            font-family: 'custom-icons';
            margin-right: 5px;
        }
    }
}
</style>
