<template>
<div class="container">
  <h1>Courses:</h1>
  <nuxt-link to="/od_js">Jumpstart</nuxt-link>

  <h1>Tests:</h1>
  <nuxt-link to="/test/activity">Activity</nuxt-link>
  <nuxt-link to="/test/feedback">Feedback</nuxt-link>
  <nuxt-link to="/test/game">Game</nuxt-link>
  <nuxt-link to="/test/multichoice">Multi Choice</nuxt-link>
  <nuxt-link to="/test/scopedcss">Scoped CSS</nuxt-link>
</div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

h1 {
    font-size: 3.2rem;
    margin: 3rem 0 1.1rem;
}

a {
    font-size: 1.5rem;
    font-weight: 600;
    text-decoration: none;
    margin-left: 0.8rem;
    display: block;
    margin-bottom: 5px;
}

// Dark/Light Theme Styles -----------------------------

.dark {
    a {
        color: #fff;

        &:active,
        &:focus,
        &:hover {
            color: $purple;
        }
    }
}

.light {
    a {
        color: $light-gray;

        &:active,
        &:focus,
        &:hover {
            color: $purple;
        }
    }
}
</style>
