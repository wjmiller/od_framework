<template lang="html">
  <b-navbar v-bind:sticky="true">
    <b-navbar-nav class="ml-auto">
      <b-nav-item>
        <i v-on:click="toggle_notes" class="notes-btn icon-edit-3" v-bind:class="{'open': open}"/></i>
      </b-nav-item>
      <b-nav-item-dropdown right>
        <template slot="button-content"><img class="user" src="~/assets/images/ui/headshot.png" /></template>
        <no-ssr><toggle-button class="theme-btn"
                       v-bind:value="theme"
                       v-bind:labels="{checked: 'Dark ', unchecked: ' Light'}"
                       v-bind:width="70"
                       v-bind:height="30"
                       v-bind:color="{checked: '#676EC9', unchecked: '#8B8C96'}"
                       v-on:change="toggle_theme" /></no-ssr>
        <b-dropdown-item href="#" v-on:click="logout">Log Out</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: "navbar",
  props: [ 'open' ],
  computed: {
    ...mapGetters( [ 'get_user_prefs' ] ),
    theme() {
      return this.get_user_prefs.theme_dark
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: this.get_user_prefs.theme_dark ? 'dark' : 'light'
      }
    }
  },
  methods: {
    toggle_notes() {
      this.$emit( "notes_toggle" )
    },
    async toggle_theme( ev ) {
      this.$store.dispatch( 'change_theme', ev.value )
    },
    logout() {
      this.$store.dispatch( 'logout' );
      this.$router.push( '/auth' )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables.scss';

.theme-btn {
    margin-left: 20px;
}

.dropdown-item {
    color: $light-gray-med-dark;
    font-weight: 600;
}

.notes-btn {
    display: inline-block;
    font-size: 2rem;
    margin: 6px 10px 0 0;
}

.user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 5px;
}

.dark {
    .user {
        border: 2px solid $dark-gray-light;
    }

    .notes-btn {
        color: #fff;

        &.open {
            color: $yellow;

            &:hover {
                color: lighten($yellow, 8%);
            }
        }

        &:focus,
        &:hover {
            color: $yellow;
        }
    }
}

.light {
    .user {
        border: 2px solid $light-gray-med-dark;
    }

    .notes-btn {
        color: $light-gray-med-dark;

        &.open {
            color: $orange;

            &:hover {
                color: lighten($orange, 8%);
            }
        }

        &:focus,
        &:hover {
            color: $orange;
        }
    }
}
</style>
