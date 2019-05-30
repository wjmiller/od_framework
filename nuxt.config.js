const pkg = require( './package' )
const axios = require( 'axios' )

export default {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'en'
    },
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
    script: [
      { src: '/js/xapi.min.js' }
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
  loading: { color: '#fff' },

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
      src: '~plugins/vue-timeago'
    },
    {
      src: '~plugins/xapi',
      ssr: false
    },
    {
      src: '~plugins/vue-dialog',
      ssr: false
    },
    {
      src: '~plugins/vue-awesome-countdown',
      ssr: false
    },
    {
      src: '~plugins/vue-slider-component',
      ssr: false
    },
    {
      src: '~plugins/vue-draggable',
      ssr: false
    },
    {
      src: '~plugins/vue-spinners',
      ssr: false
    },
    {
      src: '~plugins/vue-select',
      ssr: false
    }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios',
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