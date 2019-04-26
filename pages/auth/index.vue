<template>
<div class="form-box">

  <!-- Logo Images -->
  <div class="login-logo"></div>

  <!-- Login Button -->
  <b-button v-on:click="login">Login</b-button>

</div>
</template>

<script>
export default {
  name: 'login',
  layout: 'login',
  methods: {
    async login() {
      return await this.$store.dispatch( 'authenticate_user' );
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables.scss';
.form-box {
    width: 100%;
    max-width: 400px;
    margin: 100px auto 50px;
    padding: 20px 30px;

    .login-logo {
        width: 300px;
        height: 125px;
        margin: 0 auto 5px;
    }

    .btn {
        display: block;
        width: 100%;
    }
}

.dark {
    .form-box {

        .login-logo {
            background-image: url("~assets/images/ui/logos/ota_dark.png");
            background-size: 300px 125px;
        }
    }
}

.light {
    .form-box {

        .login-logo {
            background-image: url("~assets/images/ui/logos/ota_light.png");
            background-size: 300px 125px;
        }
    }
}
</style>
