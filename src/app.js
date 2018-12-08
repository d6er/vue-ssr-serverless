import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

/* Amplify */
import Amplify, { Auth, Hub, Logger } from 'aws-amplify'
import aws_exports from './aws-exports'
Amplify.configure(aws_exports)

const oauth = {
  domain : 'sls-d6er-com.auth.us-east-1.amazoncognito.com', 
  scope : ['phone', 'email', 'profile', 'openid','aws.cognito.signin.user.admin'], 
  redirectSignIn : 'http://localhost:3000/',
  redirectSignOut : 'http://localhost:3000/',
  responseType: 'code',
  options: {
    AdvancedSecurityDataCollectionFlag : true
  }
}

Amplify.configure({
  Auth: {
    /*
    cookieStorage: {
      domain: '.d6er.com',
      path: '/',
      expires: 365,
      secure: true
    },
    */
    oauth: oauth
  }
})

const config = Auth.configure();
console.log(config)


export function createApp () {
  
  const store = createStore()
  const router = createRouter(store)
  
  sync(store, router)
  
  // Hub
  const alex = new Logger('Alexander_the_auth_watcher')
  alex.onHubCapsule = (capsule) => {
    console.log('[app.js Hub] ' + capsule.payload.event)
    switch (capsule.payload.event) {
    case 'signIn':
      store.commit('setUser', capsule.payload.data)
      break;
    }
  }
  Hub.listen('auth', alex)

  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  
  return { app, router, store }
}
