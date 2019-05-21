<template>
<svg class="candlestick"
     v-bind:width="`${spacing}px`"
     v-bind:height="`${height}px`">
  <!-- Candle Top Wick -->
  <line v-bind:x1="candleDimensions.line.x1"
        v-bind:x2="candleDimensions.line.x2"
        v-bind:y1="candleDimensions.line.y1"
        v-bind:y2="candleDimensions.line.y2"
        class="candle-wick" />
  <!-- Candle Body -->
  <rect v-bind:width="candleDimensions.rect.width"
        v-bind:x="candleDimensions.rect.x"
        v-bind:y="candleDimensions.rect.y"
        v-bind:height="candleDimensions.rect.height"
        v-bind:class="`candle-${candleDimensions.rect.color}`"
        ref="candlebody" />
</svg>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      default: 140
    },
    width: {
      type: Number,
      default: 10
    },
    spacing: {
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
    },
    data: {
      type: Object
    }
  },
  computed: {
    candleDimensions() {
      const color = this.data.close >= this.data.open ? 'green' : 'red'
      const rectTop = color === 'green' ? this.data.close : this.data.open
      const dimensions = {
        line: {
          x1: this.width / 2,
          x2: this.width / 2,
          y1: ( this.height / this.priceHigh ) * ( this.priceHigh - this.data.high ),
          y2: ( this.height / this.priceHigh ) * ( this.priceHigh - this.data.low )
        },
        rect: {
          x: 0,
          y: ( this.height / this.priceHigh ) * ( this.priceHigh - rectTop ),
          height: ( this.height / this.priceHigh ) * ( Math.max( this.data.open, this.data.close ) - Math.min( this.data.open, this.data.close ) ),
          width: this.width,
          color: color
        }
      }
      return dimensions
    }
  }

}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

// -----------------------------------------------------
// Candle
// -----------------------------------------------------

.candle-green {
    fill: $green;
}

.candle-red {
    fill: $red;
}

.candle-wick {
    stroke-width: 2;
}

.dark {
    .candle-wick {
        stroke: $gray;
    }
}

.light {
    .candle-wick {
        stroke: #444;
    }
}
</style>
