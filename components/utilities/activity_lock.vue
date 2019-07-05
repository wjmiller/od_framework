<template lang="html">
  <div class="locked-bg" v-bind:class="{'unlocked':!locked}">
    <div class="lock"></div>
  </div>
</template>

<script>
export default {
  props: {
    locked: {
      type: Boolean,
      default: false
    },
    data: {
      default: null
    }
  }
}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

.locked-bg {
    position: absolute;
    top: 0;
    bottom: 0;
    right: -6px;
    left: -6px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    z-index: 1010;

    &.unlocked {
        display: none;
    }

    .lock {
        font-size: 6rem;
        align-self: center;

        &:before {
            content: "\f023";
            font-family: "custom-icons";
        }
    }
}

.dark {
    .locked-bg {
        background: rgba(25,28,44, 0.75);

        .lock {
            color: $gold;
            opacity: 0.6;
        }
    }
}

.light {
    .locked-bg {
        background: rgba(255,255,255,0.75);

        .lock {
            color: darken($gold, 18%);
            opacity: 0.6;
        }
    }
}
</style>
