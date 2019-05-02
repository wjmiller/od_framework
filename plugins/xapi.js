/* global ADL */

import Vue from 'vue'
import { ActivityBus } from '../mixins/activity.js'

const mapActivities = {
  'activity-completed': 'completed',
  'activity-attempted': 'attempted'
}

function makeResultData( attemptData ) {
  const mapResults = {
    'correct': 'success',
    'completed': 'completion'
  }
  const data = {}
  //const data = {extensions: {}}
  for ( let k in attemptData ) {
    if ( mapResults[ k ] ) {
      data[ mapResults[ k ] ] = attemptData[ k ]
    }
    /*
     else {
      data.extensions[k] = attemptData[k]
    }
    */
  }
  return data
}

ADL.XAPIWrapper.changeConfig( { strictCallbacks: true } );

const xAPI = {
  setEvents( events ) {
    events.forEach( ev => ActivityBus.$on( ev, this.processEvent ) )
  },

  processEvent: function( attemptData ) {
    const eventName = mapActivities[ attemptData.eventName ]
    const resultData = makeResultData( attemptData.data )
    // eslint-disable-next-line
    console.log( resultData )
    const stmt = new ADL.XAPIStatement(
      new ADL.XAPIStatement.Agent( 'mailto:' + fb.auth.currentUser.email, fb.auth.currentUser.name ),
      new ADL.XAPIStatement.Verb( `http://adlnet.gov/expapi/verbs/${eventName}`, eventName ),
      new ADL.XAPIStatement.Activity( attemptData.activityId, attemptData.description )
    )
    stmt.result = resultData
    stmt.generateId()

    ADL.XAPIWrapper.sendStatement( stmt, ( err, resp, obj ) => {
      // eslint-disable-next-line
      if ( err ) { console.log( err ) } else { console.log( resp, obj ) }
    } );
  }
}

export default xAPI;


Vue.use( xAPI );