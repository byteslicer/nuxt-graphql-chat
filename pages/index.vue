<template>
  <div class="site">

    <Sidebar class="left" :username="me.name"/>

    <div ref="messages" class="messages">
      <Message v-for="message in messages"
        :key="message.id"
        :author="message.user ? message.user.name : 'UserNotFound'"
        :message="message.content"
        :time="message.createdAt"
        :loading="message.id === -1" />
    </div>
    <ChatInput class="chat-input" v-model="chatInput" @submit="addMessage" />
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
    height: calc(var(--vh, 1vh) * 100);
  }

  @media screen and (max-width: 600px) {
    .site {
      grid-template-areas:
      "content content"
      "input input";
    }

    .left {
      display: none;
    }

    .chat-input {
      margin-left: 10px;
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
    background-color: #17374f;
    outline: 1px solid slategrey;
  }
</style>

<script>
import moment from 'moment'

import gql from 'graphql-tag';
import Sidebar from '@/components/sidebar'
import ChatInput from '@/components/chat-input'
import Message from '@/components/message'

const MESSAGE_QUERY = gql`{
  messages {
    id
    user {
      id
      name
    }
    content
    createdAt
 }
}`

export default {
  components: { Message, ChatInput, Sidebar },
  data() {
    return {
      me: { name: '' },
      chatInput: ""
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      const hasToken = !!vm.$apolloHelpers.getToken()
      if (!hasToken) {
        vm.$router.push({ path: 'login' })
      }
    })
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
    addMessage() {
      if (this.chatInput.length <= 0) return;

      const message = this.chatInput
      this.chatInput = ''

      this.$apollo.mutate({
        mutation: gql`
          mutation($content: String) {
            addMessage(content: $content) {
              id
              user {
                id
                name
              }
              content
              createdAt
            }
          }
        `,
        variables: {
          content: message
        },

        // Update the cache with the result
        // The query will be updated with the optimistic response
        // and then with the real result of the mutation
        update: (store, { data: { addMessage } }) => {
          // Read the data from our cache for this query.
          const data = store.readQuery({ query: MESSAGE_QUERY })
          // Add our tag from the mutation to the end
          data.messages.push(addMessage)
          // Write our data back to the cache.
          store.writeQuery({ query: MESSAGE_QUERY, data })


          this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
        },

        optimisticResponse: {
        __typename: 'Mutation',
        addMessage: {
          __typename: 'Message',
          id: -1,
          user: {
            __typename: 'User',
            id: -1,
            name: this.me.name
          },
          content: message,
          createdAt: moment().format()
        },
      },

      })
      .catch((error) => {
        console.error(error)
        this.chatInput = message
      })
    }
  },

  apollo: {
    me: {
      query: gql`{
        me {
          id,
          name
        }
      }`,
      prefetch: false,
    },
    messages: {
      query: MESSAGE_QUERY,
      prefetch: false,
      subscribeToMore: {
        document: gql`subscription {
          messageAdded {
            id
            user {
              id
              name
            }
            content
            createdAt
          }
        }`,
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            messages: [
              ...previousResult.messages,
              subscriptionData.data.messageAdded
            ]
          }
        }
      }
    }
  }
}
</script>
