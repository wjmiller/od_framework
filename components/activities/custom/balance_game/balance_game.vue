<template lang="html">
  <div class="custom-balance-game container">
    <b-row>
      <b-col xs="3"> Buy {{ unfilled.buy }} </b-col>
      <b-col xs="3"> {{ displayPrice }} </b-col>
      <b-col xs="3"> Sell {{ unfilled.sell }} </b-col>
      <b-col xs="3"> {{ levelTime }} </b-col>
    </b-row>
    <b-row>
      <b-col xs="6"><button v-on:click="increment(-1)" v-bind:disabled="!activeLevel"> - </button></b-col>
      <b-col xs="6"><button v-on:click="increment(1)" v-bind:disabled="!activeLevel"> + </button></b-col>
    </b-row>
    <b-row>
      <b-col xs="12"><button v-on:click="startLevel()" v-bind:disabled="activeLevel"> Start Level {{level + 1}}</button></b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: 'custom-balance-game',
  data() {
    return {
      level: 0, //current level
      levelTime: 1, //current time of level
      levelTimeEnd: 60, //time ends at this point for each level, represents how many ticks will
      startingPrice: 10000, //default level price
      price: 10000, //current price, set as integer for two decimal places on display
      targetPrice: 0, //level-specific target price
      tick: 1500, //milliseconds, how often orders will be processed and new orders will appear,
      avgOrdersPerTick: 10,
      ordersFilled: 0, //current number of orders filled
      emotionalReaction: 0.8, //ratio that provides opposite orders, for example, if a big increase in price because no one is selling, then sell orders are added: price change * emotionalReaction
      autoPricer: false, //way to turn on the automatic pricer for those who don't want to play the game
      autoPricerSpeed: 4, //clicks to change price per tick
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
      levels: [
        {
          level: 1,
          ticks: [],
          active: false,
          targetPrice: 3.0,
          candleData: []
        },
        {
          level: 2,
          ticks: [],
          active: false,
          targetPrice: 1.0,
          candleData: []
        },
        {
          level: 3,
          ticks: [],
          active: false,
          targetPrice: 0.5,
          candleData: []
        },
        {
          level: 4,
          ticks: [],
          active: false,
          targetPrice: 0.2,
          candleData: []
        },
        {
          level: 5,
          ticks: [],
          active: false,
          targetPrice: 1.3,
          candleData: []
        }
      ]
    }
  },
  methods: {
    startTimer() {
      this.$options.timerInterval = setInterval( () => {
        if ( this.autoPricer ) {
          this.autoPrice()
        }
        this.levelTime++
      }, this.tick )
    },
    increment( num ) {
      this.price = Math.max( 1, this.price + ( num * 100 ) )
    },
    startLevel() {
      this.levelCountdown = 0
      if ( this.level + 1 <= this.maxLevels ) {
        this.level++
        if ( this.level === 1 ) this.price = this.startingPrice
        this.levels.find( level => level.level === this.level )
          .active = true
        this.setLevelData()
        this.startTimer()
      }
    },
    endLevel() {
      clearInterval( this.$options.timerInterval )
      this.activeLevel.candleData = this.aggregateData( this.segmentTicks( 10 ) )
      this.activeLevel.active = false

      //eslint-disable-next-line
      console.log( JSON.stringify( this.currentLevel.candleData ) )
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

        //new number of orders is random orders + current - orders filled + emotional reaction additions
        this.orders.buy = this.tickBuyOrders() + this.orders.buy - ordersToFill + Math.floor( ( priceChange < 0 ? Math.abs( priceChange ) : 0 ) * this.emotionalReaction )
        this.orders.sell = this.tickSellOrders() + this.orders.sell - ordersToFill + Math.floor( ( priceChange > 0 ? priceChange : 0 ) * this.emotionalReaction )

      } else {
        this.orders.buy -= ordersToFill
        this.orders.sell -= ordersToFill
      }
    },
    setLevelData() {
      this.targetPrice = this.startingPrice * this.activeLevel.targetPrice
      this.ordersFilled = 0
      this.levelTime = 1
    },
    segmentTicks( num ) {
      if ( num <= 0 ) num = 1
      const segmentedTicks = [];
      let allTicks = [ ...this.activeLevel.ticks ]
      const numInArray = Math.ceil( allTicks.length / num )
      for ( let a = 0; a < numInArray; a++ ) {
        segmentedTicks.push( allTicks.splice( 0, num ) )
      }
      return segmentedTicks
    },
    aggregateData( multiArr ) {
      return multiArr.reduce( ( memo, item ) => {
        const prices = item.map( tick => tick.price )
        const filled = item.map( tick => tick.filled )
        const unfilled = item.map( tick => tick.unfilled )

        memo.push( {
          high: Math.max( ...prices ),
          low: Math.min( ...prices ),
          open: prices[ 0 ],
          close: prices[ prices.length - 1 ],
          filled: {
            buy: filled.reduce( ( memo, fillObject ) => fillObject.buy + memo, 0 ),
            sell: filled.reduce( ( memo, fillObject ) => fillObject.sell + memo, 0 )
          },
          unfilled: {
            buy: unfilled.reduce( ( memo, unfillObject ) => unfillObject.buy + memo, 0 ),
            sell: unfilled.reduce( ( memo, unfillObject ) => unfillObject.sell + memo, 0 )
          }
        } )
        return memo;
      }, [] )
    },
    autoPrice() {
      const unfilledDiff = this.unfilled.buy - this.unfilled.sell
      const priceAdjust = ( unfilledDiff < 0 ? -1 : 1 ) * 100

      this.price += ( Math.abs( Math.floor( unfilledDiff / 2 ) ) + Math.floor( Math.random() * 2 ) ) * priceAdjust
    },
    tickBuyOrders() {
      return Math.floor( Math.random() * ( this.avgBuyOrders + 1 ) )
    },
    tickSellOrders() {
      return Math.floor( Math.random() * ( this.avgSellOrders + 1 ) )
    }
  },
  computed: {
    displayPrice() {
      return ( this.price / 100 )
        .toFixed( 2 )
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
    currentLevel() {
      return this.levels.find( level => this.level === level.level )
    },
    ticksLeft() {
      return Math.max( 1, this.levelTimeEnd - this.levelTime )
    },
    priceDiff() {
      return this.targetPrice / this.price
    },
    avgBuyOrders() {
      return Math.ceil( this.avgOrdersPerTick / ( this.priceDiff + 1 ) * this.priceDiff )
    },
    avgSellOrders() {
      return this.avgOrdersPerTick - this.avgBuyOrders
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
