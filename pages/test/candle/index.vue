<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit SVG Candle</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col>
      <candle v-bind:width="candleData.width"
              v-bind:height="candleData.height"
              v-bind:priceHigh="candleData.priceHigh"
              v-bind:priceLow="candleData.priceLow"
              v-bind:spacing="candleData.spacing"
              v-bind:data="candleData.candle"></candle>
      <b-btn class="change-btn"
             v-bind:disabled="btnDisabled"
             v-on:click="changeCandle">Change Candle</b-btn>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import Candle from '~/components/activities/candle'

export default {
  components: {
    Candle
  },
  data() {
    return {
      btnDisabled: false,
      candleData: {
        width: 50,
        height: 200,
        priceHigh: 12,
        priceLow: 0,
        spacing: 50,
        candle: {
          open: 3,
          close: 10,
          high: 12,
          low: 0
        }
      }
    }
  },
  methods: {
    changeCandle() {
      this.candleData = {
        width: 50,
        height: 200,
        priceHigh: 12,
        priceLow: 0,
        spacing: 50,
        candle: {
          open: 8,
          close: 4,
          high: 11,
          low: 1
        }
      }
      this.btnDisabled = true
    }
  }
}
</script>

<style lang="scss">
.change-btn {
    display: block;
    width: 160px;
    margin-top: 20px;
}
</style>
