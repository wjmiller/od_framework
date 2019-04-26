const pkg = require( './package' )
const axios = require( 'axios' )
const body_parser = require( 'body-parser' )


module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [ {
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: pkg.description
      }
    ],
    link: [ {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://use.typekit.net/usr8yii.css'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#fff'
  },

  /*
   ** Global CSS
   */
  css: [
    '@/assets/scss/main.scss'
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [ {
    src: '~plugins/vue-js-toggle-button',
    ssr: false
  } ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
    'cookie-universal-nuxt',
    [
      'nuxt-fontawesome', {
        component: 'fa',
        imports: [ {
            set: '@fortawesome/free-regular-svg-icons',
            icons: [ 'far' ]
          },
          {
            set: '@fortawesome/free-solid-svg-icons',
            icons: [ 'fas' ]
          }
        ]
      }
    ]
  ],

  loading: false,

  transition: {
    name: 'fade',
    mode: 'out-in'
  },
  /*
   ** Axios module configuration
   */
  axios: {
    baseURL: process.env.BASE_URL || 'https://ota-course-framework.firebaseio.com'
  },

  env: {
    baseUrl: process.env.BASE_URL || 'https://ota-course-framework.firebaseio.com',
    fb_api_key: 'AIzaSyBirEEfUTCVTvOaYG7HHhol-YGSYzlm3sw'
  },

  serverMiddleware: [
    body_parser.json(),
    '~/api'
  ],

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend( config, ctx ) {}
  }
}