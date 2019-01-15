import config from '../config/server'
import mongo from './mongo'
import CustomStorage from './CustomStorage'
import cookie from 'cookie'
import * as wsPool from './websocket-pool'

// https://github.com/aws-amplify/amplify-js/issues/493#issuecomment-386161756
import fetch from 'node-fetch'
global.fetch = global.fetch || fetch

import Amplify, { Auth } from 'aws-amplify'
import aws_exports from '../src/aws-exports'
Amplify.configure(aws_exports)

async function callAPI (event) {
  
  console.log('[websocket.js] (event.body)')
  console.log(event.body)
  
  const db = await mongo.connect(config.mongo_url)
  
  if (event.requestContext.eventType == 'CONNECT') {
    console.log('CHECK COOKIE (event)')
    console.log(event)
    const cookies = event.isOffline
          ? cookie.parse(event.headers.cookie)
          : cookie.parse(event.headers.Cookie)
    
    Amplify.configure({ Auth: { storage: new CustomStorage(cookies) } })
    const userInfo = await Auth.currentUserInfo()
    const user_id = parseInt(userInfo.attributes['custom:user_id'])
    
    return wsPool.add(user_id, event)
  }
  
  const payload = JSON.parse(event.body).data
  console.log(payload)
  
  const api = require('./api/index.js')
  return api[payload.action](payload)
}

export default callAPI
