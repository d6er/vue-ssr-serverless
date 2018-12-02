import { createApp } from './app'
/*
import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
*/

/* Amplify */
/*
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import aws_exports from './aws-exports'
Amplify.configure(aws_exports)

Vue.use(AmplifyPlugin, AmplifyModules)
*/

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#app')
})

/*
export function createApp () {
  
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
*/
