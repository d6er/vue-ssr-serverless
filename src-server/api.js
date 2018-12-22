'use strict'

require = require("esm")(module)

const config = require('../config/server')
const mongo = require('./mongo')
const cookie = require('cookie')

/* Amplify */
const Amplify = require('aws-amplify').default
const { Auth } = require('aws-amplify')
const aws_exports = require('../src/aws-exports')
const CustomStorage = require('./CustomStorage').default
Amplify.configure(aws_exports)

module.exports.index = async (event, context) => {

  // https://github.com/aws-amplify/amplify-js/issues/1460
  context.callbackWaitsForEmptyEventLoop = false;
  
  const cookies = event.headers.hasOwnProperty('Cookie') ? cookie.parse(event.headers.Cookie) : ''
  
  Amplify.configure({
    Auth: {
      storage: new CustomStorage(cookies)
    }
  })
  
  const user = await Auth.currentAuthenticatedUser()

  console.log('[api.js] username: ' + user.username)
  
  /*
  
  Auth.currentUserInfo().then(user => {
    console.log(user)
  })
  */
  
  const payload = JSON.parse(event.body)
  
  console.log(payload)
  
  payload.user = user
  
  const db = await mongo.connect(config.mongo_url)
  
  const api = require('./api/index.js')
  
  const result = await api[payload.action](payload)
    
  const response = {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: JSON.stringify(result)
  }
  
  console.log('async response')
  console.log(response)
  
  return response
}
