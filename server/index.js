import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import { Nuxt, Builder } from 'nuxt';
import consola from 'consola';

import db from './db';
import apolloConfig from './apollo';

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

const server = new ApolloServer(apolloConfig);

const app = express();
server.applyMiddleware({ app });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');

config.dev = !(process.env.NODE_ENV === 'production');

app.set('port', port);

async function start() {
  await db('users').del();
  await db('messages').del();

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  app.use(nuxt.render);

  httpServer.listen(port, host);
  consola.ready({
    message: `Server ready at http://${host}:${port}${server.graphqlPath}`,
    badge: true,
  });
}

start();
