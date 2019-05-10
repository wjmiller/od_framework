<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Game</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <h2>Balance Price Game</h2>
      <p style="font-style: italic;">Step in to the shoes of a price setter and adjust price to balance buy and sell orders on trading day.</p>
      <img v-on:click="toggleGame"
           class="game-poster"
           src="~/assets/images/balance_price.png" />
      <transition name="fade">
        <custom-balance-game v-if="gameOpen"
                             v-bind:open="gameOpen"
                             v-on:close="toggleGame" />
      </transition>
    </b-col>
  </b-row>

</b-container>
</template>

<script>
import CustomBalanceGame from '~/components/activities/custom/balance_game'

export default {
  name: 'lesson',
  data() {
    return {
      startActivated: true,
      gameOpen: false
    }
  },
  methods: {
    toggleGame() {
      this.gameOpen = !this.gameOpen
    }
  },
  components: {
    CustomBalanceGame
  }
}
</script>

<style lang="scss" scoped>
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

h2 {
    margin-top: 30px;
}

.game-poster {
    width: 100%;
    max-width: 500px;

    &:hover {
        cursor: pointer;
    }
}
</style>
