import graphql from './graphql';
import jwt from './jwt';

export default {
  ...graphql,
  context: ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    }

    if (req && req.headers.authorization) {
      // check from req
      const [type, token] = req.headers.authorization.split(' ');
      if (type === 'Bearer') {
        const user = jwt.verify(token);
        if (user) {
          return { user };
        }
      }
    }
    return {};
  },
  subscriptions: {
    onConnect: (connectionParams /* , webSocket */) => {
      if (connectionParams.authorization) {
        const [type, token] = connectionParams.authorization.split(' ');
        if (type === 'Bearer') {
          const user = jwt.verify(token);
          if (user) {
            return { user };
          }
        }
      }

      throw new Error('Missing auth token!');
    },
  },
};
