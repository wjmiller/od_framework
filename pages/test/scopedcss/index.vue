<template>
<b-container>
  <b-row>
    <b-col>
      <colored-text></colored-text>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import ColoredText from '~/components/colored_text'

export default {
  components: {
    ColoredText
  }
}
</script>

<style lang="scss">
.colored-text {
    color: darkblue;
}
</style>


<style lang="scss" scoped>
.colored-text {
    color: darkgreen;
}
</style>
