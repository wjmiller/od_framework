export const state = () => ( {
  userPrefs: null,
  userCourses: [],
  userLessons: [],
  userActivities: [],
  userNotes: [],
  user: {},
  course: null,
  lesson: null
} );

export const mutations = {
  setUser( state, user ) {
    state.user = user
  },
  setUserPrefs( state, prefs ) {
    state.userPrefs = prefs
  },
  setUserCourses( state, courses ) {
    state.userCourses = courses
  },
  setUserLessons( state, lessons ) {
    state.userLessons = lessons
  },
  setUserActivities( state, activities ) {
    state.userActivities = activities
  },
  setUserNotes( state, notes ) {
    state.userNotes = notes
  },
  setCourse( state, course ) {
    state.course = course
  },
  setLesson( state, lesson ) {
    state.lesson = lesson
  },
  addNote( state, note ) {
    state.userNotes.push( note )
  },
  updateNote( state, edittedNote ) {
    const existingNote = state.userNotes.find( note => note[ '_id' ] === edittedNote[ '_id' ] )
    Object.assign( existingNote, edittedNote );
  },
  deleteNote( state, id ) {
    const noteIx = state.userNotes.findIndex( note => note[ '_id' ] === id )
    state.userNotes.splice( noteIx, 1 )
  }
}

export const actions = {
  async nuxtServerInit( { dispatch } ) {
    dispatch( 'authenticateUser' )
    await dispatch( 'fetchUserState' )
  },
  authenticateUser( { commit } ) {

    commit( 'setUser', { localId: "gdc9acBRnwVwE8R97CctHp7WX0s2" } )

  },
  async fetchUserState( { state, commit } ) {
    const coursesArray = [],
      lessonsArray = [],
      activitiesArray = [],
      notesArray = []

    const [ prefs, courses, lessons, activities, notes ] = await Promise.all( [
      await this.$axios.get( '/user_preferences/' + state.user.localId + '.json' ),
      await this.$axios.get( '/user_courses.json' ),
      await this.$axios.get( '/user_lessons.json' ),
      await this.$axios.get( '/user_activities.json' ),
      await this.$axios.get( '/user_notes.json' )
    ] );

    // Convert firebase objects into array data
    for ( const ckey in courses.data ) {
      coursesArray.push( courses.data[ ckey ] )
    }

    for ( const lkey in lessons.data ) {
      lessonsArray.push( lessons.data[ lkey ] )
    }

    for ( const akey in activities.data ) {
      activitiesArray.push( activities.data[ akey ] )
    }

    for ( const nkey in notes.data ) {
      notes.data[ nkey ][ '_id' ] = nkey
      notesArray.push( notes.data[ nkey ] )
    }

    commit( 'setUserPrefs', prefs.data )
    commit( 'setUserCourses', coursesArray.filter( course => course.user_id == state.user.localId ) )
    commit( 'setUserLessons', lessonsArray.filter( lesson => lesson.user_id == state.user.localId ) )
    commit( 'setUserActivities', activitiesArray.filter( activities => activities.user_id == state.user.localId ) )
    commit( 'setUserNotes', notesArray.filter( note => note.user_id == state.user.localId ) )
  },
  changeTheme( { commit, state }, theme ) {
    return this.$axios.put( '/user_preferences/' + state.user.localId + '.json', { ...state.userPrefs, theme_dark: theme } )
      .then( res => {
        commit( 'setUserPrefs', { ...state.userPrefs, theme_dark: theme } )
      } ).catch( e => console.log( e ) )
  },
  addNote( { commit, state }, note ) {
    const date = new Date(),
      createdNote = {
        ...note,
        recorded: date.getTime()
      }
    return this.$axios.post( '/user_notes.json', createdNote )
      .then( res => {
        commit( 'addNote', { ...createdNote, _id: res.data.name } )
      } ).catch( e => console.log( e ) )
  },
  updateNote( { commit, state }, note ) {
    const date = new Date(),
      updatedNote = {
        ...note,
        recorded: date.getTime()
      }
    return this.$axios.put( '/user_notes/' + note[ '_id' ] + '.json', updatedNote )
      .then( res => {
        commit( 'updateNote', updatedNote )
      } ).catch( e => console.log( e ) )
  },
  deleteNote( { commit, state }, id ) {
    return this.$axios.delete( '/user_notes/' + id + '.json' )
      .then( res => {
        commit( 'deleteNote', id )
      } ).catch( e => console.log( e ) )
  }
}

export const getters = {
  getUserLessons( state ) {
    return state.userLessons
  },
  getUserPrefs( state ) {
    return state.userPrefs
  },
  getUserNotes( state ) {
    return state.userNotes
  },
  getCourse( state ) {
    return state.course
  },
  getLesson( state ) {
    return state.lesson
  }
}