import { AuthenticationError, ForbiddenError } from 'apollo-server-express';
import uuidv4 from 'uuid/v4'; // eslint-disable-line import/no-extraneous-dependencies

import db from '@/server/db';
import jwt from '@/server/jwt';
import pw from '@/helpers/password';

export default {
  Query: {
    async me(root, args, context) {
      if (!context.user) {
        throw new AuthenticationError('Authentication required');
      }

      const user = await db('users').first('id', 'name').where('id', context.user.id);
      return user;
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
  },
};
