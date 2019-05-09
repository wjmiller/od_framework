<template>
<b-container>
  <b-row>
    <b-col md="12"
           lg="6">
      <b-btn v-on:click="toggleGame">Open Game</b-btn>
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
import CustomBalanceGame from '~/components/activities/custom/balance_game/balance_game'

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



</style>
