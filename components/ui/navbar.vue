<template>
<b-navbar v-bind:sticky="true">
  <b-navbar-nav class="ml-auto">
    <b-nav-item>
      <i v-on:click="toggleNotes"
         class="notes-btn icon-edit" /></i>
    </b-nav-item>
    <b-nav-item-dropdown right>
      <template slot="button-content">
        <i class="settings-btn" /></i></template>
      <div class="font-container">
        <b-btn variant="link"
               v-on:click="increaseFont('1rem')"
               v-bind:class="{active: fontSize == '1rem'}">
        </b-btn>
        <b-btn variant="link"
               v-on:click="increaseFont('1.15rem')"
               v-bind:class="{active: fontSize == '1.15rem'}">
        </b-btn>
        <b-btn variant="link"
               v-on:click="increaseFont('1.3rem')"
               v-bind:class="{active: fontSize == '1.3rem'}">
        </b-btn>
      </div>
      <b-form-group aria-label="theme">
        <b-form-radio-group v-model="theme"
                            v-bind:options="options"
                            v-on:change="toggleTheme"
                            aria-label="theme toggle"
                            buttons></b-form-radio-group>
      </b-form-group>
    </b-nav-item-dropdown>
  </b-navbar-nav>
</b-navbar>
</template>

<script>
import {
  mapGetters
} from 'vuex'

export default {
  name: 'navbar',
  props: [ 'open' ],
  computed: {
    ...mapGetters( [ 'getUserPrefs' ] ),
    profileImg() {
      return this.getUserPrefs.profile_img
    },
    theme: {
      get() {
        return this.getUserPrefs.theme_dark
      },
      set( themeValue ) {
        return themeValue
      }
    }
  },
  data() {
    return {
      fontSize: '1rem',
      options: [
        {
          text: 'Dark',
          value: true
          },
        {
          text: 'Light',
          value: false
          }
        ]
    }
  },
  methods: {
    toggleNotes() {
      this.$emit( 'notes-toggle' )
    },
    async toggleTheme( ev ) {
      this.$store.dispatch( 'changeTheme', ev )
    },
    increaseFont( size ) {
      this.fontSize = size
    },
    logout() {
      this.$store.dispatch( 'logout' )
      this.$router.push( '/auth' )
    }
  },
  head() {
    return {
      htmlAttrs: {
        style: 'font-size:' + this.fontSize
      }
    }
  }
}
</script>

<style lang="scss">
// -----------------------------------------------------
// Import Variables
// -----------------------------------------------------

@import '~assets/scss/variables.scss';

// -----------------------------------------------------
// Navbar Items
// -----------------------------------------------------

.notes-btn,
.settings-btn {
    display: inline-block;
    font-size: 2rem;
    margin: 6px 10px 0 0;
}

.settings-btn {
    color: #fff;
    font-size: 1.74rem;
    margin: 6px 0 0;

    &:before {
        content: "\e994";
        font-family: "custom-icons";
        font-style: normal;
        position: relative;
        top: 3px;

    }

    &:hover {
        color: rgba(255, 255, 255, 0.6);
    }
}

.dropdown-toggle {
    &:after {
        color: #fff;
        display: none;
    }
}

.dropdown-menu {
    border-radius: 0;
    background-clip: unset;

    .font-container {
        padding: 6px 20px 10px;

        button {
            width: 2.5rem;
            height: 2.5rem;
            text-align: center;
            font-weight: 600;
            vertical-align: baseline;
            color: darken($light-gray-med, 10%);

            &:before {
                content: 'A';
            }

            &:active,
            &:focus,
            &:hover {
                color: #444;
                text-decoration: none;
            }

            &.active {
                color: #444;
            }

            &:nth-child(1) {
                font-size: 1rem;
            }

            &:nth-child(2) {
                font-size: 1.2rem;
            }

            &:nth-child(3) {
                font-size: 1.4rem;
            }
        }
    }

    .form-group {
        padding: 0 20px;

        .btn-group {
            .btn-secondary {
                opacity: 0.6;
                border-radius: 0;
                background: #fff;
                color: $light-text-color;
                border-color: $light-gray-med-dark;

                &.active {
                    opacity: 1;
                    color: #fff;
                    background: $light-gray-med-dark;
                }

                &:hover {
                    cursor: pointer;
                }

                &.focus {
                    box-shadow: none;
                }
            }
        }
    }

    .dropdown-item {
        color: $light-gray-med-dark;
        font-weight: 600;

        &:hover {
            background: #fff;
        }
    }
}

// Dark/Light Theme Styles -------------------------

.dark {
    .notes-btn {
        color: #fff;

        &.open {
            color: #fff;

            &:hover {
                color: rgba(255, 255, 255, 0.6);
            }
        }

        &:focus,
        &:hover {
            color: rgba(255, 255, 255, 0.6);
        }
    }

    .user {
        border: 0.1rem solid #fff;
    }

    .dropdown-menu {
        border-color: #fff;
        box-shadow: 0 1px 4px rgba(0,0,0,0.9);
    }
}

.light {
    .notes-btn {
        color: $light-gray-med-dark;

        &.open {
            color: $light-gray-med-dark;

            &:hover {
                color: lighten($light-gray-med-dark, 20%);
            }
        }

        &:focus,
        &:hover {
            color: lighten($light-gray-med-dark, 20%);
        }
    }

    .settings-btn {
        color: $light-gray-med-dark;

        &:focus,
        &:hover {
            color: lighten($light-gray-med-dark, 20%);
        }
    }

    .user {
        border: 0.1rem solid $light-gray-med-dark;
    }

    .dropdown-menu {
        border-color: #ccc;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }
}
</style>
