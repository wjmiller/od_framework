const cookieparser = process.server ? require( 'cookieparser' ) : undefined

export const state = () => ( {
  user_prefs: {},
  user_courses: [],
  user_lessons: [],
  user_activities: [],
  token: null
} );

export const mutations = {
  set_token( state, data ) {
    state.token = data
  },
  clear_token( state, data ) {
    state.token = null
  },
  set_user( state, data ) {
    state.user = data
  },
  set_user_prefs( state, data ) {
    state.user_prefs = data
  },
  set_user_courses( state, data ) {
    state.user_courses = data
  },
  set_user_lessons( state, data ) {
    state.user_lessons = data
  },
  set_user_activities( state, data ) {
    state.user_activities = data
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

    if ( token !== null && state.user_prefs.theme_dark !== null ) {

      commit( 'set_user', JSON.parse( user ) )
      await dispatch( 'fetch_user_state' )
    }
  },
  async fetch_user_state( { state, commit } ) {
    const coursesArray = [],
      lessonsArray = [],
      activitiesArray = []

    const [ prefs, courses, lessons, activities ] = await Promise.all( [
      await this.$axios.get( '/user_preferences/' + state.user.localId + '.json' ),
      await this.$axios.get( '/user_courses/' + state.user.localId + '.json' ),
      await this.$axios.get( '/user_lessons/' + state.user.localId + '.json' ),
      await this.$axios.get( '/user_activities/' + state.user.localId + '.json' )
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

    commit( 'set_user_prefs', prefs.data )
    commit( 'set_user_courses', coursesArray )
    commit( 'set_user_lessons', lessonsArray )
    commit( 'set_user_activities', activitiesArray )
  },
  change_theme( { commit, state }, theme ) {
    return this.$axios.put( '/user_preferences/' + state.user.localId + '.json', { ...state.user_prefs, theme_dark: theme } )
      .then( res => {
        commit( 'set_user_prefs', { ...state.user_prefs, theme_dark: theme } )
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
  get_user_prefs( state ) {
    return state.user_prefs
  }
}