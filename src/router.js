import Vue from 'vue'
import Router from 'vue-router'
import config from '../config/client'

import { Auth } from 'aws-amplify';

Vue.use(Router)

export function createRouter (store) {
  
  function requireAuth (to, from, next) {
    Auth.currentAuthenticatedUser().then(user => {
      console.log('[router.js user]')
      console.log(user)
    }).catch(err => {
      console.log('[router.js err]')
      console.log(err)
    });
    next()
  }
  
  let listsRegExp = store.state.lists.map(list => list.name).join('|')
  
  // dynamic child component for list
  let listRoutes = []
  config.lists.map(list => {
    listRoutes.push({
      path: '/:list(' + list.name + ')',
      beforeEnter: requireAuth,
      component: () => import('./components/' + list.name + '/list/Column.vue')
    })
    listRoutes.push({
      path: '/:list(' + list.name + ')/:filter/p:page(\\d+)?',
      beforeEnter: requireAuth,
      component: () => import('./components/' + list.name + '/list/Column.vue')
    })
  })
  
  // dynamic child component for detail tabs
  let tabRoutes = []
  config.lists.map(list => {
    list.tabs.map(tab => {
      let tabName = tab.charAt(0).toUpperCase() + tab.slice(1);
      let route = {
        path: '/:list(' + list.name + ')/:filter/:id/:tab(' + tab + ')',
        beforeEnter: requireAuth,
        component: () => import('./components/' + list.name + '/detail/' + tabName + '.vue')
      }
      tabRoutes.push(route)
    })
  })
  
  // auth-flow: https://github.com/vuejs/vue-router/tree/dev/examples/auth-flow/components
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: () => import('./views/Home.vue')
      },
      {
        path: '/login',
        component: () => import('./views/Login.vue')
      },
      {
        path: '/signin',
        component: () => import('./views/Login.vue')
      },
      {
        path: '/list',
        beforeEnter: requireAuth,
        component: () => import('./components/List.vue')
      },
      {
        path: '/:list(' + listsRegExp + ')/:filter',
        beforeEnter: requireAuth,
        component: () => import('./views/Container.vue'),
        children: [
          {
            path: 'p:page(\\d+)?',
            alias: '', // alias for page 1
            beforeEnter: requireAuth,
            // https://router.vuejs.org/guide/essentials/named-views.html
            components: {
              default: () => import('./views/List.vue'),
              filterTree: () => import('./views/FilterTree.vue')
            },
            children: listRoutes
          },
          {
            path: ':id',
            beforeEnter: requireAuth,
            components: {
              default: () => import('./views/Detail.vue'),
              filterTree: () => import('./views/FilterTree.vue')
            },
            children: tabRoutes
          }
        ]
      },
    ]
  })
}
