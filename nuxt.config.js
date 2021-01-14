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
  ],
  
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          OK: 'OK',
          ONE_FILE_ALLOWED: 'Drop just one audio clip on the pad',
          ONLY_AUDIO_ALLOWED: 'Only wav/mp3 files allowed'
        }
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
