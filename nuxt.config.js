const hooks = require('./hooks')
const pkg = require('./package')

module.exports = {
  mode: 'universal',
  dev: (process.env.NODE_ENV !== 'production'),

  hooks: hooks(this),

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'theme-color', content: '#0B1924' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
    '@/assets/css/main.css'
  ],

  plugins: [
    '@/plugins/vue-chat-scroll.client.js'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
//    'nuxt-buefy',
    '@nuxtjs/apollo',
    ['nuxt-fontawesome', {
      imports: [
        //import whole set
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['faCog', 'faEdit']
        }
      ]
    }]
  ],

  apollo: {
    includeNodeModules: true,
    tokenExpires: 7,
    clientConfigs: {
      default: {
        httpEndpoint: process.env.HTTP_ENDPOINT || 'http://192.168.1.194:3000/graphql',
        wsEndpoint: process.env.WS_ENDPOINT || 'ws://192.168.1.194:3000/graphql'
      }
    },
  }
}
