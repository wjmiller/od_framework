/*
TODO: Make activity ID for EventBus
*/

// event-bus.js
import Vue from 'vue';
export const ActivityBus = new Vue();

export const Activity = {
  // correctTests and completeTests run tests to see
  props: {
    attemptsAllowed: {
      default: 0,
      type: Number
    },
    activated: {
      default: true,
      type: Boolean
    },
    locked: {
      default: false,
      type: Boolean
    },
    correctTest: {
      type: [ Function, Array ]
    },
    completeTest: {
      type: [ Function, Array ]
    },
    attemptDataKeys: {
      type: Array
    },
    activityId: {
      type: String
    },
    activityBusOn: {
      type: Boolean,
      default: true
    },
    feedback: {
      type: Array
    }
  },
  data() {
    return {
      completed: false,
      correct: false,
      attemptData: [],
      attempts: 0,
      correctTests: [],
      completeTests: [],
      attemptDataKeysLocal: [],
      activityDescription: 'generic activity'
    }
  },
  methods: {
    makeAttempt() {
      this.attempts += 1
      this.beforeMakeAttempt()
      this.runTests()
      this.attemptData.push( this.$_makeAttemptData() )
      this.emitEvent( 'activity-attempted' )
      this.afterMakeAttempt()
      if ( this.correct ) {
        this.emitEvent( 'activity-correct' )
      }
      if ( this.completed ) {
        this.emitEvent( 'activity-completed' )
      }
    },
    reset() {
      this.completed = false
      this.correct = false
      this.attempts = 0
      this.attemptData = []
      this.emitEvent( 'activity-reset' )
    },
    emitEvent( ev ) {
      const data = Object.assign( {}, this.lastAttempt )
      if ( this.activityBusOn ) {
        ActivityBus.$emit( ev, {
          eventName: ev,
          activityId: `${window.location.href}#${this.activityId}`,
          description: this.activityDescription,
          data: data
        } )
      }
      this.$emit( ev, data )
    },
    testCorrect() {
      this.correct = this.correctTests.every( fn => fn( this ) )
    },
    testComplete() {
      this.completed = this.completeTests.every( fn => fn( this ) )
    },
    addCorrectTest( fn ) {
      if ( typeof fn === 'function' ) {
        this.correctTests.push( fn )
      }
    },
    addCompleteTest( fn ) {
      if ( typeof fn === 'function' ) {
        this.completeTests.push( fn )
      }
    },
    //override this method to perform functions unique to the activity before an attempt is made
    beforeMakeAttempt() {},
    //override this method to maintain control of how the testCorrect and testComplete methods are run
    runTests() {
      this.testCorrect()
      this.testComplete()
    },
    //override this method to perform functions after the attempt has been made
    afterMakeAttempt() {},
    //create the attempt data object
    $_makeAttemptData() {
      const data = {
        attemptsAllowed: this.attemptsAllowed,
        attempts: this.attempts,
        correct: this.correct,
        completed: this.completed
      }
      this.attemptDataKeysLocal.forEach( k => data[ k ] = this[ k ] )
      if ( this.attemptDataKeys ) {
        this.attemptDataKeys.forEach( k => data[ k ] = this[ k ] )
      }
      return data
    },
    //override this method to restore completion states
    restoreState( data ) {}
  },
  computed: {
    lastAttempt() {
      return this.attemptData[ Math.max( 0, this.attemptData.length - 1 ) ]
    },
    isActive() {
      return this.activated
    },
    activityStyles() {
      const styles = {
        'activity-completed': this.completed,
        'activity-correct': this.correct,
        'activity-incorrect': this.incorrect,
        'activity-attempted': this.attempts > 0,
        'activity-activated': this.activated,
        'activity-locked': this.locked
      }
      styles[ `activity-attempted-${this.attempts}` ] = this.attempts > 0
      return styles
    }
  },
  created() {
    //add any correct tests passed through props
    if ( this.correctTest ) {
      this.correctTests = []
      typeof this.correctTest === 'function' ? this.addCorrectTest( this.correctTest ) : this.correctTest.forEach( this.addCorrectTest )
    }
    //add any complete tests passed through props
    if ( this.completeTest ) {
      this.completeTests = []
      typeof this.completeTest === 'function' ? this.addCompleteTest( this.completeTest ) : this.completeTest.forEach( this.addCompleteTest )
    }
  },
  beforeMount() {
    //default complete test added if there was none configured
    //default test if the activity is correct or if the attempts has hit the number of attempts allowed
    if ( this.completeTests.length === 0 ) {
      this.addCompleteTest( function( v ) {
        return v.correct || ( v.attemptsAllowed > 0 && v.attempts >= v.attemptsAllowed )
      } )
    }
  }
};