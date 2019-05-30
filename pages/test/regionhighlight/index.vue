<template>
<b-container>
  <b-row class="btn-row">
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> Exit Region Highlight</nuxt-link>
    </b-col>
  </b-row>
  <b-row>
    <b-col lg="9">
      <p class="question">
        Select a formation type below and adjust its box to contain the matching candle formation in the chart.
      </p>
    </b-col>
  </b-row>
  <region-highlight v-bind:regions="regions1"
                    v-bind:candles="candles"
                    v-bind:time-label="'Time'"
                    v-bind:time-label-interval="2"
                    v-bind:add-region-button="false">
  </region-highlight>
  <div class="spacer"></div>
  <b-row>
    <b-col lg="9">
      <p class="question">
        This activity has no pre-set region types for the learner to set. The learner will add new regions and then edit the locations of the added regions.
      </p>
    </b-col>
  </b-row>
  <region-highlight v-bind:candles="candles"
                    v-bind:region-types="regionTypes"
                    v-bind:time-label="'Time'"
                    v-bind:time-label-interval="2"
                    v-bind:add-region-button="true">
  </region-highlight>
  <div class="spacer"></div>
</b-container>
</template>

<script>
import RegionHighlight from '~/components/activities/custom/region_highlight'

export default {
  components: {
    RegionHighlight
  },
  data() {
    return {
      regions1: [
        {
          label: 'RBR'
        },
        {
          label: 'DBD'
        },
        {
          label: 'DBR'
        }
      ],
      regionTypes: [
        {
          label: 'RBR'
        },
        {
          label: 'RBD'
        },
        {
          label: 'DBR'
        },
        {
          label: 'DBD'
        },
        {
          label: 'Correction'
        },
        {
          label: 'Impulsion'
        },
        {
          label: 'Gap'
        }
      ],
      candles: [
        {
          open: 4,
          close: 2,
          high: 7,
          low: 1,
          label: '09:30'
        },
        {
          open: 2,
          close: 1,
          high: 4,
          low: 1,
          label: '09:45'
        },
        {
          open: 1,
          close: 8,
          high: 10,
          low: 1,
          label: '10:00'
        },
        {
          open: 8,
          close: 9,
          high: 11,
          low: 4,
          label: '10:15'
        },
        {
          open: 9,
          close: 16,
          high: 19,
          low: 8,
          label: '10:30'
        },
        {
          open: 16,
          close: 17,
          high: 23,
          low: 14,
          label: '10:45'
        },
        {
          open: 17,
          close: 15,
          high: 22,
          low: 13,
          label: '11:00'
        },
        {
          open: 15,
          close: 16,
          high: 17,
          low: 12,
          label: '11:15'
        },
        {
          open: 16,
          close: 10,
          high: 16,
          low: 10,
          label: '11:30'
        },
        {
          open: 10,
          close: 11,
          high: 14,
          low: 5,
          label: '11:45'
        },
        {
          open: 11,
          close: 5,
          high: 11,
          low: 1,
          label: '12:00'
        },
        {
          open: 5,
          close: 7,
          high: 10,
          low: 3,
          label: '12:15'
        },
        {
          open: 7,
          close: 6,
          high: 9,
          low: 4,
          label: '12:30'
        },
        {
          open: 6,
          close: 10,
          high: 15,
          low: 4,
          label: '12:45'
        },
        {
          open: 10,
          close: 15,
          high: 18,
          low: 7,
          label: '01:00'
        },
        {
          open: 15,
          close: 20,
          high: 24,
          low: 14,
          label: '01:15'
        },
        {
          open: 20,
          close: 23,
          high: 26,
          low: 17,
          label: '01:30'
        },
        {
          open: 23,
          close: 25,
          high: 27,
          low: 25,
          label: '01:45'
        },
        {
          open: 25,
          close: 24,
          high: 30,
          low: 22,
          label: '02:00'
        },
        {
          open: 24,
          close: 23,
          high: 27,
          low: 21,
          label: '02:15'
        },
        {
          open: 23,
          close: 20,
          high: 26,
          low: 17,
          label: '02:30'
        },
        {
          open: 20,
          close: 13,
          high: 23,
          low: 11,
          label: '02:45'
        },
        {
          open: 13,
          close: 14,
          high: 17,
          low: 10,
          label: '03:00'
        },
        {
          open: 14,
          close: 20,
          high: 22,
          low: 12,
          label: '03:15'
        },
        {
          open: 20,
          close: 22,
          high: 24,
          low: 12,
          label: '03:30'
        },
        {
          open: 22,
          close: 26,
          high: 29,
          low: 20,
          label: '03:45'
        },
        {
          open: 26,
          close: 29,
          high: 29,
          low: 22,
          label: '04:00'
        }
      ]
    }
  }

}
</script>

<style lang="scss" scoped>
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

.spacer {
    margin-bottom: 100px;
}

.question {
    font-size: 1.05rem;
    margin-bottom: 20px;
}
</style>
