const moment = require('moment')
const crypto = require('crypto');
const uuidv4 = require('uuid/v4');
const { PubSub, ForbiddenError, AuthenticationError } = require('apollo-server-express');
const { withFilter } = require('graphql-subscriptions');

const db = require('~/server/db')
const jwt = require('~/server/jwt')
const pubsub = new PubSub();

const MESSAGE_ADDED = 'MESSAGE_ADDED';

const pbkdf2 = (secret, salt) => new Promise((res, rej) => crypto.pbkdf2(secret, salt, 100000, 64, 'sha512', (err, derivedKey) => {
  if (err) return rej(err)
  res(derivedKey)
}))

export default {
  Subscription: {
    messageAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: withFilter(() => pubsub.asyncIterator([MESSAGE_ADDED]), (payload, variables, context, info) => {
        //console.log("withFilter", payload)
        return payload.messageAdded.user.id !== context.user.id
      })
    },
  },
  Query: {
    async me(root, args, context) {
      if (!context.user)
        throw new AuthenticationError('Authentication required');

      let user = await db('users').first('id', 'name').where('id', context.user.id)

      return user
    },

    async messages(root, args, context) {
      let messages = await db('messages').select([
        'messages.*',
        'users.name as username'
      ]).leftJoin('users', 'messages.userId', 'users.id')

      //console.log("messages", messages)
      return messages.map(x => {
        return {
          id: x.id,
          user: { id: x.userId, name: x.username },
          content: x.content,
          createdAt: moment(x.createdAt).format()
        }
      })
    },
  },
  Mutation: {
    async signup(root, args, context) {
      if (context.user) {
        throw new ForbiddenError('Already logged in')
      }

      let exists = await db('users').first('id').where('name', args.username)
      if(exists) {
        throw new ForbiddenError('Username already exists!')
      }

      let salt = crypto.randomBytes(32).toString('hex');
      let passwordHash = await pbkdf2(args.password, salt)

      let id = uuidv4();

      await db('users').insert({
        id: id,
        name: args.username,
        salt: salt,
        password: passwordHash.toString('hex')
      })

      return jwt.sign({ id: id })
    },


    async login(root, args, context) {
      if (context.user) {
        throw new ForbiddenError('Already logged in')
      }

      try {
        let user = await db('users').first('id', 'password', 'salt').where('name', args.username)
        let hash = await pbkdf2(args.password, user.salt)

        if(hash.toString('hex') === user.password) {
          return jwt.sign({ id: user.id })
        }

        throw new AuthenticationError('Wrong username or password')

      } catch(e) {
        throw new AuthenticationError('Wrong username or password')
      }
    },

    async addMessage(root, args, context) {
      if (!context.user)
        throw new AuthenticationError('Authentication required');

      let data = {
        id: uuidv4(),
        userId: context.user.id,
        content: args.content
      }

      await db('messages').insert(data)
      let user = await db('users').first('id', 'name').where('id', context.user.id)

      let message = {
        id: data.id,
        user: user,
        content: data.content,
        createdAt: moment().format()
      }

      //console.log("addMessage", user)

      pubsub.publish(MESSAGE_ADDED, { messageAdded: message })

      return message
    },
  },
};
