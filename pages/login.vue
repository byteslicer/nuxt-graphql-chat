<template>
  <div class="wrapper">
    <form class="login" @submit.prevent="handleSubmit">
      <input class="input" type="text" placeholder="Username" v-model="username" />
      <input class="input" type="password" placeholder="Password" v-model="password" />
      <button type="submit" class="button">Login</button>
    </form>
  </div>
</template>

<style scoped>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }

  .login {
    box-sizing: border-box;
    max-width: 50%;
  }

  .button {
    margin: 0;
    text-align:center;
    padding: 0px;
    background-color: #17374f;
    height: 30px;
    width: 60px;
    border: 1px solid #28608a;
    border-radius: 5px;

    width: 100%;
  }

  .input {
    height: 37px;
    width: 200px;
    display: block;
    margin-bottom: 10px;
    border: 1px solid #28608a;
    border-radius: 5px;

  }
</style>

<script>
import gql from 'graphql-tag';

export default {
  beforeRouteEnter (to, from, next) {
    next(vm => {
      const hasToken = !!vm.$apolloHelpers.getToken()
      if (hasToken) {
        vm.$router.push({ path: 'login' })
      }
    })
  },

  data() {
    return {
      username: "",
      password: ""
    }
  },

  methods: {
    async handleSubmit() {
      const username = this.username
      const password = this.password
      this.password = ''

      try {
        const res = await this.$apollo.mutate({
            mutation: gql`mutation($username: String!, $password: String!) {
              login(username: $username, password: $password)
            }`,
            variables: { username, password }
        }).then(({data}) => data && data.login)
        await this.$apolloHelpers.onLogin(res)
        this.$router.push({ path: '/' })
      } catch (e) {
          console.error(e)
      }
    }
  }
}

</script>
