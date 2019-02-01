const path = require('path')

module.exports = {
  webpack: (config, options, webpack) => {
    config.entry.main = './server/index.js'
    //config.entry.initDb = './server/initDb.js'

    config.resolve.alias = {
       '~': path.resolve(__dirname),
    }

    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    })

    return config
  }
}
