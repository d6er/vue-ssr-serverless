import Vue from 'vue'
import Router from 'vue-router'

import { Auth } from 'aws-amplify';

/*
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

Amplify.configure({
  Auth: {
    oauth: oauth
  }
});

const config = Auth.configure();
const { domain,  redirectSignIn, redirectSignOut, responseType } = config.oauth;
const clientId = config.userPoolWebClientId;
const url = 'https://' + domain + '/login?redirect_uri=' + redirectSignIn + '&response_type=' + responseType + '&client_id=' + clientId;
*/

Vue.use(Router)

export function createRouter () {
  
  /*
  function requireAuth (to, from, next) {
    Auth.currentAuthenticatedUser()
      .then(user => console.log(user))
      .catch(err => console.log(err));
    next()
  }
  */
  
  return new Router({
    mode: 'history',
    routes: [
      {
        path: '/',
        component: () => import('./components/Home.vue')
      },
      {
        path: '/login',
        component: () => import('./components/Login.vue')
      },
      {
        path: '/signin',
        component: () => import('./components/Login.vue')
      },
      {
        path: '/list',
        component: () => import('./components/List.vue')
      },
      {
        path: '/item/:id',
        //beforeEnter: requireAuth,
        component: () => import('./components/Item.vue')
      }
    ]
  })
}
