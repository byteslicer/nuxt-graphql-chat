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
import jwt from './jwt'

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3000

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context

   } else if(req && req.headers.authorization) {
     // check from req
     let [type, token] = req.headers.authorization.split(' ');
     if (type === "Bearer") {
       let user = jwt.verify(token)
       if (user)
        return { user };
     }
   }
 },
 subscriptions: {
    onConnect: (connectionParams, webSocket) => {
      if (connectionParams.authorization) {
        let [type, token] = connectionParams.authorization.split(' ');
        if (type === "Bearer") {
          let user = jwt.verify(token)
          if (user) {
            return { user };
          }
        }
      }

      throw new Error('Missing auth token!');
    },
  },
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
