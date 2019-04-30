<template>
<div class="notes-pane"
     v-bind:class="{'closed': !open}">
  <b-container class="notes-pane-body">
    <b-row class="notes-pane-head">
      <b-col>
        <div>
          <h2>Notes</h2>
          <b-button class="notes-add"
                    variation="default"
                    v-on:click="active_tab('new')"
                    v-bind:disabled="tab_type == 'new'"><i class="icon-add"></i> Add</b-button>
        </div>
        <b-button variant="link"
                  class="notes-close"
                  v-on:click="close_notes"><i class="icon-close"></i></b-button>
      </b-col>
    </b-row>
    <b-row class="notes-tab-pane">
      <b-col v-if="tab_type == 'browse'">
        <div class="notes-tab-head">
          <b-form-input class="notes-search"
                        v-model="search"
                        placeholder="Search..."></b-form-input>
        </div>

        <div class="browse-none"
             v-if="notes.length == 0">Click <i class="icon-add"></i><b>Add Note</b> to create your first note for this course.</div>
        <b-list-group v-if="notes.length > 0">
          <b-list-group-item class="flex-column align-items-start"
                             v-for="(note, ix) in filtered_notes"
                             v-bind:key="'note-' + ix">
            <small class="note-date">
              <timeago :datetime="note.recorded"
                       :auto-update="60"></timeago>
            </small>
            <p class="note-text">{{note.note}}</p>
            <small class="note-location">{{note.course_title}} - {{note.lesson_title}}</small>
            <b-btn class="note-edit"
                   v-on:click="edit_note(note['_id'])">
              <fa :icon="['fas', 'pen']" />
            </b-btn>
            <b-btn class="note-delete"
                   v-on:click="delete_note(note['_id'])"><i class="icon-trash"></i></b-btn>
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col v-if="tab_type == 'new'">
        <b-form>
          <div class="note-saving">Saving In: {{lesson.title}}</div>
          <b-form-textarea class="note-text"
                           v-model="note.note"
                           placeholder="Enter note text"
                           rows="4"></b-form-textarea>
          <div class="note-btns">
            <b-btn v-on:click="cancel_note">Cancel</b-btn>
            <b-btn variant="success"
                   v-on:click="add_note">Create Note</b-btn>
          </div>
        </b-form>
      </b-col>
      <b-col v-if="tab_type == 'edit'">
        <b-form>
          <div class="note-saving">Saved In: {{note_edit.lesson_title}}</div>
          <b-form-textarea class="note-text"
                           v-model="note_edit.note"
                           placeholder="Enter note text"
                           rows="4"></b-form-textarea>
          <div class="note-btns">
            <b-btn v-on:click="cancel_note">Cancel</b-btn>
            <b-btn variant="success"
                   v-on:click="edit_save">Save Changes</b-btn>
          </div>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
import axios from 'axios'
import {
  mapGetters
} from 'vuex'

export default {
  name: "notes",
  props: [ 'open' ],
  computed: {
    ...mapGetters( [ 'get_course', 'get_lesson', 'get_user_notes', 'get_user_lessons' ] ),
    course() {
      return this.get_course
    },
    lesson() {
      return this.get_lesson
    },
    notes() {
      if ( this.course && this.course.id ) {
        return this.get_user_notes.filter( note => note.course_id == this.course.id )
      } else {
        return this.get_user_notes
      }
    },
    filtered_notes() {
      return this.notes.filter( note => {
        return note.note.toLowerCase().includes( this.search.toLowerCase() ) ||
          note.lesson_title.toLowerCase().includes( this.search.toLowerCase() ) ||
          note.course_title.toLowerCase().includes( this.search.toLowerCase() )
      } ).sort( ( a, b ) => ( a.recorded < b.recorded ) ? 1 : ( ( b.recorded < a.recorded ) ? -1 : 0 ) );
    },
    note: {
      get: function () {
        return {
          user_id: this.$store.state.user.localId,
          course_id: this.course && this.course.id ? this.course.id : null,
          course_title: this.course && this.course.title ? this.course.title : null,
          lesson_id: this.lesson && this.lesson.id ? this.lesson.id : null,
          lesson_title: this.lesson && this.lesson.title ? this.lesson.title : null,
          note: ''
        }
      },
      set: function ( noteValue ) {
        return {
          user_id: this.$store.state.user.localId,
          course_id: this.course && this.course.id ? this.course.id : null,
          course_title: this.course && this.course.title ? this.course.title : null,
          lesson_id: this.lesson && this.lesson.id ? this.lesson.id : null,
          lesson_title: this.lesson && this.lesson.title ? this.lesson.title : null,
          note: noteValue
        }
      }
    }
  },
  data() {
    return {
      tab_type: 'browse',
      search: '',
      note_edit: {
        user_id: this.$store.state.user.localId,
        note: ''
      }
    }
  },
  methods: {
    close_notes() {
      this.$emit( "close_notes" )
    },
    active_tab( type ) {
      this.tab_type = type
    },
    cancel_note() {
      this.note.note = this.edit_note.note = ''
      this.active_tab( 'browse' )
    },
    add_note() {
      this.$store.dispatch( 'add_note', this.note )
        .then( () => {
          this.cancel_note()
        } )
    },
    edit_note( id ) {
      axios.get( 'https://ota-course-framework.firebaseio.com/user_notes/' + id + '.json' )
        .then( res => {
          this.note_edit = {
            ...res.data,
            _id: id
          }
          this.active_tab( 'edit' )
        } )
    },
    edit_save() {
      this.$store.dispatch( 'update_note', this.note_edit )
        .then( () => {
          this.cancel_note()
        } )
    },
    delete_note( id ) {
      this.$dialog
        .confirm( 'Are you sure you want to delete this note?', {
          okText: 'Delete',
          cancelText: 'Cancel',
          customClass: 'delete-confirm'
        } )
        .then( dialog => this.$store.dispatch( 'delete_note', id ) )
        .catch( e => console.log( e ) )

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
    height: 100vh;
    transition: height 0.5s;
    z-index: 1020;
    overflow-x: hidden;

    @media(min-width: 768px) {
        height: 60vh;
    }

    .notes-pane-body {

        .notes-pane-head .col {
            display: flex;
            justify-content: space-between;
            margin-top: 48px;

            h2 {
                display: inline-block;
                align-self: flex-start;
                vertical-align: top;
                font-size: 2.2rem;
                margin: 0 1.3rem 0 0;
            }
            .notes-add {
                align-self: flex-start;
                margin-top: 0.25rem;
                padding: 0.3rem 1.2rem 0.3rem 0.9rem;
            }

            .notes-close {
                position: relative;
                font-size: 2.5rem;
                line-height: 1rem;
                padding: 0;
            }
        }

        .notes-search {
            max-width: 600px;
            border-color: $light-border;
        }

        .notes-tab-pane {
            margin-top: 1.5rem;
        }

        .browse-none {
            margin-top: 15px;
        }

        .note-saving {
            margin-top: 0;
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
                margin-right: 6px;
            }
            button:first-child {
                background: $light-gray;
                border-color: $light-gray;

                &:active,
                &:focus,
                &:hover {
                    background: lighten($light-gray, 6%);
                    border-color: lighten($light-gray, 6%);
                }
            }
        }

        .list-group {
            margin-top: 20px;
            padding-top: 10px;
            height: calc(100vh - 188px);
            border-radius: 0;
            overflow-y: auto;

            @media(min-width: 768px) {
                height: calc(60vh - 190px);
            }

            .list-group-item {
                position: relative;
                padding: 10px 15px 15px;
                border-radius: 0;
                width: 100%;
                margin-bottom: 14px;
                border: 0;

                @media(min-width: 768px) {
                    width: calc(100% - 20px);
                }

                .note-text {
                    margin-bottom: 12px;
                    max-width: 980px;
                    margin-top: 5px;
                    font-style: normal;
                }

                .note-date {
                    font-style: italic;
                    font-size: 0.8rem;
                }

                .note-location {
                    padding: 0.3rem 0.9rem;
                    border-radius: 1rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .note-delete,
                .note-edit {
                    position: absolute;
                    border-radius: 0;
                    padding: 3px;
                    width: 30px;
                    height: 30px;
                    top: -1px;
                }

                .note-delete {
                    right: -1px;
                    background: $red;
                    border-color: $red;

                    &:active,
                    &:focus,
                    &:hover {
                        background: lighten($red, 5%);
                        border-color: lighten($red, 5%);
                    }
                }

                .note-edit {
                    right: 29px;
                    font-size: 0.83rem;
                    background: $light-gray;
                    border-color: $light-gray;

                    &:active,
                    &:focus,
                    &:hover {
                        background: lighten($light-gray, 5%);
                        border-color: lighten($light-gray, 5%);
                    }
                }

            }
        }

    }

    &.closed {
        height: 0;
        opacity: 1;
    }
}

.dark {

    .notes-pane {
        background-color: lighten($dark-blue, 3%);
        border-top: 1px solid lighten($dark-blue, 10%);
        color: #fff;

        .notes-pane-head .col {
            .notes-close {
                color: #fff;

                &:active,
                &:focus,
                &:hover {
                    text-decoration: none;
                }

                &:hover {
                    color: rgba(255, 255, 255, 0.6);
                }
            }
        }

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

        .list-group {

            .list-group-item {
                background: rgba(255, 255, 255, 0.1);

                .note-location {
                    background: $dark-gray-med;
                }
            }

        }
    }
}

.light {

    .notes-pane {
        background-color: $light-gray-notes;
        color: $light-text-color;
        border-top: 1px solid $light-gray-med;

        .notes-pane-head .col {
            .notes-close {
                color: $light-gray;

                &:active,
                &:focus,
                &:hover {
                    text-decoration: none;
                }

                &:hover {
                    color: lighten($light-gray, 15%);
                }
            }
        }

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

        .list-group {

            .list-group-item {
                background: #fff;
                border: 1px solid $light-border;

                .note-location {
                    background: $light-gray;
                    color: #fff;
                }
            }

        }
    }
}
</style>
