import { createApp } from './app'

import { Hub, Logger } from 'aws-amplify';

const { app, router, store } = createApp()

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
