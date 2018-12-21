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

module.exports.index = (event, context, callback) => {

  // https://github.com/aws-amplify/amplify-js/issues/1460
  context.callbackWaitsForEmptyEventLoop = false;
  
  const cookies = event.headers.hasOwnProperty('Cookie') ? cookie.parse(event.headers.Cookie) : ''
  
  /* Cookie */
  Amplify.configure({
    Auth: {
      storage: new CustomStorage(cookies)
    }
  })
  
  Auth.currentAuthenticatedUser().then(user => {
    console.log('[api.js user]')
    console.log(user)
    
    Auth.updateUserAttributes(user, {
      'custom:user_id': '223344'
    }).then(r => {
      console.log('[update attr]')
      console.log(r)
    });
  })
  
  Auth.currentUserInfo().then(user => {
    console.log(user)
  })
  
  let payload = JSON.parse(event.body)
  
  mongo.connect(config.mongo_url).then(db => {
    
    const api = require('./api/index.js')
    
    api[payload.action](payload).then(r => {
      
      const response = {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: JSON.stringify(r)
      }
      
      callback(null, response)
      
    }).catch(e => {
      console.log('[error]')
      console.log(e)
    })
    
  })
  
}
