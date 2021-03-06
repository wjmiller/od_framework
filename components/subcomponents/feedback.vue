<template lang="html">
  <div class="feedback">
    <b-button
      v-if="!auto"
      v-bind:disabled="!activated"
      v-on:click="revealFeedback">{{ buttonTitle }}
    </b-button>
    <div class="feedback-messages">
      <transition-group name="messages" tag="p" v-if="displayOn">
      <div class="feedback-message"
        v-for="message in displayedMessages"
        v-bind:key="message.name"
        v-bind:class="message.name">
        <div>
          <slot name="message" v-bind:message="message">
            <!-- Fallback content -->
            {{ message.text }}
          </slot>
        </div>
      </div>
    </transition-group>
    <div class="feedback-inactive" v-if="!activated">
      <fa :icon="['fas', 'lock']"
          aria-label="locked" />
      {{ inactiveMessage }}
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'feedback-display',
  props: {
    auto: {
      type: Boolean,
      default: false
    },
    activated: {
      type: Boolean,
      default: false
    },
    displayed: {
      type: Array, // [ String, …] matching name of messages to be displayed sorted in order to display
      default () {
        return []
      }
    },
    messages: {
      type: Array, //Array of objects with properties { name: String, text: String }
      default () {
        return []
      }
    },
    buttonTitle: {
      type: String,
      default: "Compare Responses"
    },
    inactiveMessage: {
      type: String,
      default: "Feedback Locked"
    }
  },
  data() {
    return {
      defaultMessages: [ {
        name: 'default-correct',
        text: 'Correct'
      }, {
        name: 'default-incorrect',
        text: 'Incorrect'
      } ],
      revealed: false
    }
  },
  methods: {
    revealFeedback() {
      if ( this.activated ) {
        this.revealed = true
      }
    }
  },
  computed: {
    allMessages() {
      return [].concat( this.messages.length > 0 ? this.messages : this.defaultMessages )
    },
    displayOn() {
      return this.activated && ( this.auto || this.revealed )
    },
    displayedMessages() {
      return this.displayed.reduce( ( memo, item ) => {
        const message = this.allMessages.find( msg => msg.name === item )
        if ( message ) memo.push( message )
        return memo
      }, [] )
    }
  },
  watch: {
    displayedMessages() {
      if ( !this.auto ) {
        this.revealed = false
      }
    },
    displayOn() {
      this.$emit( 'feedback-display', this.displayOn )
    }
  }
}
</script>

<style lang="scss">
//------------------------------------------------------
// Import Variables
//------------------------------------------------------

@import '~assets/scss/variables.scss';

//------------------------------------------------------
// Import Variables
//------------------------------------------------------

.feedback {
    margin-bottom: 1.5rem;
    max-width: 900px;
    width: 100%;

    button {
        display: block;
        width: 100%;
    }

    .feedback-messages {
        position: relative;
        border-radius: $border-radius;
        padding: 0.7rem 1rem;
    }

    .feedback-message,
    .feedback-overlay {
        font-size: 1rem;
    }

    @media(min-width: 576px) {
        margin-top: 0;

    }

    .feedback-inactive {
        svg {
            margin-right: 8px;
        }
    }
}

// Dark/Light Theme Styles -----------------------------

.dark {
    .feedback {
        .feedback-messages {
            background-color: darken($dark-pane-bg, 2%);
            border: 1px solid $dark-pane-border;
            color: $dark-text-color;
        }

        .feedback-inactive {
            color: $gold;
        }
    }
}

.light {

    .feedback {
        .feedback-messages {
            background: $light-pane-bg;
            border: 1px solid $light-pane-border;
            color: $light-text-color;
        }

        .feedback-inactive {
            color: darken($gold, 18%);
            svg {
                color: darken($gold, 10%);
            }
        }
    }
}
</style>
