/*
TODO: Make activity ID for EventBus
*/

// event-bus.js
import Vue from 'vue';
export const ActivityBus = new Vue();

export const Activity = {
  // correctTests and completeTests run tests to see
  props: {
    //Indicates how many attempts are allowed before the activity is completed. attemptsAllowed = 0 indicates unlimited attempts
    attemptsAllowed: {
      default: 0,
      type: Number
    },
    //Indicates whether or not the activity can be manipulated or not. Typically, when the activity is completed, it should not be activated.
    activated: {
      default: true,
      type: Boolean
    },
    //Indicates if the activity is locked, meaning hidden from view until another activity is completed
    locked: {
      default: false,
      type: Boolean
    },
    //correctTest is an array of functions or a single function with the instance of the activty component as the argument, returning true or false
    correctTest: {
      type: [ Function, Array ]
    },
    //completeTest is an array of functions or a single function with the instance of the activty component as the argument, returning true or false. A default completeTest is added to the component beforeMount if there is nothing passed in the prop
    completeTest: {
      type: [ Function, Array ]
    },
    //The attemptDataKeys array should hold the names of all the keys in the activity component instance that will be saved on each attempt
    attemptDataKeys: {
      type: Array
    },
    //A string indicating the unique type of activity
    activityId: {
      type: String
    },
    //Activities automatically send events through a separate event bus for all activities. This property can turn it off for any activity.
    activityBusOn: {
      type: Boolean,
      default: true
    },
    //An array of feedback objects {name: '', text: ''} that can be used in feedback. Only used if feedback is an important part of the component
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
    //Increments the attempts and determines if the activity is correct and complete
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
    //Resets the activity data, also emits the activity-reset event so that parent components can run additional methods
    reset() {
      this.completed = false
      this.correct = false
      this.attempts = 0
      this.attemptData = []
      this.emitEvent( 'activity-reset' )
    },
    //All events are emitted using this method so that the data can be
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
      // Fired for all activity events 'activity-reset', 'activity-completed', 'activity-correct', 'activity-attempted'
      // @arg The data emitted is the last attempt
      this.$emit( ev, data )
    },
    //Evaluates all of the correct tests and returns true if all tests are true or false if any return false
    testCorrect() {
      this.correct = this.correctTests.every( fn => fn( this ) )
    },
    //Evaluates all of the complete tests and returns true if all tests are true or false if any return false
    testComplete() {
      this.completed = this.completeTests.every( fn => fn( this ) )
    },
    //adds in
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
    // returns the last attempt from the attemptData data property
    lastAttempt() {
      return this.attemptData[ Math.max( 0, this.attemptData.length - 1 ) ]
    },
    // returns true or false value for the activated property
    isActive() {
      return this.activated
    },
    // generates an object with true/false values for all the possible style class names that can be added to the component
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
