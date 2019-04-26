<template>
<footer>
  <div class="logo"></div>
  <div class="copyright">© {{current_year}} Online Trading Academy. All Rights Reserved.</div>
</footer>
</template>

<script>
export default {
  name: "foot",
  computed: {
    current_year() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~assets/scss/variables.scss";

footer {
    margin-top: 10rem;
    height: 74px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .logo {
        margin: 0 15px;
        width: 180px;
        height: 74px;
    }

    .copyright {
        font-size: 0.7em;
        padding: 0 20px;
    }
}

.dark {
    footer {
        background: $dark-body-bg;

        .logo {
            background-image: url("~assets/images/ui/logos/ota_dark.png");
            background-size: 180px 74px;
        }
    }
}

.light {
    footer {
        background: #fff;

        .logo {
            background-image: url("~assets/images/ui/logos/ota_light.png");
            background-size: 180px 74px;
        }
    }
}
</style>
