<template>
<div>
  Login.vue
</div>
</template>

<script>
import { Auth } from 'aws-amplify';
  
export default {
  mounted () {
    Auth.currentAuthenticatedUser()
      .then(user => console.log(user))
      .catch(err => console.log(err));
  }
}
</script>
