import { createApp } from './app'

import { Auth, Hub, Logger } from 'aws-amplify';

const { app, router, store } = createApp()

Auth.currentAuthenticatedUser().then(user => {
  console.log('[entry-client.js user]')
  console.log(user)
  store.commit('setUser', user)
}).catch(err => {
  console.log('[entry-client.js err]')
  console.log(err)
})

// Hub
const alex = new Logger('Alexander_the_auth_watcher')
alex.onHubCapsule = (capsule) => {
  console.log('[entry-client.js Hub] ' + capsule.payload.event)
  switch (capsule.payload.event) {
  case 'signIn':
    store.commit('setUser', capsule.payload.data)
    break;
  }
}
Hub.listen('auth', alex)

router.onReady(() => {
  app.$mount('#app')
})
