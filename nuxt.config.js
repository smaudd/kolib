import en from './assets/i18n/en.json'

export default {
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/web-worker.js', ssr: false } 
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    'nuxt-i18n',
    ['@nuxtjs/firebase',
    {
      config: {
        apiKey: "AIzaSyBzwl4SyuE1Lg30YtgEknZRDw7R9tRxF_U",
        authDomain: "kolib-1.firebaseapp.com",
        projectId: "kolib-1",
        storageBucket: "kolib-1.appspot.com",
        messagingSenderId: "816854528141",
        appId: "1:816854528141:web:68ccd613b6c82481fab2c4",
        measurementId: "G-MLCH3V5R8R"
      },
      services: {
        auth: true, // Just as example. Can be any other service.
        firestore: true,
        storage: true,
      }
    }]
  ],
  
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en
      }
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
         test: /\.worker\.js$/,
         loader: 'worker-loader',
         exclude: /(node_modules)/
        })
       }
    },
  },
  buildModules: ['@nuxtjs/tailwindcss']
};
