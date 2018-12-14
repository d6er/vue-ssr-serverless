import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'

/* Amplify */
import Amplify, { Auth, Hub, Logger } from 'aws-amplify'
import aws_exports from './aws-exports'
Amplify.configure(aws_exports)
/*
Amplify.configure({
  Auth: {
    region: 'us-east-1',
    cookieStorage: {
      domain: 'localhost',
    }
  }
})
*/

export function createApp () {
  
  const store = createStore()
  const router = createRouter(store)
  
  sync(store, router)
  
  // moved from entry-client.js due to initial requireAuth failure at client.
  if (typeof window !== 'undefined') {
    if (window.__INITIAL_STATE__) {
      store.replaceState(window.__INITIAL_STATE__)
      //store.dispatch('setApiListener')
    }
  }

  Auth.currentAuthenticatedUser().then(user => {
    console.log('[app.js user]')
    console.log(user)
  }).catch(err => {
    console.log('[app.js err]')
    console.log(err)
  })
  
  // Hub
  const alex = new Logger('Alexander_the_auth_watcher')
  alex.onHubCapsule = (capsule) => {
    console.log('[app.js Hub] ' + capsule.payload.event)
    switch (capsule.payload.event) {
    case 'signIn':
      //store.commit('setUser', capsule.payload.data)
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
