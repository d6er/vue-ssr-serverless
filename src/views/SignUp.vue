<template>
  <div class="columns is-vcentered">
    <div class="column is-4 is-offset-4">
      <div class="box">
        <form v-on:submit.prevent>
          <div class="field">
            <label class="label">Username:</label>
            <p class="control">
              <input v-model="username" class="input" placeholder="Username" type="text" name="username">
            </p>
          </div>
          <div class="field">
            <label class="label">Email:</label>
            <p class="control">
              <input v-model="email" class="input" placeholder="Email" type="text" name="email">
            </p>
          </div>
          <div class="field">
            <label class="label">Password:</label>
            <p class="control">
              <input v-model="password" class="input" placeholder="Password" type="password" name="password">
            </p>
          </div>
          <div class="field is-grouped">
            <p class="control">
              <button @click="signUp" class="button is-primary">Sign up</button>
            </p>
            <p class="control">
              <router-link to="/" class="button">Cancel</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify';

export default {
  
  data () {
    return {
      username: '',
      email: '',
      password: ''
    }
  },
  
  methods: {
    signUp () {
      Auth.signUp({
        username: this.username,
        password: this.password,
        attributes: {
          email: this.email
        }
      }).then(user => {
        //this.$router.push('/signin')
        console.log(user)
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
