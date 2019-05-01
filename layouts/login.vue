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
  head() {
    return {
      htmlAttrs: {
        class: 'dark'
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
