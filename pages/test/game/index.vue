<template>
<b-container>
  <b-row>
    <b-col md="12"
           lg="6">
      <custom-balance-game />
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
      startActivated: true
    }
  },
  components: {
    CustomBalanceGame
  }
}
</script>

<style lang="scss" scoped>
</style>
