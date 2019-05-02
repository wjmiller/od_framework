<template lang="html">
  <div class="feedback">
    <div class="feedback-messages">
      <transition-group name="messages" tag="p" v-if="displayOn">
      <div class="feedback-message"
        v-for="message in displayedMessages"
        v-bind:key="message.name">
        <div>
          <slot name="message" v-bind:message="message">
            <!-- Fallback content -->
            {{ message.name }}: {{ message.text }}
          </slot>
        </div>
      </div>
    </transition-group>
    <div class="feedback-inactive" v-if="!activated">
      {{ inactiveMessage }}
    </div>
    </div>
    <b-button
      variant="primary"
      v-if="!auto"
      v-bind:disabled="!activated"
      v-on:click="revealFeedback">{{ buttonTitle }}
    </b-button>
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
    margin-top: 25px;

    button {
        font-size: 0.95em;
        display: block;
        width: 100%;
    }

    .feedback-display {
        position: relative;
        margin: 20px 0;
        padding: 10px;
        border-radius: $border-radius;
        min-height: 120px;
    }

    .feedback-message,
    .feedback-overlay {
        font-size: 0.95em;
    }

    @media(min-width: 576px) {
        margin-top: 0;

    }
}

// Dark/Light Theme Styles -----------------------------

.dark {
    .feedback {
        .feedback-display {
            background-color: $dark-pane-bg;
            border: 1px solid $dark-pane-border;
            color: $dark-text-color;
        }
    }
}

.light {

    .feedback {
        .feedback-display {
            background: $light-pane-bg;
            border: 1px solid $light-pane-border;
            color: $light-text-color;
        }
    }
}
</style>
