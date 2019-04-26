<template>
<div class="notes-pane"
     v-bind:class="{'close': !open}">
  <b-container class="notes-pane-body">
    <b-row class="notes-pane-head">
      <b-col>
        <h2>Notes</h2>
        <b-button variation="default"
                  v-bind:class="{'active': tab_type == 'new'}"
                  v-on:click="active_tab('new')"><i class="icon-add"></i> Add Note</b-button>
      </b-col>
    </b-row>
    <b-row class="notes-pane-tabs"
           v-if="tab_type !== 'new'">
      <b-col>
        <b-btn variant="link"
               v-bind:class="{'active': tab_type == 'search'}"
               v-on:click="active_tab('search')">Search</b-btn>
        <b-btn variant="link"
               v-bind:class="{'active': tab_type == 'browse'}"
               v-on:click="active_tab('browse')">Browse</b-btn>
      </b-col>
    </b-row>
    <b-row class="notes-tab-pane">
      <b-col v-if="tab_type == 'search'">
        <b-form-input class="notes-search"
                      v-model="search"></b-form-input>
      </b-col>
      <b-col v-if="tab_type == 'browse'">
        <div class="browse-none">Click <i class="icon-add"></i><b>Add Note</b> to create your first note for this course.</div>
      </b-col>
      <b-col v-if="tab_type == 'new'">
        <div class="note-saving">Saving In: </div>
        <b-form-textarea class="note-text"
                         v-model="note_text"
                         placeholder="Enter note text"
                         rows="4"></b-form-textarea>
        <div class="note-btns">
          <b-btn v-on:click="active_tab('search')">Cancel</b-btn>
          <b-btn variant="success">Create Note</b-btn>
        </div>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
export default {
  name: "notes",
  props: [ 'open' ],
  data() {
    return {
      tab_type: 'search',
      search: null,
      note_text: ''
    }
  },
  methods: {
    close_notes() {
      this.$emit( 'notes_closed' )
    },
    active_tab( type ) {
      this.tab_type = type
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~assets/scss/variables.scss';

.notes-pane {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    width: 100%;
    height: calc(100vh - 72px);
    transition: 0.5s ease;
    z-index: 2;
    overflow: scroll;

    @media(min-width: 768px) {
        height: calc(50vh);
    }

    .notes-pane-body {

        .notes-pane-head .col {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;

            h2 {
                align-self: flex-start;
                font-size: 2.2rem;
            }
            button {
                align-self: flex-start;
            }
        }

        .notes-search {
            max-width: 600px;
        }

        .notes-pane-tabs {
            margin-top: 15px;
            margin-bottom: 15px;

            .btn-link {
                text-decoration: none;
                font-weight: 600;
                font-size: 1.2rem;
                padding: 0;
                margin-right: 1.5rem;
                border-radius: 0;
                border: 0;
                border-bottom: 3px solid transparent;
            }
        }

        .browse-none {
            margin-top: 15px;
        }

        .note-saving {
            margin-top: 17px;
            font-style: italic;
            font-size: 1.1rem;
        }

        .note-text {
            margin-top: 10px;
            max-width: 600px;
        }

        .note-btns {
            margin-top: 18px;
            button {
                margin-right: 10px;
            }
        }
    }

    &.close {
        height: 0;
    }
}

.dark {
    .notes-pane {
        background-color: lighten($dark-blue, 3%);
        color: #fff;

        .notes-pane-tabs {
            .btn-link {
                color: #fff;
                &.active {
                    border-color: $purple;
                }
            }
        }

        .note-text {
            border-color: none;
        }
    }
}

.light {
    .notes-pane {
        background-color: $light-gray-notes;
        color: $light-text-color;
        border-top: 1px solid $light-gray-med;

        .notes-pane-tabs {
            .btn-link {
                color: $light-blue-dark;
                &.active {
                    border-color: $purple;
                }
            }
        }

        .note-text {
            border-color: $light-pane-border;
        }
    }
}
</style>
