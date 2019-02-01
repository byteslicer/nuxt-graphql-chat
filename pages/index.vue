<template>
  <div class="wrapper">
    <div ref="body" class="body">
      <div class="messages">
        <Message v-for="post in posts" :author="post.author" :message="post.comment" :time="post.time"/>
      </div>
    </div>
    <form class="chat-control" @submit.prevent="addPost">
      <button type="submit" class="button">SEND</button>
      <input v-model="chatInput" class="chat-input" type="text" />
    </form>
  </div>
</template>

<style scoped>
  .wrapper {
    display: flex;
    height: 100vh;
    flex-direction: column;
    background-color: rgb(11, 25, 36);
    color: rgba(255, 255, 255, 0.6);

    height: calc(var(--vh, 1vh) * 100);
  }

  .body {
    display: flex;
    flex: 1;
    overflow-y: scroll;
  }

  .chat-control {
    color: rgba(255, 255, 255, 0.6);
    background-color: rgb(15, 32, 45);
    margin: 10px;
    border-radius: 10px;
  }

  .chat-input {
    color: rgba(255, 255, 255, 0.6);
    background-color: rgb(15, 32, 45);
    margin: 0;
    border: none;
    border-left: 1px solid rgb(11, 25, 36);
    font-size: 1.0rem;
    padding: 10px;
  }

  .chat-input:focus {
    outline: none;
  }

  .chat-input:placeholder {
    color: rgb(85, 94, 102);
  }

  .messages {
    flex: 1;
  }

  .messages:first-child { border-top: none; }

  .body::-webkit-scrollbar {
     width: 0.5em;
  }

  .body::-webkit-scrollbar-thumb {
    background-color: rgb(23, 43, 58);
    outline: 1px solid slategrey;
  }
</style>

<script>
import moment from 'moment'

import gql from 'graphql-tag';
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
  components: { Message },
  data() {
    return {
      username: "Byteslicer",
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
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: POST_QUERY })
          // Add our tag from the mutation to the end
          data.posts.push(addPost)
          // Write our data back to the cache.
          store.writeQuery({ query: POST_QUERY, data })
        },

        optimisticResponse: {
        __typename: 'Mutation',
        addTag: {
          __typename: 'Post',
          id: -1,
          author: this.username,
          comment: message
        },
      },

      })
      .then(() => {
        this.$refs.body.scrollTop = this.$refs.body.scrollHeight;
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
          const index = previousResult.messages.findIndex(
            p => p.id === subscriptionData.data.postAdded.id
          )

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
