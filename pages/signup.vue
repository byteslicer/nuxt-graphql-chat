<template>
  <div class="wrapper">
    <div class="login">
      <no-ssr>
        <form v-cloak action="" @submit.prevent="handleSubmit">
          <input class="input" type="text" placeholder="Username" autocomplete="username" v-model="username" autofocus/>
          <input class="input" type="password" placeholder="Password" autocomplete="current-password" v-model="password" />
          <button type="submit" class="button">Signup</button>
          <div class="subtext">
            Already have an account? <nuxt-link class="login-link" to="/login">Log In</nuxt-link>
          </div>
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

  .button:hover {
    background: #28608a;
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

  .subtext {
    padding: 5px;
    font-weight: lighter;
    text-align: center;
  }

  .login-link {
    padding-left: 4px;
    font-weight: bold;
    text-decoration: none;
  }

  .signup-link:hover {
    color: #89b8dc;
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

  beforeRouteEnter (to, from, next) {
    next(vm => {
      const hasToken = !!vm.$apolloHelpers.getToken()

      if (hasToken) {
        next({ path: '/' })
      }
    })
  },

  methods: {
    async handleSubmit() {
      const username = this.username
      const password = this.password
      this.password = ''

      try {
        const res = await this.$apollo.mutate({
            mutation: gql`mutation($username: String!, $password: String!) {
              signup(username: $username, password: $password)
            }`,
            variables: { username, password }
        }).then(({data}) => data && data.signup)
        await this.$apolloHelpers.onLogin(res)
        this.$router.push({ path: '/' })
      } catch (e) {
          console.error(e)
      }
    }
  }
}

</script>
