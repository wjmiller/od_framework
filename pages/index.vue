<template>
<div class="container">
  <h1>Courses List:</h1>
  <nuxt-link to="od_js">Jumpstart</nuxt-link>
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
}

// Dark/Light Theme Styles -----------------------------

.dark {
    a {
        color: #fff;

        &:active,
        &:focus,
        &:hover {
            color: $purple-med;
        }
    }
}

.light {
    a {
        color: $light-gray;

        &:active,
        &:focus,
        &:hover {
            color: $purple-med;
        }
    }
}
</style>
