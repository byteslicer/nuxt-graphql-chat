<template>
  <div class="site">
    <modal name="edit">
      Hello World
    </modal>
    <Sidebar class="left" :username="username"/>
    <div ref="messages" class="messages">
      <Message v-for="post in posts" :key="post.id" :author="post.author" :message="post.comment" :time="post.time" />
    </div>
    <ChatInput class="chat-input" v-model="chatInput" @submit="addPost" />
  </div>
</template>

<style scoped>
  .site {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 50px;

    grid-template-areas:
    "left content"
    "left input";

    grid-column-gap: 10px;
    grid-row-gap: 10px;

    box-sizing: border-box;
    height: 100vh;

    background-color: #12293b;
    color: rgba(255, 255, 255, 0.6);
  }

  @media screen and (max-width: 600px) {
    .site {
      grid-template-areas:
      "content content"
      "input input";
    }
  }

  .left {
    grid-area: left;
  }

  .messages {
    grid-area: content;
    flex: 1;
    overflow-y: scroll;
  }

  .chat-input {
    grid-area: input;
    box-sizing: content-box;
    margin-bottom: 10px;
    margin-right: 10px;
  }

  .messages:first-child { border-top: none; }

  .messages::-webkit-scrollbar {
     width: 0.5em;
  }

  .messages::-webkit-scrollbar-thumb {
    background-color: rgb(23, 43, 58);
    outline: 1px solid slategrey;
  }
</style>

<script>
import moment from 'moment'

import gql from 'graphql-tag';
import Sidebar from '@/components/sidebar'
import ChatInput from '@/components/chat-input'
import Message from '@/components/message'

const POST_QUERY = gql`{
  posts {
    id
    author
    comment
    time
 }
}`

export default {
  components: { Message, ChatInput, Sidebar },
  data() {
    return {
      username: "Peter",
      chatInput: ""
    }
  },

  beforeMount() {
    // Calculating vh unit because on mobile 100vh is not 100% of screen size
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    window.addEventListener('resize', () => {
      // We execute the same script as before
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  },

  mounted() {

  },

  methods: {
    addPost() {
      if (this.chatInput.length <= 0) return;

      const message = this.chatInput
      this.chatInput = ''

      this.$apollo.mutate({
        mutation: gql`
          mutation($author: String, $comment: String) {
            addPost(author: $author, comment: $comment) {
              id
              author
              comment
            }
          }
        `,
        variables: {
          author: this.username,
          comment: message
        },

        // Update the cache with the result
        // The query will be updated with the optimistic response
        // and then with the real result of the mutation
        update: (store, { data: { addPost } }) => {
          console.log("A")
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: POST_QUERY })
          // Add our tag from the mutation to the end
          data.posts.push(addPost)
          // Write our data back to the cache.
          store.writeQuery({ query: POST_QUERY, data })
        },

        optimisticResponse: {
        __typename: 'Mutation',
        addPost: {
          __typename: 'Post',
          id: -1,
          author: this.username,
          comment: message,
          time: moment().format()
        },
      },

      })
      .then(() => {
        this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
      })
      .catch((error) => {
        this.chatInput = message
      })
    }
  },

  apollo: {
    posts: {
      query: POST_QUERY,
      subscribeToMore: {
        document: gql`subscription {
          postAdded {
            id
            author
            comment
            time
          }
        }`,
        updateQuery: (previousResult, { subscriptionData }) => {

          const index = previousResult.posts.findIndex(
            p => p.id === subscriptionData.data.postAdded.id
          )
          console.log("B")
          console.log(index)

          if (index !== -1 ) return previousResult;

          return {
            posts: [
              ...previousResult.posts,
              subscriptionData.data.postAdded
            ]
          }
        }
      }
    }
  }
}
</script>
