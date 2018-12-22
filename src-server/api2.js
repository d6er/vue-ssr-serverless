import config from '../config/server'
import mongo from './mongo'
import CustomStorage from './CustomStorage'

// https://github.com/aws-amplify/amplify-js/issues/493#issuecomment-386161756
import fetch from 'node-fetch'
global.fetch = global.fetch || fetch

import Amplify, { Auth } from 'aws-amplify'
import aws_exports from '../src/aws-exports'
Amplify.configure(aws_exports)

async function callAPI (cookies, payload) {
  
  Amplify.configure({
    Auth: {
      storage: new CustomStorage(cookies)
    }
  })
  
  const user = await Auth.currentAuthenticatedUser()
  payload.user = user
  
  const userInfo = await Auth.currentUserInfo()
  payload.user_id = parseInt(user.attributes['custom:user_id'])
  
  const db = await mongo.connect(config.mongo_url)
  
  const api = require('./api/index.js')
  
  return api[payload.action](payload)
  
}

export default callAPI
