const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

const startTime = (new Date).getTime();

module.exports = nuxtConfig => {
  return {
    /**
     * 'render:setupMiddleware'
     * {@link node_modules/nuxt/lib/core/renderer.js}
     */
    setupMiddleware(app) {
      app.use(cookieParser())
      app.use((req, res, next) => {
        if (req.path == '/') {
          const decoded = jwt.decode(req.cookies['apollo-token'], {complete: true});
          if('apollo-token' in req.cookies && decoded && startTime < decoded.iat) {
            next()
          } else {
            res.clearCookie('apollo-token', { path: '/' });
            res.redirect('/login')
          }
        } else {
          next()
        }

      })
    }
  }
}
