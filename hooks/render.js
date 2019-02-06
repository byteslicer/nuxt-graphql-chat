module.exports = nuxtConfig => {
  return {
    /**
     * 'render:setupMiddleware'
     * {@link node_modules/nuxt/lib/core/renderer.js}
     */
    setupMiddleware(app) {
      app.use((req, res, next) => {
        if (req.path == '/') {
          console.log(req.path)
          const cookie = req.get('cookie')
          if(cookie && cookie.match(/apollo-token/)) {
            next()
          } else {
            console.log(req.originalUrl)
            res.redirect('/login')
          }
        } else {
          next()
        }

      })
    }
  }
}
