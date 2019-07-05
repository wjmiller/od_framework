<template>
  <div class="sketchpad-container">
    <div class="sketchpad" ref="sketchpad"></div>
  </div>
</template>

<script>
import AppData from '~/assets/data/app_data.js'

if ( process.client ) {
  var Sketchpad = require( '~/mixins/sketchpad' )
}

import {
  mapGetters
} from 'vuex'

export default {
  name: 'sketchpad',
  props: {
    relativeToHeight: {
      type: Boolean,
      default: true
    },
    ratio: {
      type: Number,
      default: 1
    },
    color: {
      type: String,
      default: '#FFFFFF'
    },
    lineSize: {
      type: Number,
      default: 5
    },
    autoColor: {
      type: Boolean,
      default: true
    },
    padData: {
      type: Object
    }
  },
  methods: {
    clearPad() {
      this.pad.clear()
    },
    setLineColor(color) {
      this.pad.setLineColor(color)
    },
    setLineSize(size) {
      this.pad.setLineSize(size)
    },
    padToJSON() {
      this.$emit('sketch-json', this.pad.toJSON())
    },
    padLoadJSON(json) {
      this.pad.loadJSON(json)
    }
  },
  computed: {
    ...mapGetters( [ 'getUserPrefs' ] ),
    theme() {
      return this.getUserPrefs.theme_dark ? 'dark' : 'light'
    },
    padColor() {
      return this.autoColor ? (this.theme === 'dark' ? '#FFFFFF' : '#112163') : this.color
    }
  },
  watch: {
    padColor() {
      if (!this.autoColor) {
        const data = this.pad.toJSON()
        this.pad.clear()
        data.strokes.forEach( stroke => stroke.color = this.padColor )
        this.pad.setLineColor( this.padColor )
        this.pad.loadJSON( data )
      }
    }
  },
  mounted() {
    var el = this.$refs.sketchpad;
    this.pad = new Sketchpad(
      el, {
        aspectRatio: `${this.ratio}`,
        line: {
          color: this.padColor,
          size: this.lineSize
        }
      }
    )
    this.pad.canvas.addEventListener('touchend', this.padToJSON)
    this.pad.canvas.addEventListener('mouseup', this.padToJSON)
    this.pad.canvas.addEventListener('mouseleave', this.padToJSON)
    window.onresize = e => this.pad.resize( el.offsetWidth )
  }
}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~/assets/scss/variables.scss';
.sketchpad-container {
  width: 100%;
  //height: 345px;
  margin-bottom: 30px;

  .sketchpad {
      width: 100% !important;
      //height: 345px !important;
      border-radius: 8px;
      overflow: hidden;
  }
}

.dark {
  .sketchpad {
      border: 1px solid lighten($dark-blue, 17%);
  }
}

.light {
  .sketchpad {
      border: 1px solid #bbbbbb;
  }
}

</style>
