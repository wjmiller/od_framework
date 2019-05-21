<template>
<b-row class="unfilled-select">
  <b-col class="unfilled-orders">
    <div class="unfilled-orders-cont">
      <div>
        <span onloadedmetadata=""
              class="order-label"
              v-bind:class="{'active': labels}">Buy Orders</span>
        <ul>
          <li v-on:click="buyPrice(5)"
              v-on:mouseover="buyHover(5)"
              v-on:mouseout="clearOrder()"
              v-bind:class="{'hover': bhover == 5 && bhover > 0, 'active':bprice == 5 && bprice > 0}"><span v-if="labels">{{buyOrderLabel}}</span></li>
          <li v-on:click="buyPrice(4)"
              v-on:mouseover="buyHover(4)"
              v-on:mouseout="clearOrder()"
              v-bind:class="{'hover': bhover >= 4 && bhover > 0, 'active':bprice >= 4 && bprice > 0}"><span v-if="labels">{{buyOrderLabel}}</span></li>
          <li v-on:click="buyPrice(3)"
              v-on:mouseover="buyHover(3)"
              v-on:mouseout="clearOrder()"
              v-bind:class="{'hover': bhover >= 3 && bhover > 0, 'active':bprice >= 3 && bprice > 0}"><span v-if="labels">{{buyOrderLabel}}</span></li>
          <li v-on:click="buyPrice(2)"
              v-on:mouseover="buyHover(2)"
              v-on:mouseout="clearOrder()"
              v-bind:class="{'hover': bhover >= 2 && bhover > 0, 'active':bprice >= 2 && bprice > 0}"><span v-if="labels">{{buyOrderLabel}}</span></li>
          <li v-on:click="buyPrice(1)"
              v-on:mouseover="buyHover(1)"
              v-on:mouseout="clearOrder()"
              v-bind:class="{'hover': bhover >= 1 && bhover > 0, 'active':bprice >= 1 && bprice > 0}"><span v-if="labels">{{buyOrderLabel}}</span></li>
          <li v-on:click="buyPrice(0)"
              v-on:mouseover="buyHover(0)"><span>None</span></li>
        </ul>
      </div>
      <div>
        <span class="order-label"
              v-bind:class="{'active': labels}">Sell Orders</span>
        <ul>
          <li v-on:click="sellPrice(5)"
              v-on:mouseover="sellHover(5)"
              v-on:mouseout="clearOrder()"
              v-bind:class="{'hover': shover == 5 && shover > 0, 'active': -+sprice == 5 && -+sprice > 0}"><span v-if="labels">{{sellOrderLabel}}</span></li>
          <li v-on:click="sellPrice(4)"
              v-on:mouseover="sellHover(4)"
              v-on:mouseout="clearOrder()"
              v-bind:class="{'hover': shover >= 4 && shover > 0, 'active': -+sprice >= 4 && -+sprice > 0}"><span v-if="labels">{{sellOrderLabel}}</span></li>
          <li v-on:click="sellPrice(3)"
              v-on:mouseover="sellHover(3)"
              v-on:mouseout="clearOrder()"
              v-bind:class="{'hover': shover >= 3 && shover > 0, 'active': -+sprice >= 3 && -+sprice > 0}"><span v-if="labels">{{sellOrderLabel}}</span></li>
          <li v-on:click="sellPrice(2)"
              v-on:mouseover="sellHover(2)"
              v-on:mouseout="clearOrder()"
              v-bind:class="{'hover': shover >= 2 && shover > 0, 'active': -+sprice >= 2 && -+sprice > 0}"><span v-if="labels">{{sellOrderLabel}}</span></li>
          <li v-on:click="sellPrice(1)"
              v-on:mouseover="sellHover(1)"
              v-on:mouseout="clearOrder()"
              v-bind:class="{'hover': shover >= 1 && shover > 0, 'active': -+sprice >= 1 && -+sprice > 0}"><span v-if="labels">{{sellOrderLabel}}</span></li>
          <li v-on:click="sellPrice(0)"
              v-on:mouseover="sellHover(0)"><span>None</span></li>
        </ul>
      </div>
    </div>
  </b-col>
  <b-col>
    <div class="btn-container">
      <button v-on:click="setPrice()"
              class="exchange-btn"
              type="button"
              v-bind:disabled="!(sprice !== 0 || bprice !== 0) || exchanged">Exchange</button>
    </div>
  </b-col>
  <b-col class="price">
    <div class="price-slider-cont">
      <div class="price-slider">
        <vue-slider v-model="price"
                    v-bind:direction="'btt'"
                    v-bind:process="process"
                    v-bind:min="-5"
                    v-bind:max="5"
                    v-bind:height="'100%'"
                    v-bind:tooltip="'none'"
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
  name: 'unfilled-select',
  props: [ 'labels' ],
  data() {
    return {
      active: 0,
      bhover: 0,
      bprice: 0,
      shover: 0,
      sprice: 0,
      price: 0,
      exchanged: false,
      buyOrderLabel: 'Buy 100M',
      sellOrderLabel: 'Sell 100M',
      process: dotsPos => [ [ 50, dotsPos[ 0 ] ] ],
      buyOrders: 0,
      sellOrders: 0
    }
  },
  methods: {
    buyPrice( n ) {
      this.reset()
      this.bprice = n;
    },
    sellPrice( n ) {
      this.reset()
      this.sprice = - +n;
    },
    reset() {
      this.price = 0
      this.exchanged = false
    },
    buyHover( n ) {
      this.bhover = n;
    },
    sellHover( n ) {
      this.shover = n;
    },
    clearOrder() {
      this.shover = 0
      this.bhover = 0
    },
    setPrice() {
      this.price = this.bprice + this.sprice
      if ( this.price > 0 ) {
        this.bprice = this.price
        this.sprice = 0
      } else if ( this.price < 0 ) {
        this.sprice = this.price
        this.bprice = 0
      } else if ( this.price == 0 ) {
        this.sprice = 0
        this.bprice = 0
      }
      this.exchanged = true
    }
  }
}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables/Mixins
// -----------------------------------------------------

@import '~assets/scss/variables.scss';
@import '~assets/scss/mixins.scss';

.unfilled-select {
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
                    margin-bottom: 10px;
                    font-size: 22px;
                    font-weight: 600;
                    text-align: center;
                    visibility: hidden;

                    &.active {
                        visibility: visible;
                    }
                }

                ul {
                    list-style-type: none;
                    display: flex;
                    flex-direction: column;
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
                        height: 24px;
                        width: 100%;
                        font-size: 16px;
                        line-height: 24px;
                        text-align: center;
                        text-transform: uppercase;
                        transition: all 0.3s ease;

                        span {
                            visibility: hidden;
                        }

                        &:hover {
                            cursor: pointer;
                        }

                        &.active {
                            span {
                                visibility: visible;
                            }
                        }

                        &.hover {
                            opacity: 0.4;

                            &.active {
                                opacity: 1;
                            }
                        }

                        &:last-child {
                            span {
                                visibility: visible;
                            }
                        }
                    }
                }

            }
        }
    }

    .btn-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 90%;

        .exchange-btn {
            padding: 0.3rem 1.2rem;
            font-size: 1.15rem;
            font-weight: 600;
            border-radius: 50px;
            align-self: center;
            text-align: center;
            color: #fff;
            background: lighten($dark-body-bg, 5%);
            border: 4px solid $purple;

            &:hover {
                color: #fff;
                background: lighten($dark-body-bg, 12%);
                border: 4px solid $purple;
            }

            &:focus {
                outline: 0;
            }

            &:disabled {
                opacity: 0.4;
                color: lighten($dark-gray-med, 30%);
                border: 4px solid lighten($dark-gray-med, 30%);
                cursor: not-allowed;
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
                height: 60%;
                width: 160px;
                align-self: center;

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
                            display: none !important;

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
                            background: #fff;
                        }

                        &:after {
                            content: '';
                            display: block;
                            position: relative;
                            top: -2px;
                            left: 7px;
                            width: 80px;
                            height: 6px;
                            background: #fff;
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
    .unfilled-select {
        .unfilled-orders {

            .unfilled-orders-cont {
                div:nth-child(1) {
                    ul {
                        li {
                            background: rgba(255,255,255,0.1);

                            &.active,
                            &.hover {
                                background: $green;
                            }
                        }
                    }
                }

                div:nth-child(2) {
                    ul {
                        li {
                            background: rgba(255,255,255,0.1);

                            &.active,
                            &.hover {
                                background: $red;
                            }
                        }

                    }
                }
            }

        }
    }
}

.light {
    .unfilled-select {
        .unfilled-orders {
            .unfilled-orders-cont {
                div:nth-child(1) {
                    ul {
                        li {
                            background: rgba(0,0,0,0.1);

                            &.active,
                            &.hover {
                                background: $green;
                            }

                            &.hover {
                                opacity: 0.7;

                                &.active {
                                    opacity: 1;
                                }
                            }

                            &:last-child {
                                color: $light-text-color;
                            }
                        }
                    }
                }

                div:nth-child(2) {
                    ul {
                        li {
                            background: rgba(0,0,0,0.1);

                            &.active,
                            &.hover {
                                background: $red;
                            }

                            &.hover {
                                opacity: 0.7;

                                &.active {
                                    opacity: 1;
                                }

                            }

                            &:last-child {
                                color: $light-text-color;
                            }
                        }
                    }
                }
            }

        }

        .exchange-btn {
            @include button-color($purple-med, 4%);

            &:disabled {
                color: #fff;
                background: $light-gray;
                border-color: $light-gray;
            }
        }

        .price {
            .price-slider-cont {
                .price-slider {
                    .vue-slider {

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
                    }

                }
            }
        }
    }
}
</style>
