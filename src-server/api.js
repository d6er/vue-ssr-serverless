'use strict'

require = require("esm")(module)

const config = require('../config/server')
const mongo = require('./mongo')

module.exports.index = (event, context, callback) => {

  // https://github.com/aws-amplify/amplify-js/issues/1460
  context.callbackWaitsForEmptyEventLoop = false;
  
  let payload = JSON.parse(event.body)
  
  console.log('[payload]')
  console.log(payload)
    
  mongo.connect(config.mongo_url).then(db => {
    
    const api = require('./api/index.js')
    
    if (!api.hasOwnProperty(payload.action)) {
      
      console.log('[no action]')
      
      const response = {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: 'no action'
      }
      
      callback(null, response)
      
      return
    }
    
    console.log('[api.js calling ' + payload.action + ']')
    
    api[payload.action](payload).then(r => {
      
      console.log('[success]')
      
      const response = {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: JSON.stringify(r)
      }
      
      console.log(response)
      
      callback(null, response)
      
    }).catch(e => {
      
      console.log('[error]')
      console.log(e)
      
      const response = {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: 'error'
      }
      
      callback(null, response)
      
    })
    
  })
  
}
