import uuidv4 from 'uuid/v4'; // eslint-disable-line import/no-extraneous-dependencies
import { withFilter } from 'graphql-subscriptions';
import { AuthenticationError } from 'apollo-server-express';
import moment from 'moment';

import db from '@/server/db';
import pubsub from '@/server/pubsub';

const MESSAGE_ADDED = 'MESSAGE_ADDED';

export default {
  Subscription: {
    messageAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(
        () => pubsub.asyncIterator([MESSAGE_ADDED]),
        (payload, variables, context) => payload.messageAdded.user.id !== context.user.id,
      ),
    },
  },
  Query: {
    async messages(/* root, args, context */) {
      const messages = await db('messages').select([
        'messages.*',
        'users.name as username',
      ]).leftJoin('users', 'messages.userId', 'users.id');

      return messages.map(x => ({
        id: x.id,
        user: { id: x.userId, name: x.username },
        content: x.content,
        createdAt: moment(x.createdAt).format(),
      }));
    },
  },
  Mutation: {
    async addMessage(root, args, context) {
      if (!context.user) {
        throw new AuthenticationError('Authentication required');
      }

      const data = {
        id: uuidv4(),
        userId: context.user.id,
        content: args.content,
      };

      await db('messages').insert(data);
      const user = await db('users').first('id', 'name').where('id', context.user.id);

      const message = {
        user,
        id: data.id,
        content: data.content,
        createdAt: moment().format(),
      };

      pubsub.publish(MESSAGE_ADDED, { messageAdded: message });

      return message;
    },
  },
};
