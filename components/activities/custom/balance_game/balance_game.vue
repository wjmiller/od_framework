<template>
<div class="fullscreen">
  <div class="custom-balance-game container-fluid"
       v-bind:class="{'level-over': levelOver}"
       ref="game">
    <b-row>
      <b-btn variant="link"
             v-on:click="closeGame"
             class="close-btn"><i class="icon-close"
           aria-label="close"></i></b-btn>
    </b-row>
    <!--
    <b-row>
      <b-col>
        <h2>Balance Price Game</h2>
      </b-col>
    </b-row>
  -->
    <b-row>
      <b-col class="game-toolbar">

        <div class="game-timer">
          <no-ssr>
            <vac ref="gameTimer"
                 v-bind:left-time="levelTimeEnd * tick"
                 v-bind:auto-start="false">
              <span slot="before">00:00</span>
              <span slot="process"
                    slot-scope="{ timeObj }">{{ `${timeObj.m}:${timeObj.s}` }}</span>
              <span slot="finish">Level Finished!</span>
            </vac>
          </no-ssr>
        </div>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="7">
        <div class="orders">
          <div class="orders-buy">
            <h3>Unfilled Buy</h3>
            <span class="unfilled-label">{{processed.unfilled.buy}}</span>
            <transition-group name="drop-unfilled"
                              class="unfilled"
                              tag="ul">
              <li v-for="order in processed.unfilled.buy"
                  v-bind:key="'unfilled-buy-' + order"></li>
            </transition-group>
            <transition-group name="drop-filled"
                              class="filled"
                              tag="ul">

              <li v-for="order in processed.filled.buy"
                  v-bind:key="'filled-buy-' + order"></li>
            </transition-group>
            <h3>Filled Buy</h3>
            <span class="filled-label">{{processed.filled.buy}}</span>
          </div>
          <div class="orders-sell">
            <h3>Unfilled Sell</h3>
            <span class="unfilled-label">{{processed.unfilled.sell}}</span>
            <transition-group name="drop-unfilled"
                              class="unfilled"
                              tag="ul">
              <li v-for="order in processed.unfilled.sell"
                  v-bind:key="'unfilled-sell-' + order"></li>
            </transition-group>
            <transition-group name="drop-filled"
                              class="filled"
                              tag="ul">

              <li v-for="order in processed.filled.sell"
                  v-bind:key="'filled-sell-' + order"></li>
            </transition-group>
            </ul>
            <h3>Filled Sell</h3>
            <span class="filled-label">{{processed.filled.sell}}</span>
          </div>
        </div>
      </b-col>
      <b-col cols="5">
        <div class="price-controls">
          <h3>Price</h3>
          <span>{{displayPrice}}</span>
          <div>
            <b-btn variant="info"
                   v-on:click="increment(-1)"
                   v-bind:disabled="!levelIsActive">
              <fa :icon="['fas', 'minus']"
                  aria-label="lower price" />
            </b-btn>
            <b-btn variant="info"
                   v-on:click="increment(1)"
                   v-bind:disabled="!levelIsActive">
              <fa :icon="['fas', 'plus']"
                  aria-label="raise price" />
            </b-btn>
          </div>
          <b-btn v-on:click="startLevel()"
                 v-bind:disabled="levelIsActive"> Start Level {{level + 1}}</b-btn>
        </div>
      </b-col>
    </b-row>
  </div>
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
      levelOver: false,
      startingPrice: 10000, //default level price
      price: 10000, //current price, set as integer for two decimal places on display
      targetPrice: 0, //level-specific target price
      tick: 2000, //milliseconds, how often orders will be processed and new orders will appear,
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
      processed: {
        filled: {
          buy: 0,
          sell: 0
        },
        unfilled: {
          buy: 0,
          sell: 0
        }
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
    init() {
      const starterData = {
        target: {
          window: {
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
          }
        }
      }

      this.handleResize( starterData )
    },
    handleResize( event ) {

      const scale = Math.min(
        event.target.window.innerWidth / this.$refs.game.clientWidth,
        event.target.window.innerHeight / this.$refs.game.clientHeight
      )

      this.$refs.game.style.transform = "translate(-50%, -50%) " + "scale(" + scale + ")"
    },
    closeGame() {
      this.$emit( 'close' )
    },
    startTimer() {
      this.$refs.gameTimer.startCountdown( 'restart' )
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

        this.levelOver = false;
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
      this.setProcessed(data)

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
    setProcessed() {
      this.processed.unfilled.buy = this.orders.buy
      this.processed.unfilled.sell = this.orders.sell
      setTimeout(() => {
        this.processed.unfilled.buy = this.unfilled.buy
        this.processed.unfilled.sell = this.unfilled.sell
        this.processed.filled.buy = this.filled.buy
        this.processed.filled.sell = this.filled.sell
      }, this.tick/2)
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
    },
    levelIsActive() {
      return this.activeLevel ? true : false
    }
  },
  watch: {
    levelTime() {
      this.setTick()
      if ( this.levelTime === this.levelTimeEnd ) {
        this.levelOver = true;
        this.endLevel()
      }
    }
  },
  mounted: function () {
    window.addEventListener( 'resize', this.handleResize )
    this.init()
  },
  beforeDestroy: function () {
    window.removeEventListener( 'resize', this.handleResize )
  }
}
</script>

<style lang="scss" scoped>
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';
@import '~assets/scss/mixins.scss';

.fullscreen {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1400;
}

.custom-balance-game {
    width: 1600px;
    height: 900px;
    padding: 0 4rem;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transform-origin: center center;
    z-index: 1400;
    font-size: 2.4rem;

    &.level-over {
        .game-toolbar {
            .game-timer {
                color: #fff;

                &:before {
                    content: "";
                    margin-right: 0;
                }
            }
        }

        .orders {
            .orders-buy {
                opacity: 0.5;
            }

            .orders-sell {
                opacity: 0.5;
            }
        }
    }

    .row:first-child {
        display: flex;
        justify-content: flex-end;

        .close-btn {
            margin-top: 15px;
            margin-right: 20px;
            font-size: 9rem;
        }
    }

    h2 {
        font-size: 3.2rem;
    }

    h3 {
        font-size: 2.2rem;
        text-align: center;
    }

    .game-toolbar {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin: 1.5rem 0 6rem;

        .game-timer {
            align-self: center;
            font-weight: 600;
            font-size: 3rem;

            &:before {
                content: "\e90e";
                font-family: "custom-icons";
                margin-right: 0.6rem;
                position: relative;
                top: 0.15rem;
            }
        }
    }

    .orders {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-bottom: 7rem;

        .orders-buy,
        .orders-sell {
            width: 280px;
            margin-right: 30px;
            position: relative;

            span {
                position: absolute;
                left: 107px;
                width: 66px;
                height: 50px;
                border: 4px solid #2B314D;
                background: #22263C;
                line-height: 22px;
                font-size: 30px;
                font-weight: 600;
                text-align: center;
                padding-top: 10px;
                border-radius: 25px;
            }

            span.unfilled-label {
                top: 100px;
            }

            span.filled-label {
                top: 325px;
            }

            ul {
                display: flex;
                list-style-type: none;
                height: 200px;
                padding: 0;
                overflow: hidden;
                margin-bottom: 0;

                li {
                    width: 100%;
                    height: 8px;
                    margin-bottom: 5px;
                }
            }

            ul.unfilled {
                flex-direction: column-reverse;
                justify-content: flex-start;
                border-bottom: 8px solid #fff;

                li {}
            }

            ul.filled {
                margin-top: 5px;
                flex-direction: column;
                justify-content: flex-start;
            }
        }

        .orders-buy {
            ul.filled li,
            ul.unfilled li {
                background: $green;
            }

            ul.filled li {
                opacity: 0.6;
            }
        }

        .orders-sell {
            ul.filled li,
            ul.unfilled li {
                background: $red;
            }

            ul.filled li {
                opacity: 0.6;
            }
        }
    }

    .price-controls {
        display: flex;
        flex-direction: column;
        justify-content: center;

        h3 {
            align-self: center;
            margin-bottom: 8.5rem;
        }

        span {
            display: block;
            align-self: center;
            font-size: 4.5rem;
            font-weight: 600;
            margin-bottom: 4rem;
        }

        div {
            align-self: center;
            margin-bottom: 2.5rem;

            button {
                font-size: 3rem;
                padding: 0.8rem 1.8rem;
                @include game-button();

                &:first-child {
                    margin-right: 1rem;
                }

            }
        }

        > button {
            align-self: center;
            font-size: 1.8rem;
            border-radius: 2.5rem;
            padding: 1rem 1.6rem;
            color: #fff;
            font-weight: 600;
            @include game-button();

            //margin-right: 2.3rem;

            &:after {
                content: "\e037";
                font-family: "custom-icons";
                margin-left: 0.5rem;
                position: relative;
                top: 0.07rem;
                //font-size: 1.2rem;
            }
        }

    }

    @media(min-width: 500px) {
        font-size: 2.4rem;

    }

    @media(min-width: 900px) {
        font-size: 2rem;

        h2 {
            font-size: 2.8rem;
        }

        h3 {
            font-size: 1.8rem;
        }

        .row:first-child {
            .close-btn {
                font-size: 4.5rem;
            }
        }

    }

    @media(min-width: 1200px) {
        .price-controls {
            button {
                font-size: 1.4rem;
            }
        }
    }

    @media(min-width: 1400px) {
        font-size: 1.6rem;
    }

}

.drop-unfilled-enter-active {
    transition: all 0.3s ease;
}
.drop-unfilled-leave-active {
    transition: all 0.3s ease;
}

.drop-unfilled-enter {
    transform: translateY(-200px);
    opacity: 0;
}

.drop-unfilled-leave-to {
    opacity: 0;
}

.drop-filled-enter-active {
    transition: all 0.3s ease;
}
.drop-filled-leave-active {
    transition: all 0.5s ease;
}

.drop-filled-enter {
    transform: translateY(-50px);
    opacity: 0;
}

.drop-filled-leave-to {
    transform: translateY(250px);
    opacity: 0;
}

.dark {
    .fullscreen {
        background: $dark-body-bg;
    }
}

.light {
    .fullscreen {
        background: #fff;
    }
}
</style>
