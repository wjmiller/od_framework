<template>

  <footer>
    <div class="logo"></div>
    <div class="copyright">© {{currentYear}} Online Trading Academy. All Rights Reserved.</div>
  </footer>

</template>

<script>

  export default {
    name: 'foot',
    computed: {
      currentYear() {
        return new Date().getFullYear()
      }
    }
  }

</script>

<style lang="scss" scoped>

  @import '~assets/scss/variables.scss';

  footer {
    margin-top: 10rem;
    height: 74px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    @media (min-width: 497px) {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .logo {
      margin: 0 auto;
      width: 180px;
      height: 74px;

      @media (min-width: 527px) {
        margin: 0 15px;
      }
    }

    .copyright {
      margin: 0 auto 20px;
      font-size: 0.7em;
      padding: 0 20px;

      @media (min-width: 527px) {
        margin: 0;
      }
    }
  }

  .dark {
    footer {
      background: $dark-body-bg;

      .logo {
        background-image: url('~assets/images/ui/logos/ota_dark.png');
        background-size: 180px 74px;
      }
    }
  }

  .light {
    footer {
      background: #fff;

      .logo {
        background-image: url('~assets/images/ui/logos/ota_light.png');
        background-size: 180px 74px;
      }
    }
  }

</style>
