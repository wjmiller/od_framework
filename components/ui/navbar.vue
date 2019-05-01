<template>
<b-navbar>
  <b-navbar-nav class="ml-auto">
    <b-nav-item>
      <i v-on:click="toggle_notes"
         class="notes-btn icon-edit" /></i>
    </b-nav-item>
    <b-nav-item-dropdown right>
      <template slot="button-content">
        <img class="user"
             alt="user image"
             v-bind:src="profile_img" /></template>
      <div class="font-container">
        <b-btn variant="link"
               v-on:click="increase_font('1rem')"
               v-bind:class="{active: font_size == '1rem'}">A
        </b-btn>
        <b-btn variant="link"
               v-on:click="increase_font('1.15rem')"
               v-bind:class="{active: font_size == '1.15rem'}">A
        </b-btn>
        <b-btn variant="link"
               v-on:click="increase_font('1.3rem')"
               v-bind:class="{active: font_size == '1.3rem'}">A
        </b-btn>
      </div>
      <b-form-group>
        <b-form-radio-group v-model="theme"
                            v-bind:options="options"
                            v-on:change="toggle_theme"
                            buttons></b-form-radio-group>
      </b-form-group>
      <b-dropdown-item href="#"
                       v-on:click="logout">Log Out</b-dropdown-item>
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
    profile_img() {
      return this.get_user_prefs.profile_img
    },
    theme: {
      get() {
        return this.get_user_prefs.theme_dark
      },
      set( theme_value ) {
        return theme_value
      }
    }
  },
  data() {
    return {
      font_size: '1rem',
      options: [ {
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
    toggle_notes() {
      this.$emit( "notes_toggle" )
    },
    async toggle_theme( ev ) {
      this.$store.dispatch( 'change_theme', ev )
    },
    increase_font( size ) {
      this.font_size = size
    },
    logout() {
      this.$store.dispatch( 'logout' );
      this.$router.push( '/auth' )
    }
  },
  head() {
    return {
      htmlAttrs: {
        style: 'font-size:' + this.font_size
      }
    }
  }
}
</script>

<style lang="scss">
@import '~assets/scss/variables.scss';

.notes-btn {
    display: inline-block;
    font-size: 2rem;
    margin: 6px 10px 0 0;
}

.user {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    margin-right: 0.29rem;
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
                border-color: $purple-med;

                &.active {
                    opacity: 1;
                    color: #fff;
                    background: $purple-med;
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

.dark {

    .notes-btn {
        color: #fff;

        &.open {
            color: #fff;

            &:hover {
                color: rgba(255,255,255,0.6);
            }
        }

        &:focus,
        &:hover {
            color: rgba(255,255,255,0.6);
        }
    }

    .user {
        border: 0.1rem solid #fff;
    }

    .dropdown-menu {
        border-color: #fff;
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

    .user {
        border: 0.1rem solid $light-gray-med-dark;
    }

    .dropdown-menu {
        border-color: #aaa;
    }

}
</style>
