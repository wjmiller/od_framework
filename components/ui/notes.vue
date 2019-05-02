<template>
<div class="notes-pane"
     v-bind:class="{'closed': !open}">
  <b-container>
    <b-row class="notes-pane-head">
      <b-col>
        <div>
          <h2>Notes</h2>
          <b-button class="notes-add"
                    variation="default"
                    v-on:click="activeTab('new')"
                    v-bind:disabled="tabType == 'new'"><i class="icon-add"
               aria-label="plus sign"></i> Add</b-button>
        </div>
        <b-button variant="link"
                  class="notes-close"
                  v-on:click="closeNotes"><i class="icon-close"
             aria-label="close"></i></b-button>
      </b-col>
    </b-row>
    <b-row class="notes-views">
      <b-col v-if="tabType == 'browse'">
        <b-form-input v-model="search"
                      class="notes-search"
                      placeholder="Search..."
                      aria-label="Search notes"></b-form-input>
        <div v-if="notes.length == 0">Click <i class="icon-add"
             aria-label="plus sign"></i><b>Add</b> to create your first note for this course.</div>
        <b-list-group v-if="notes.length > 0">
          <b-list-group-item v-for="(note, ix) in filteredNotes"
                             v-bind:key="'note-' + ix">
            <timeago class="note-date"
                     v-bind:datetime="note.recorded"
                     v-bind:auto-update="60"></timeago>
            <p class="note-text">{{note.note}}</p>
            <span class="note-location">{{note.course_title}} - {{note.lesson_title}}</span>
            <b-btn class="note-edit"
                   v-on:click="editNote(note['_id'])">
              <fa :icon="['fas', 'pen']"
                  aria-label="edit" />
            </b-btn>
            <b-btn class="note-delete"
                   v-on:click="deleteNote(note['_id'])"><i class="icon-trash"
                 aria-label="delete"></i></b-btn>
          </b-list-group-item>
        </b-list-group>
      </b-col>
      <b-col v-if="tabType == 'new'">
        <b-form v-on:submit.prevent="addNote">
          <div class="note-saving">Saving In: {{lesson.title}}</div>
          <b-form-textarea v-model="note.note"
                           aria-label="Enter note text"
                           placeholder="Enter note text"
                           rows="5"></b-form-textarea>
          <div class="note-btns">
            <b-btn v-on:click="cancelNote">Cancel</b-btn>
            <b-btn type="submit">Create Note</b-btn>
          </div>
        </b-form>
      </b-col>
      <b-col v-if="tabType == 'edit'">
        <b-form v-on:submit.prevent="editSave">
          <div class="note-saving">Saved In: {{noteEdit.lesson_title}}</div>
          <b-form-textarea v-model="noteEdit.note"
                           aria-label="Edit note text"
                           placeholder="Enter note text"
                           rows="5"></b-form-textarea>
          <div class="note-btns">
            <b-btn v-on:click="cancelNote">Cancel</b-btn>
            <b-btn variant="success"
                   type="submit">Save Changes</b-btn>
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
  name: 'notes',
  props: [ 'open' ],
  computed: {
    ...mapGetters( [ 'getCourse', 'getLesson', 'getUserNotes', 'getUserLessons' ] ),
    course() {
      return this.getCourse
    },
    lesson() {
      return this.getLesson
    },
    notes() {
      if ( this.course && this.course.id ) {
        return this.getUserNotes.filter( note => note.course_id == this.course.id )
      } else {
        return this.getUserNotes
      }
    },
    filteredNotes() {
      return this.notes
        .filter( note => {
          return (
            note.note.toLowerCase()
            .includes( this.search.toLowerCase() ) ||
            note.lesson_title.toLowerCase()
            .includes( this.search.toLowerCase() ) ||
            note.course_title.toLowerCase()
            .includes( this.search.toLowerCase() )
          )
        } )
        .sort( ( a, b ) => ( a.recorded < b.recorded ? 1 : b.recorded < a.recorded ? -1 : 0 ) )
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
      tabType: 'browse',
      search: '',
      noteEdit: {
        user_id: this.$store.state.user.localId,
        note: ''
      }
    }
  },
  methods: {
    closeNotes() {
      this.$emit( 'close-notes' )
    },
    activeTab( type ) {
      this.tabType = type
    },
    cancelNote() {
      this.note.note = this.editNote.note = ''
      this.activeTab( 'browse' )
    },
    addNote() {
      this.$store.dispatch( 'addNote', this.note )
        .then( () => {
          this.cancelNote()
        } )
    },
    editNote( id ) {
      axios.get( 'https://ota-course-framework.firebaseio.com/user_notes/' + id + '.json' )
        .then( res => {
          this.noteEdit = {
            ...res.data,
            _id: id
          }
          this.activeTab( 'edit' )
        } )
    },
    editSave() {
      this.$store.dispatch( 'updateNote', this.noteEdit )
        .then( () => {
          this.cancelNote()
        } )
    },
    deleteNote( id ) {
      this.$dialog
        .confirm( 'Are you sure you want to delete this note?', {
          okText: 'Delete',
          cancelText: 'Cancel',
          customClass: 'delete-confirm'
        } )
        .then( dialog => this.$store.dispatch( 'deleteNote', id ) )
        .catch( e => console.log( e ) )
    }
  }
}
</script>

<style lang="scss" scoped>
// -----------------------------------------------------
// Import Mixins/Variables
// -----------------------------------------------------

@import '~assets/scss/mixins.scss';
@import '~assets/scss/variables.scss';

// -----------------------------------------------------
// Notes Pane
// -----------------------------------------------------

.notes-pane {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
    transition: height 0.5s;
    z-index: 1020;
    overflow-x: hidden;

    @media (min-width: 768px) {
        height: 60%;
    }

    .container {
        .notes-pane-head {
            .col {
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
        }

        .notes-search {
            max-width: 600px;
            border-color: $light-border;
            margin-bottom: 20px;
        }

        textarea {
            padding: 0.8rem 1rem;
            margin-top: 10px;
            max-width: 900px;
            box-shadow: 0;
            font-size: 1rem;
        }

        .notes-views {
            margin-top: 1.5rem;
        }

        .note-saving {
            margin-top: 0;
            font-style: italic;
            font-size: 1.1rem;
        }

        .note-btns {
            margin-top: 18px;
            button {
                margin-right: 6px;
            }
            button:first-child {
                @include button-color($gray, 6%)
            }

            button:last-child {
                @include button-color($green-med, 5%)
            }
        }

        .list-group {
            border-radius: 0;
            overflow-y: auto;
            padding-top: 10px;
            height: calc(100vh - 190px);

            @media (min-width: 768px) {
                height: calc(60vh - 190px);
            }

            .list-group-item {
                position: relative;
                display: flex-column;
                padding: 10px 15px 18px;
                align-items: flex-start;
                margin-bottom: 14px;
                border-radius: 0;
                width: 100%;
                border: 0;

                @media (min-width: 768px) {
                    width: calc(100% - 20px);
                }

                .note-text {
                    margin-bottom: 15px;
                    max-width: 980px;
                    margin-top: 15px;
                    font-style: normal;
                }

                .note-date {
                    font-style: italic;
                    font-size: 0.9rem;
                }

                .note-location {
                    display: inline;
                    padding: 0.3rem 0.9rem;
                    border-radius: 1rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                }

                .note-delete,
                .note-edit {
                    position: absolute;
                    border-radius: 0;
                    font-size: 20px;
                    padding: 5px;
                    width: 40px;
                    height: 40px;
                    top: -1px;
                }

                .note-delete {
                    right: -1px;
                    @include button-color($red, 6%)
                }

                .note-edit {
                    right: 39px;
                    font-size: 16px;
                    @include button-color($gray, 5%)
                }
            }
        }
    }

    &.closed {
        height: 0;
        opacity: 1;
    }
}

// Dark/Light Theme Styles -----------------------------

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

                &:active,
                &:focus,
                &:hover {
                    color: rgba(255, 255, 255, 0.6);
                }
            }
        }

        textarea {
            background: rgba(255, 255, 255, 0.08);
            color: #fff;
            border: 0;

            &:focus {
                box-shadow: 0 0 0 0.15rem rgba(255, 255, 255, 0.3);
            }
        }

        .list-group {
            .list-group-item {
                background: rgba(255, 255, 255, 0.08);

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

                &:active,
                &:focus,
                &:hover {
                    color: lighten($light-gray, 15%);
                }
            }
        }

        textarea {
            border: 1px solid $light-pane-border;

            &:focus {
                box-shadow: 0 0 0 0.1rem rgba(0, 0, 0, 0.2);
            }
        }

        .list-group {
            .list-group-item {
                background: #fff;
                border: 1px solid $light-border;

                .note-location {
                    background: lighten($light-gray-med-dark, 6%);
                    color: #fff;
                }
            }
        }
    }
}
</style>
