<template>
  <div>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'

export default {
  
  mounted: function () {

    Auth.currentAuthenticatedUser().then(user => {
      
      console.log('Login.vue user')
      console.log(user)
      
      this.$store.commit('setUser', user)
      
    }).catch(err => {
      
      console.log('Login.vue err')
      console.log(err)
      
    })
    
  }
  
}
</script>
