const moment = require('moment')
const uuidv1 = require('uuid/v1');
const { PubSub } = require('apollo-server-express');
const pubsub = new PubSub();

const POST_ADDED = 'POST_ADDED';

const posts = []

export default {
  Subscription: {
    postAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([POST_ADDED]),
    },
  },
  Query: {
    posts(root, args, context) {
      return posts;
    },
  },
  Mutation: {
    addPost(root, args, context) {
      let post = {
        ...args,
        id: uuidv1(),
        time: moment().format()
      }
      pubsub.publish(POST_ADDED, { postAdded: post })
      posts.push(post)
      return post
    },
  },
};
