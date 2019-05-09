<template>
<div>
  <div ref="fullscreen"
       class="fullscreen">

  </div>
</div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

.fullscreen {
    background: orange;
    width: 1600px;
    height: 900px;
    text-align: center;
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transform-origin: center center;
    z-index: 1400;
}
</style>
