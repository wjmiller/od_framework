<template>
<b-row class="unfilled-slider">
  <b-col class="unfilled-orders">
    <div class="unfilled-orders-cont">
      <div>
        <span v-if="labels"
              class="order-label">Buy Orders</span>
        <span v-if="buyOrders === 0"
              class="order-none">0</span>
        <ul>
          <li v-for="(buyOrder, ix) in buyOrders"
              v-bind:key="'buy-' + ix"><span v-if="labels">{{buyOrderLabel}}</span></li>
        </ul>
      </div>
      <div>
        <span v-if="labels"
              class="order-label">Sell Orders</span>
        <span v-if="sellOrders === 0"
              class="order-none">0</span>
        <ul>
          <li v-for="(sellOrder, ix) in sellOrders"
              v-bind:key="'sell-' + ix"><span v-if="labels">{{sellOrderLabel}}</span></li>
        </ul>
      </div>
    </div>
  </b-col>
  <b-col class="price">
    <div class="price-slider-cont">
      <div class="price-slider">
        <vue-slider v-model="price"
                    v-bind:direction="'btt'"
                    v-bind:process="process"
                    v-bind:min="'-5'"
                    v-bind:max="'5'"
                    v-bind:height="'100%'"
                    v-bind:tooltip="'none'"
                    v-on:change="calcOrders()"
                    v-bind:class="{'price-up':price > 0, 'price-down':price < 0}"></vue-slider>
      </div>
      <span class="price-label"
            v-if="labels">Price <i v-bind:class="{'price-up':price > 0, 'price-down':price < 0}"></i></span>
    </div>
  </b-col>
</b-row>
</template>

<script>
export default {
  name: 'unfilled-slider',
  props: [ 'labels' ],
  data() {
    return {
      buyOrderLabel: 'Buy 100M',
      sellOrderLabel: 'Sell 100M',
      process: dotsPos => [ [ 50, dotsPos[ 0 ] ] ],
      buyOrders: 0,
      sellOrders: 0,
      price: 0
    }
  },
  methods: {
    calcOrders() {
      if ( this.price > 0 ) {
        this.buyOrders = this.price
        this.sellOrders = 0
      } else if ( this.price < 0 ) {
        this.sellOrders = - +this.price
        this.buyOrders = 0
      } else {
        this.buyOrders, this.sellOrders = 0
      }
    }
  }
}
</script>

<style lang="scss" >
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

.unfilled-slider {
    margin-bottom: 100px;

    .unfilled-orders {
        display: flex;
        justify-content: space-around;
        flex-direction: row;
        margin-bottom: 30px;

        @media(min-width: 768px) {
            justify-content: flex-start;
        }

        .unfilled-orders-cont {
            display: flex;
            justify-content: flex-start;
            flex-direction: row;

            > div {
                position: relative;

                &:first-child {
                    margin-right: 20px;

                    @media(min-width: 768px) {
                        margin-right: 30px;
                    }
                }

                .order-label {
                    display: block;
                    font-size: 20px;
                    font-weight: 600;
                    text-align: center;
                    text-transform: uppercase;
                }

                .order-none {
                    display: block;
                    position: absolute;
                    bottom: 30px;
                    width: 100%;
                    font-size: 50px;
                    font-weight: 600;
                    text-align: center;
                }

                ul {
                    list-style-type: none;
                    display: flex;
                    flex-direction: column-reverse;
                    justify-content: flex-start;
                    height: 220px;
                    margin: 0;
                    padding: 0;
                    width: 130px;

                    @media(min-width: 768px) {
                        width: 160px;
                    }

                    li {
                        color: #fff;
                        font-weight: 600;
                        margin-bottom: 10px;
                        height: 30px;
                        width: 100%;
                        font-size: 19px;
                        line-height: 30px;
                        text-align: center;
                        text-transform: uppercase;
                    }
                }
            }
        }
    }

    .price {
        display: flex;
        flex-direction: row;
        justify-content: space-around;

        .price-slider-cont {
            display: flex;
            flex-direction: row;
            justify-content: flex-start;
            height: 265px;

            .price-slider {
                height: 80%;
                width: 160px;
                margin: 15px 10px 0 0;

                .vue-slider {
                    width: 100% !important;
                    padding: 0 !important;

                    .vue-slider-rail {
                        border-radius: 0 !important;
                        background: none !important;
                    }

                    .vue-slider-process {
                        border-radius: 0 !important;
                        background: none !important;
                    }

                    &.price-up {
                        .vue-slider-process {
                            background: $green !important;
                        }
                    }

                    &.price-down {
                        .vue-slider-process {
                            background: $red !important;
                        }
                    }

                    .vue-slider-dot {
                        width: 100%;

                        .vue-slider-dot-handle {
                            position: relative !important;
                            top: -23px !important;
                            width: 50px !important;
                            height: 50px !important;
                            left: -17px !important;
                            text-align: center;
                            z-index: 1300;
                            border: 6px solid lighten($dark-gray-med, 30%);

                            &:before {
                                content: "\e90f";
                                font-family: 'custom-icons';
                                color: lighten($dark-gray-med, 30%);
                                font-size: 40px;
                                line-height: 38px;
                            }
                        }

                        &:before {
                            content: '';
                            display: block;
                            position: relative;
                            top: 4px;
                            left: -73px;
                            width: 80px;
                            height: 6px;
                            background: lighten($dark-gray-med, 30%);
                        }

                        &:after {
                            content: '';
                            display: block;
                            position: relative;
                            top: -52px;
                            left: 7px;
                            width: 80px;
                            height: 6px;
                            background: lighten($dark-gray-med, 30%);
                        }
                    }
                }
            }

            > span {
                display: block;
                align-self: center;
                width: 120px;
                font-size: 1.5rem;
                font-weight: 600;
                margin-left: 10px;

                i {
                    &:before {
                        content: "";
                        font-size: 1.6rem;
                        margin-left: 2px;
                        font-style: normal;
                        font-family: 'custom-icons';
                        position: relative;
                        top: 3px;
                    }

                    &.price-up {
                        &:before {
                            content: "\e907";
                        }
                    }

                    &.price-down {
                        &:before {
                            content: "\e904";
                        }
                    }
                }
            }

        }
    }

}

.dark {
    .unfilled-slider {
        .unfilled-orders {
            div:nth-child(1) {
                ul {
                    li {
                        background: $green;
                    }
                }
            }

            div:nth-child(2) {
                ul {
                    li {
                        background: $red;
                    }

                }
            }
        }
    }
}

.light {
    .unfilled-slider {
        .unfilled-orders {
            div:nth-child(1) {
                ul {
                    li {
                        background: $green;
                    }
                }
            }

            div:nth-child(2) {
                ul {
                    li {
                        background: $red;
                    }
                }
            }
        }

        .price {
            .price-slider-cont {
                .price-slider {
                    .vue-slider {
                        .vue-slider-dot {

                            .vue-slider-dot-handle {
                                border: 6px solid lighten($light-gray-med-dark, 10%);

                                &:before {
                                    color: lighten($light-gray-med-dark, 10%);
                                }
                            }

                            &:before {
                                background: lighten($light-gray-med-dark, 10%);
                            }

                            &:after {
                                background: lighten($light-gray-med-dark, 10%);
                            }
                        }

                        &.price-up {
                            .vue-slider-process {
                                background: $green !important;
                            }
                        }

                        &.price-down {
                            .vue-slider-process {
                                background: $red !important;
                            }
                        }
                    }

                }
            }
        }
    }
}
</style>
