import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

/* Amplify */
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

const oauth = {
  domain : 'sls-d6er-com.auth.us-east-1.amazoncognito.com', 
  scope : ['phone', 'email', 'profile', 'openid','aws.cognito.signin.user.admin'], 
  redirectSignIn : 'https://sls.d6er.com/signin', 
  redirectSignOut : 'https://sls.d6er.com/signout',
  responseType: 'code',
  options: {
    AdvancedSecurityDataCollectionFlag : true
  }
}

Amplify.configure({ Auth: { oauth: oauth } });

const config = Auth.configure();
const { domain, redirectSignIn, redirectSignOut, responseType } = config.oauth;
const clientId = config.userPoolWebClientId;
const url = 'https://' + domain + '/login?redirect_uri=' + redirectSignIn + '&response_type=' + responseType + '&client_id=' + clientId;

console.log('app.js url')
console.log(url)

export function createApp () {
  
  console.log('app.js createApp')
  
  const router = createRouter()
  const store = createStore()
  
  sync(store, router)
  
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  
  return { app, router, store }
}
