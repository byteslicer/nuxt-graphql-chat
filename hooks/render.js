const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const startTime = Math.round((new Date()).getTime() / 1000);

module.exports = (/* nuxtConfig */) => ({
  /**
   * 'render:setupMiddleware'
   * {@link node_modules/nuxt/lib/core/renderer.js}
   */
  setupMiddleware(app) {
    app.use(cookieParser());
    app.use((req, res, next) => {
      if (req.path === '/' || req.path === '/login' || req.path === '/signup') {
        const decoded = jwt.decode(req.cookies['apollo-token'], { complete: true });
        if ('apollo-token' in req.cookies && decoded && startTime < decoded.payload.iat) {
          next();
        } else {
          res.clearCookie('apollo-token', { path: '/' });

          if (req.path !== '/login' && req.path !== '/signup') {
            res.redirect('/login');
          } else {
            next();
          }
        }
      } else {
        next();
      }
    });
  },
});
