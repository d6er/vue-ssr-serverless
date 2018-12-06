<template>
<div>
  <h1>Login.vue</h1>
  <div>
    <a href="https://sls-d6er-com.auth.us-east-1.amazoncognito.com/login?redirect_uri=https://sls.d6er.com/signin&response_type=code&client_id=4o28h4bcbnk071idmpcflufjvd">Login (sls.d6er.com)</a>
    <a href="https://sls-d6er-com.auth.us-east-1.amazoncognito.com/login?redirect_uri=http://localhost:3000/signin&response_type=code&client_id=4o28h4bcbnk071idmpcflufjvd">Login (localhost:3000)</a>
  </div>
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
