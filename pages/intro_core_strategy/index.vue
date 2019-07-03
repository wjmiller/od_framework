<template>
<b-container>
  <b-row>
    <b-col>
      <nuxt-link class="btn btn-secondary"
                 to="/">
        <fa :icon="['fas', 'chevron-left']"
            aria-label="left arrow" /> My Courses</nuxt-link>
    </b-col>
  </b-row>
  <b-row class="intro-container">
    <b-col md="6"
           lg="7">
      <div class="course-info">
        <h1 class="course-title">Intro to Core Strategy</h1>
        <b-progress v-bind:value="progress"></b-progress>
        <div class="course-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</div>
        <b-badge pill>3.5 hrs</b-badge>
      </div>
    </b-col>
    <b-col md="6"
           lg="5">
      <video-player source="../videos/life_of_candle.mp4"
                    poster="../images/video_posters/life_of_candle.png" />
    </b-col>
  </b-row>
  <b-row>
    <b-col class="course-lessons">
      <h2>Lessons</h2>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/maximize_profit"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Maximize Your Profit</h5>
              <b-badge pill>10 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Maximize Your Profit
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/chart_components"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Chart Components</h5>
              <b-badge pill>10 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Chart Components
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/candle_components"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Components of a Candle</h5>
              <b-badge pill>15 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Components of a Candle
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/skill_check_1"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Skill Check 1</h5>
              <b-badge pill>5 min</b-badge>
            </div>
            <p>Here is a description for Skill Check 1.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/how_price_moves"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>How Price Moves</h5>
              <b-badge pill>10 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the How Price Moves
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/candle_sentiment"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Candle Sentiment</h5>
              <b-badge pill>12 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Candle Sentiment
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/candle_structure"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Candle Structure</h5>
              <b-badge pill>12 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Candle Structure
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/skill_check_2"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Skill Check 2</h5>
              <b-badge pill>6 min</b-badge>
            </div>
            <p>Here is a description for Skill Check 2.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/gaps"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Gaps</h5>
              <b-badge pill>10 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Gaps
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/wholesale_vs_retail"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Wholesale vs Retail</h5>
              <b-badge pill>8 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Wholesale vs Retail
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/skill_check_3"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Skill Check 3</h5>
              <b-badge pill>5 min</b-badge>
            </div>
            <p>Here is a description for Skill Check 3.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/order_states"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Order States</h5>
              <b-badge pill>8 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Order States
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/probability"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Probability</h5>
              <b-badge pill>12 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Probability
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/skill_check_4"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Skill Check 4</h5>
              <b-badge pill>8 min</b-badge>
            </div>
            <p>Here is a description for Skill Check 4.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/formations"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Formations</h5>
              <b-badge pill>15 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Formations
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/reward_and_risk"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Reward and Risk</h5>
              <b-badge pill>15 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Reward and Risk
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/skill_check_5"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Skill Check 5</h5>
              <b-badge pill>10 min</b-badge>
            </div>
            <p>Here is a description for Skill Check 5.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/trend"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Trend</h5>
              <b-badge pill>12 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Trend
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/impulse_and_correction"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Impulse and Correction</h5>
              <b-badge pill>14 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Impulse and Correction
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/skill_check_6"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Skill Check 6</h5>
              <b-badge pill>8 min</b-badge>
            </div>
            <p>Here is a description for Skill Check 6.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/inside_outside_gaps"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Inside and Outside Gaps</h5>
              <b-badge pill>8 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Inside and Outside Gaps
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/professional_novice_gaps"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Professional and Novice Gaps</h5>
              <b-badge pill>6 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Professional and Novice Gaps
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/maximize_profit_revisited"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Maximize Your Profit Revisited</h5>
              <b-badge pill>10 min</b-badge>
            </div>
            <p>Here is a description for this lesson. It briefly explains what is covered in the Maximize Your Profits Revisited
              lesson.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
      <b-list-group>
        <nuxt-link to="/intro_core_strategy/skill_check_final"
                   class="list-group-item list-group-item-action">
          <div class="icon-play"></div>
          <div>
            <div>
              <h5>Final Skill Check</h5>
              <b-badge pill>20 min</b-badge>
            </div>
            <p>Here is a description for Final Skill Check.</p>
            <b-progress v-bind:value="progress">
            </b-progress>
          </div>
        </nuxt-link>
      </b-list-group>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
import VideoPlayer from '~/components/activities/video_player'

export default {
  fetch( {
    store
  } ) {
    const course = {
        id: 'intro_core',
        title: 'Intro to Core Strategy'
      },
      lesson = {
        id: 'intro_core_home',
        title: 'Home'
      }

    store.commit( 'setCourse', course )
    store.commit( 'setLesson', lesson )
  },
  data() {
    return {
      progress: 40
    }
  },
  components: {
    VideoPlayer
  }
}
</script>

<style lang="scss" scoped>
// -----------------------------------------------------
// Course Information
// -----------------------------------------------------

.course-info {
    margin-bottom: 2.5rem;

    @media(min-width: 768px) {
        margin-bottom: 0;
    }

    .course-title {
        margin: 2.5rem 0 1.4rem;
        font-size: 3.2rem;
    }
    .progress {
        width: 5.6rem;
        height: 0.7rem;
        border-radius: 0.35rem;
    }
    .course-description {
        font-size: 1.05rem;
        margin: 0.9rem 0;
    }
}

// -----------------------------------------------------
// Lesson Listings
// -----------------------------------------------------

.course-lessons {

    @media (min-width: 768px) {
        margin: 0 0 0 1.2rem;
    }

    h2 {
        margin-bottom: 0.8rem;

        @media (min-width: 768px) {
            margin-bottom: 0.5rem;
        }
    }

    .list-group-item {
        display: flex;
        flex-direction: row;

        .icon-play {
            display: none;
            font-size: 3.5rem;
            margin: 0 0.7rem 0 0;
        }

        h5 {
            font-size: 1.15rem;
            margin: 0 0.9rem 0.6rem 0;
        }

        .badge {
            margin-bottom: 0.6rem;
        }

        .progress {
            width: 5.6rem;
            height: 0.7rem;
            border-radius: 0.35rem;
        }

        @media (min-width: 768px) {
            .icon-play {
                display: block;
            }

            h5 {
                margin: 0 0.9rem 0.3rem 0;
            }

            .badge {
                margin-bottom: 0.3rem;
            }
        }
    }
}
</style>
