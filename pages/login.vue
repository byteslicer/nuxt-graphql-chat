<template>
  <div class="wrapper">
    <div class="login">
      <no-ssr>
      <form v-cloak action="" @submit.prevent="handleSubmit">
        <input class="input" type="text" placeholder="Username" autocomplete="username" v-model="username" />
        <input class="input" type="password" placeholder="Password" autocomplete="current-password" v-model="password" />
        <button type="submit" class="button">Login</button>
      </form>
      </no-ssr>
    </div>
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
    flex: 1;
    padding: 10px;
    max-width: 300px;
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
    width: 100%;
    box-sizing: border-box;
    display: block;
    margin-bottom: 10px;
    border: 1px solid #28608a;
    border-radius: 5px;

  }
</style>

<script>
import gql from 'graphql-tag';

export default {
  data() {
    return {
      username: "",
      password: ""
    }
  },

  beforeMount() {
    const hasToken = !!this.$apolloHelpers.getToken()

    if (hasToken) {
      return { path: '/' }
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
