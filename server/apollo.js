import graphql from './graphql'
import jwt from './jwt'

export default {
  ...graphql,
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
}
