<template>
  <div class="wrapper">
    <div class="login">
      <no-ssr>
        <alert :message="error" level="error" />
        <form class="form" action="" @submit.prevent="handleSubmit">
          <input
            v-model="username"
            class="input"
            type="text"
            placeholder="Username"
            autocomplete="username"
            autofocus
          >
          <input
            v-model="password"
            class="input"
            type="password"
            placeholder="Password"
            autocomplete="new-password"
          >
          <button type="submit" class="button">
            Register
          </button>
          <div class="subtext">
            Already have an account?
            <nuxt-link class="login-link" to="/login">
              Log In
            </nuxt-link>
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

  .form {
    margin-top: 20px;
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
    border: 1px solid #1d4463;
    border-radius: 3px;
    width: 100%;
  }

  .button:hover {
    background: #1d4463;
  }

  .input {
    height: 37px;
    width: 100%;
    box-sizing: border-box;
    display: block;
    margin-bottom: 10px;
    border: 1px solid #1d4463;
    border-radius: 3px;

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
import alert from '@/components/alert';

export default {
  components: { alert },
  data() {
    return {
      username: '',
      password: '',
      error: '',
    };
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const hasToken = !!vm.$apolloHelpers.getToken();

      if (hasToken) {
        next({ path: '/' });
      }
    });
  },

  methods: {
    async handleSubmit() {
      const { username, password } = this;
      this.password = '';

      const res = await this.$apollo.mutate({
        mutation: gql`mutation($username: String!, $password: String!) {
          signup(username: $username, password: $password)
        }`,
        variables: { username, password },
        errorPolicy: 'all',
      });

      if (res.errors) {
        this.error = res.errors[0].message;
      } else {
        this.error = '';
        await this.$apolloHelpers.onLogin(res.data.signup);
        this.$router.push({ path: '/' });
      }
    },
  },
};

</script>
