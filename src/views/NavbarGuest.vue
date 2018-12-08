<template>
  <nav class="navbar is-fixed-top">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item is-tab is-capitalized">
        <span class="is-hidden-mobile">
          Home
        </span>
      </router-link>
      <router-link to="/signup" class="navbar-item is-tab is-capitalized">
        <span class="is-hidden-mobile">
          Sign up
        </span>
      </router-link>
      <a :href="loginUrl" class="navbar-item is-tab is-capitalized">
        <span class="is-hidden-mobile">
          Login
        </span>
      </a>
      <a :href="loginUrlLocal" class="navbar-item is-tab is-capitalized">
        <span class="is-hidden-mobile">
          LoginLocal
        </span>
      </a>
      <button @click="signIn" class="button is-small">
        Sign in
      </button>
    </div>
  </nav>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  computed: {
    
    loginUrl () {
      let url = 'https://sls-d6er-com.auth.us-east-1.amazoncognito.com/login'
      url += '?redirect_uri=https://sls.d6er.com/'
      url += '&response_type=code&client_id=4o28h4bcbnk071idmpcflufjvd'
      return url
    },
    
    loginUrlLocal () {
      let url = 'https://sls-d6er-com.auth.us-east-1.amazoncognito.com/login'
      url += '?redirect_uri=http://localhost:3000/'
      url += '&response_type=code&client_id=4o28h4bcbnk071idmpcflufjvd'
      return url
    }
    
  },
  
  methods: {
    
    signIn () {
      Auth.signIn('nabe', 'Test!234')
        .then(user => console.log(user))
        .catch(err => console.log(err))
    }
    
  }
}
</script>
