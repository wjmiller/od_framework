<template lang="html">
  <div class="custom-balance-game container">
    <b-row>
      <b-col xs="3"> Buy {{ displayBuyOrders }} </b-col>
      <b-col xs="3"> {{ displayPrice }} </b-col>
      <b-col xs="3"> Sell {{ displaySellOrders }} </b-col>
      <b-col xs="3"> {{ levelTime }} </b-col>
    </b-row>
    <b-row>
      <b-col xs="6"><button v-on:click="increment(1)" v-bind:disabled="!activeLevel"> + </button></b-col>
      <b-col xs="6"><button v-on:click="increment(-1)" v-bind:disabled="!activeLevel"> - </button></b-col>
    </b-row>
    <b-row>
      <b-col xs="12"><button v-on:click="startLevel()" v-bind:disabled="activeLevel"> Start Level {{level + 1}}</button></b-col>
    </b-row>
    <ul v-if="activeLevel">
      <li>{{ priceDiff }}, {{ordersFilled}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'custom-balance-game',
  data() {
    return {
      level: 0, //current level
      levelTime: 0, //current time of level
      levelTimeEnd: 60, //time ends at this point for each level, represents how many ticks will
      startingPrice: 5000, //default level price
      price: 5000, //current price, set as integer for two decimal places on display
      targetPrice: 0, //level-specific target price
      tick: 1000, //milliseconds, how often orders will be processed and new orders will appear,
      avgOrdersPerTick: 10,
      ordersFilled: 0, //current number of orders filled
      orders: { //current number of orders
        buy: 0,
        sell: 0
      },
      filled: { //current number of filled orders
        buy: 0,
        sell: 0
      },
      unfilled: { // current number of unfilled orders
        buy: 0,
        sell: 0
      },
      levels: [ {
          level: 1,
          ticks: [],
          active: false,
          targetPrice: 3.0
        },
        {
          level: 2,
          ticks: [],
          active: false,
          targetPrice: 1.0
        },
        {
          level: 3,
          ticks: [],
          active: false,
          targetPrice: 0.5
        },
        {
          level: 4,
          ticks: [],
          active: false,
          targetPrice: 0.2
        },
        {
          level: 5,
          ticks: [],
          active: false,
          targetPrice: 1.3
        }
      ]
    }
  },
  methods: {
    startTimer() {
      this.$options.timerInterval = setInterval( () => {
        this.levelTime++
      }, this.tick )
    },
    increment( num ) {
      this.price = Math.max( 1, this.price + ( num * 100 ) )
    },
    startLevel() {
      this.levelCountdown = 0
      if ( this.level + 1 < this.maxLevels ) {
        this.level++
        if ( this.level === 1 ) this.price = this.startingPrice
        this.levels.find( level => level.level === this.level ).active = true
        this.setLevelData()
        this.startTimer()
      }
    },
    endLevel() {
      clearInterval( this.$options.timerInterval )
      this.setTick()
      this.activeLevel.active = false
    },
    setTick() {
      //calc processed and remaining orders
      const ordersToFill = Math.min( this.orders.buy, this.orders.sell )
      const totalFilled = ordersToFill * 2
      const lastTick = this.previousTick

      this.filled.buy = ordersToFill
      this.filled.sell = ordersToFill

      this.unfilled.buy = this.orders.buy - ordersToFill
      this.unfilled.sell = this.orders.sell - ordersToFill

      const data = {
        price: this.price / 100,
        orders: {
          buy: this.orders.buy,
          sell: this.orders.sell
        },
        filled: {
          buy: this.filled.buy,
          sell: this.filled.sell
        },
        unfilled: {
          buy: this.unfilled.buy,
          sell: this.unfilled.sell
        }
      }
      //eslint-disable-next-line
      console.log( JSON.stringify( data ) )
      //push data to activeLevel
      this.activeLevel.ticks.push( data )

      //flush filled orders and add new orders
      this.ordersFilled = this.ordersFilled + totalFilled

      if ( this.levelTime !== this.levelTimeEnd ) {
        const recentTick = this.previousTick
        const priceChange = recentTick && lastTick ? recentTick.price - lastTick.price : 0
        this.orders.buy = this.tickBuyOrders + this.orders.buy - ordersToFill + ( priceChange < 0 ? Math.abs( priceChange ) : 0 )
        this.orders.sell = this.tickSellOrders + this.orders.sell - ordersToFill + ( priceChange > 0 ? priceChange : 0 )
      } else {
        this.orders.buy -= ordersToFill
        this.orders.sell -= ordersToFill
      }
    },
    setLevelData() {
      this.targetPrice = this.startingPrice * this.activeLevel.targetPrice
      this.ordersFilled = 0
      this.levelTime = 0
    }
  },
  computed: {
    displayPrice() {
      return ( this.price / 100 ).toFixed( 2 )
    },
    displayBuyOrders() {
      return `${this.orders.buy}`
    },
    displaySellOrders() {
      return `${this.orders.sell}`
    },
    maxLevels() {
      return this.levels.length
    },
    activeLevel() {
      return this.levels.find( level => level.active )
    },
    ticksLeft() {
      return Math.max( 1, this.levelTimeEnd - this.levelTime )
    },
    priceDiff() {
      return this.targetPrice / this.price
    },
    avgBuyOrders() {
      return Math.floor( this.avgOrdersPerTick / ( this.priceDiff + 1 ) * this.priceDiff )
    },
    avgSellOrders() {
      return this.avgOrdersPerTick - this.avgBuyOrders
    },
    tickBuyOrders() {
      return Math.floor( Math.random() * ( this.avgBuyOrders + 1 ) )
    },
    tickSellOrders() {
      return Math.floor( Math.random() * ( this.avgSellOrders + 1 ) )
    },
    previousTick() {
      return this.activeLevel ? this.activeLevel.ticks[ this.activeLevel.ticks.length - 1 ] : null
    }
  },
  watch: {
    levelTime() {
      this.setTick()
      if ( this.levelTime === this.levelTimeEnd ) {
        this.endLevel()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
