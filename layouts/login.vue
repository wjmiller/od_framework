<template>
<section>
  <nuxt class="page-content" />
  <foot></foot>
</section>
</template>

<script>
import foot from '../components/ui/foot'

export default {
  components: {
    foot
  },
  data() {
    return {
      theme: 'dark'
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: this.theme == 'dark' ? 'dark' : 'light'
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.page-content {
    min-height: calc(100vh - 333px);
}
</style>
