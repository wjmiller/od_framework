const cookieparser = process.server ? require( 'cookieparser' ) : undefined

export const state = () => ( {
  user_prefs: {},
  user_courses: [],
  user_lessons: [],
  user_activities: [],
  user_notes: [],
  course: {},
  lesson: {},
  token: null
} );

export const mutations = {
  set_token( state, token ) {
    state.token = token
  },
  clear_token( state ) {
    state.token = null
  },
  set_user( state, user ) {
    state.user = user
  },
  set_user_prefs( state, prefs ) {
    state.user_prefs = prefs
  },
  set_user_courses( state, courses ) {
    state.user_courses = courses
  },
  set_user_lessons( state, lessons ) {
    state.user_lessons = lessons
  },
  set_user_activities( state, activities ) {
    state.user_activities = activities
  },
  set_user_notes( state, notes ) {
    state.user_notes = notes
  },
  set_course( state, course ) {
    state.course = course
  },
  set_lesson( state, lesson ) {
    state.lesson = lesson
  },
  add_note( state, note ) {
    state.user_notes.push( note )
  },
  update_note( state, editted_note ) {
    const existing_note = state.user_notes.find( note => note[ '_id' ] === editted_note[ '_id' ] )
    Object.assign( existing_note, editted_note );
  },
  delete_note( state, id ) {
    const noteIx = state.user_notes.findIndex( note => note[ '_id' ] === id )
    state.user_notes.splice( noteIx, 1 )
  }
}

export const actions = {
  authenticate_user( { commit }, route ) {

    // Log into firebase with canned creds
    this.$axios.post( 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + process.env.fb_api_key, {
      email: 'will.miller@otahq.com',
      password: 'password',
      returnSecureToken: true
    } ).then( result => {
      // Store token to state
      commit( 'set_token', result.data.idToken )

      // Store user data
      commit( 'set_user', result.data )

      // Save token and token expiration info in cookies for server-side checks
      this.$cookies.set( 'user', result.data )
      this.$cookies.set( 'jwt', result.data.idToken )
      this.$cookies.set( 'expiration_date', new Date().getTime() + +result.data.expiresIn * 1000 )

      // Save token and token expiration info in cookies for client-side checks
      localStorage.setItem( 'user', JSON.stringify( result.data ) )
      localStorage.setItem( 'token', result.data.idToken )
      localStorage.setItem( 'token_expiration', new Date().getTime() + +result.data.expiresIn * 1000 )

      // Redirect to root
      this.$router.push( '/' );

    } ).catch( e => console.log( e ) )

  },
  async init_auth( { commit, dispatch, state }, req ) {
    let token, user, expiration_date

    // Identify if server-side and get cookie values
    if ( req ) {
      if ( !req.headers.cookie ) {
        return
      }

      token = cookieparser.parse( req.headers.cookie ).jwt
      user = cookieparser.parse( req.headers.cookie ).user

      if ( !token ) {
        return
      }
      expiration_date = cookieparser.parse( req.headers.cookie ).expiration_date

    }
    // Identify if client-side and get localStorage values
    else if ( process.client ) {
      user = localStorage.getItem( 'user' );
      token = localStorage.getItem( 'token' );
      expiration_date = localStorage.getItem( 'token_expiration' )
    }

    // If current time is > token exiration date or if no token, log user out
    if ( new Date().getTime() > +expiration_date || !token ) {
      dispatch( 'logout' )
      return;
    }

    // Update token state value
    commit( 'set_token', token )

    if ( token !== null && state.user_prefs.theme_dark == null ) {

      commit( 'set_user', JSON.parse( user ) )
      await dispatch( 'fetch_user_state' )
    }
  },
  async fetch_user_state( { state, commit } ) {
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

    commit( 'set_user_prefs', prefs.data )
    commit( 'set_user_courses', coursesArray.filter( course => course.user_id == state.user.localId ) )
    commit( 'set_user_lessons', lessonsArray.filter( lesson => lesson.user_id == state.user.localId ) )
    commit( 'set_user_activities', activitiesArray.filter( activities => activities.user_id == state.user.localId ) )
    commit( 'set_user_notes', notesArray.filter( note => note.user_id == state.user.localId ) )
  },
  change_theme( { commit, state }, theme ) {
    return this.$axios.put( '/user_preferences/' + state.user.localId + '.json', { ...state.user_prefs, theme_dark: theme } )
      .then( res => {
        commit( 'set_user_prefs', { ...state.user_prefs, theme_dark: theme } )
      } )
      .catch( e => console.log( e ) )
  },
  add_note( { commit, state }, note ) {
    const date = new Date(),
      created_note = {
        ...note,
        recorded: date.getTime()
      }
    return this.$axios.post( '/user_notes.json', created_note )
      .then( res => {
        commit( 'add_note', { ...created_note, _id: res.data.name } )
      } )
      .catch( e => console.log( e ) )
  },
  update_note( { commit, state }, note ) {
    const date = new Date(),
      updated_note = {
        ...note,
        recorded: date.getTime()
      }
    return this.$axios.put( '/user_notes/' + note[ '_id' ] + '.json', updated_note )
      .then( res => {
        commit( 'update_note', updated_note )
      } )
      .catch( e => console.log( e ) )
  },
  delete_note( { commit, state }, id ) {
    return this.$axios.delete( '/user_notes/' + id + '.json' )
      .then( res => {
        commit( 'delete_note', id )
      } )
      .catch( e => console.log( e ) )
  },
  logout( { commit } ) {
    // Set token state to null
    commit( 'clear_token' )

    // Remove token cookies
    this.$cookies.remove( 'jwt' )
    this.$cookies.remove( 'expiration_date' )

    // If client-side, remove token localStorages
    if ( process.client ) {
      localStorage.removeItem( 'token' )
      localStorage.removeItem( 'token_expiration' )
    }
  }
}

export const getters = {
  is_authenticated( state ) {
    return state.token !== null
  },
  get_user_lessons( state ) {
    return state.user_lessons
  },
  get_user_prefs( state ) {
    return state.user_prefs
  },
  get_user_notes( state ) {
    return state.user_notes
  },
  get_course( state ) {
    return state.course
  },
  get_lesson( state ) {
    return state.lesson
  }
}