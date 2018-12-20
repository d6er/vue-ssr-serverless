import { createApp } from './app'
import Amplify, { Auth, Hub, Logger } from 'aws-amplify';
import LocalCookieStorage from '../src-server/LocalCookieStorage'

const { app, router, store } = createApp()
import aws_exports from './aws-exports'
Amplify.configure(aws_exports)

if (window.location.hostname == 'localhost') {
  Amplify.configure({
    Auth: {
      storage: new LocalCookieStorage()
    }
  })
} else {
  const cookieDomain = window.location.hostname
  Amplify.configure({
    Auth: {
      cookieStorage: {
        domain: cookieDomain,
      }
    }
  })
}

Auth.currentAuthenticatedUser().then(user => {
  store.commit('setUser', user)
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
