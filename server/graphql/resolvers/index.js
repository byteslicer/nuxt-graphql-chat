import moment from 'moment';
import uuidv4 from 'uuid/v4'; // eslint-disable-line import/no-extraneous-dependencies
import { PubSub, ForbiddenError, AuthenticationError } from 'apollo-server-express';
import { withFilter } from 'graphql-subscriptions';

import db from '@/server/db';
import jwt from '@/server/jwt';
import pw from '@/helpers/password';

const pubsub = new PubSub();

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
    async me(root, args, context) {
      if (!context.user) {
        throw new AuthenticationError('Authentication required');
      }

      const user = await db('users').first('id', 'name').where('id', context.user.id);
      return user;
    },

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
    async signup(root, args, context) {
      if (context.user) {
        throw new ForbiddenError('Already logged in');
      }

      const exists = await db('users').first('id').where('name', args.username);
      if (exists) {
        throw new ForbiddenError('Username already exists!');
      }

      const salt = pw.salt();
      const password = await pw.hash(args.password, salt);

      const id = uuidv4();

      await db('users').insert({
        id,
        salt,
        password,
        name: args.username,
      });

      return jwt.sign({ id });
    },


    async login(root, args, context) {
      if (context.user) {
        throw new ForbiddenError('Already logged in');
      }

      try {
        const user = await db('users').first('id', 'password', 'salt').where('name', args.username);
        const hash = await pw.hash(args.password, user.salt);

        if (hash === user.password) {
          return jwt.sign({ id: user.id });
        }

        throw new AuthenticationError('Wrong username or password');
      } catch (e) {
        throw new AuthenticationError('Wrong username or password');
      }
    },

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
