import gql from 'graphql-tag';

import message from './message';
import user from './user';

const typeDef = gql`
  type Subscription
  type Mutation
  type Query
`;

export default {
  typeDefs: [typeDef, message.typeDef, user.typeDef],
  resolvers: [message.resolvers, user.resolvers],
};
