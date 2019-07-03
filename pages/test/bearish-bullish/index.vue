<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Candle Generator</nuxt-link>
    </b-col>
  </b-row>
  <div v-for="(pattern, ix) in patterns">
    <draw-pattern v-on:candles-updated="evaluateCandles(ix, $event)">
      <template v-slot:instructions>
        <p>{{ pattern.instructions }}</p>
      </template>
      <template v-slot:feedback>
        <feedback-display v-bind:auto="true"
                          v-bind:activated="true"
                          v-bind:messages="messages"
                          v-bind:displayed="pattern.feedback">
        </feedback-display>
      </template>
    </draw-pattern>
  </div>
</b-container>
</template>

<script>
import DrawPattern from '~/components/activities/draw_pattern'
import FeedbackDisplay from '~/components/subcomponents/feedback'

export default {
  name: 'lesson',
  components: {
    DrawPattern,
    FeedbackDisplay
  },
  data() {
    return {
      patterns: [
        {
          instructions: 'Draw a price line to make a very bearish red candle.',
          type: 'verybearish',
          color: 'red',
          correct: false,
          feedback: [ 'standard' ]
          },
        {
          instructions: 'Draw a price line to make a very bearish green candle.',
          type: 'verybearish',
          color: 'green',
          correct: false,
          feedback: [ 'standard' ]
          },
        {
          instructions: 'Draw a price line to make a neutral green candle.',
          type: 'neutral',
          color: 'green',
          correct: false,
          feedback: [ 'standard' ]
          },
        {
          instructions: 'Draw a price line to make a bullish green candle.',
          type: 'bullish',
          color: 'green',
          correct: false,
          feedback: [ 'standard' ]
          }
        ],
      messages: this.buildMessages()
    }
  },
  methods: {
    buildMessages() {
      const colors = [ 'red', 'green' ]
      const types = [ 'very bearish', 'very bullish', 'bearish', 'bullish', 'neutral' ]
      const percents = [ [ 0, 20 ], [ 80, 100 ], [ 20, 40 ], [ 60, 80 ], [ 40, 60 ] ]

      const messages = types.reduce( ( memo, type, ix ) => {
        const typeTrim = type.replace( ' ', '' )
        colors.forEach( color => {
          memo.push( {
            name: `${typeTrim}${color}`,
            text: `You were supposed to draw a price line to make a ${type}, ${color} candle.`
          } )
          memo.push( {
            name: `wrong${typeTrim}${color}`,
            text: `But you made a ${type}, ${color} candle.`
          } )
          memo.push( {
            name: `right${typeTrim}${color}`,
            text: `And you made a ${type}, ${color} candle.`
          } )
        } )
        memo.push( {
          name: `hint${typeTrim}`,
          text: `Remember that ${type} candles should close between ${percents[ix][0]}% and ${percents[ix][1]}% of the range of the candle.`
        } )
        return memo
      }, [] )

      messages.push( {
        name: 'standard',
        text: 'Draw a price line and click Generate to build the candle'
      } )
      messages.push( {
        name: 'correct',
        text: 'Great!'
      } )

      return messages
    },
    evaluateCandles( ix, val ) {
      const candle = val[ 0 ]
      const closePercent = ( candle.close - candle.low ) / ( candle.high - candle.low )
      const color = candle.open > candle.close ? 'red' : 'green'
      const very = closePercent > 0.8 || closePercent < 0.2 ? 'very' : ''
      const sentiment = `${very}${closePercent > 0.6 ? 'bullish' : (closePercent < 0.4 ? 'bearish' : 'neutral')}`
      const pattern = this.patterns[ ix ]
      const correct = pattern.color === color && pattern.type === sentiment

      pattern.feedback = [ `${pattern.type}${pattern.color}`, `${correct ? 'right' : 'wrong'}${sentiment}${color}` ]

      if ( correct ) {
        pattern.correct = true
        pattern.feedback.push( 'correct' )
      } else {
        pattern.correct = false
        pattern.feedback.push( `hint${pattern.type}` )
      }

      this.patterns = this.patterns.map( pattern => pattern )

    }
  }
}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

.candle-generator {

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

    .sketchpad-btns {
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        margin-bottom: 30px;

        .btn-group {
            width: 240px;
            align-self: center;
        }
    }

    .generator {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex-wrap: wrap;

        .candle-chart {
            width: 100%;
            margin-bottom: 30px;

            @media(min-width: 992px) {
                width: 70%;
                margin-right: 25px;
                margin-bottom: 0;
            }

        }

        .chart-controls {
            width: 100%;

            @media(min-width: 992px) {
                width: calc(30% - 25px);
            }

            > div {
                margin-bottom: 35px;

                label {
                    display: block;
                    width: 100%;
                    font-weight: 600;
                    font-size: 1.1rem;
                    text-transform: uppercase;
                    text-align: center;
                    margin-bottom: 15px;
                }

                .vue-slider {
                    width: calc(100% - 20px) !important;
                    margin: 0 auto;

                    .vue-slider-dot-handle {
                        width: 40px;
                        height: 40px;
                        position: relative;
                        top: -13px;
                        text-align: center;
                        line-height: 40px;
                        font-size: 36px;
                        transform: rotate(90deg);

                        &:before {
                            content: "\e90f";
                            font-family: "custom-icons";
                            color: $dark-blue;
                        }
                    }

                    .vue-slider-rail {
                        height: 12px;
                        background: lighten($dark-blue, 3%);
                        border: 1px solid lighten($dark-blue, 15%);
                        border-radius: 0;
                    }

                    .vue-slider-process {
                        background: none;
                    }
                }

            }

            .form-control {
                color: #fff;
                background: lighten($dark-blue, 3%);
                border: 1px solid lighten($dark-blue, 15%);
            }
        }
    }

}

.export-header {
    text-align: center;
    margin-top: 30px;
    text-transform: uppercase;
    font-size: 1.3rem;
}

.export-json {
    width: 100%;
    border-radius: 8px;
}

.dark {
    .candle-generator {
        .sketchpad {
            border: 1px solid lighten($dark-blue, 17%);
        }
    }

    .export-json {
        background: lighten($dark-blue, 3%);
        border: 1px solid lighten($dark-blue, 17%);
        color: #fff;
    }
}

.light {
    .candle-generator {
        .sketchpad {
            border: 1px solid #bbbbbb;
        }

        .generator {
            .chart-controls {
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

                .form-control {
                    color: $light-text-color;
                    background: #ffffff;
                    border: 1px solid #bbbbbb;
                }
            }

        }
    }

    .export-json {
        background: #fff;
        border: 1px solid #bbbbbb;
        color: $light-text-color;
    }
}

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

.instructions {
    font-size: 1.1rem;
    margin-bottom: 15px;
    text-align: left;
    font-weight: 600;
}
</style>
