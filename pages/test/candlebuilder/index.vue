<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Candle Builder</nuxt-link>
    </b-col>
  </b-row>
  <activity-group v-for="(activity, index) in data.activities"
                  v-bind:key="`act-group-${index}`"
                  v-bind:activity-id="`${activity.id}`"
                  v-bind:activity="activity"
                  v-bind:theme="theme" />
</b-container>
</template>

<script>
import ActivityGroup from '~/components/activities/activity_group'
import AppData from '~/assets/data/app_data.js'

import {
  mapGetters
} from 'vuex'

// Create candle data from prices
AppData.activities.forEach( activity => activity.candles.forEach( candle => {
  const prices = candle.candlechart.cdata.pricePoints;
  const close = prices.slice( -1 )[ 0 ] // Get last item in array
  const open = prices[ 0 ]; // First item in array
  candle.candlechart.csdata = {
    open: open,
    close: close,
    high: Math.max( ...prices ),
    low: Math.min( ...prices ),
    candleRed: open > close // If open > close then it means the price is falling
  }
} ) );

export default {
  data() {
    return {
      data: AppData
    }
  },
  computed: {
    ...mapGetters( [ 'getUserPrefs' ] ),
    theme() {
      return this.getUserPrefs.theme_dark ? 'dark' : 'light'
    }
  },
  components: {
    ActivityGroup
  }
}
</script>

<style lang="scss">
</style>
