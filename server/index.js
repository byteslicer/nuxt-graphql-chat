import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import { execute, subscribe } from 'graphql';
import { PubSub } from 'graphql-subscriptions';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { Nuxt, Builder } from 'nuxt';

import typeDefs from '~/schema/main.gql'
import resolvers from '~/schema/main'

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

const app = express()
server.applyMiddleware({ app })

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

app.set('port', port)

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(nuxt.render)

  httpServer.listen(port, host)
  consola.ready({
    message: `Server ready at http://${host}:${port}${server.graphqlPath}`,
    badge: true
  })
}

start()
