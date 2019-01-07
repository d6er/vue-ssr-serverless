'use strict'

const require_esm = require("esm")(module)

const AWS = require('aws-sdk')
const mongo = require('./mongo')
const util = require('util')
const ssr = require('./ssr')
const api = require_esm('./api').default
const ws = require_esm('./websocket').default
const cookie = require('cookie')
const google = require('./auth/google')
//const ws = require('ws')

let coldStart = true
let connectionID = null

module.exports.index = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false
  
  console.log('[handler.js] ' + event.path + ' coldStart:' + coldStart)
  
  if (!event.path) {
    console.log('[handler.js no event.path]A')
    console.log(event)
    console.log('[handler.js no event.path]B')
  }
  
  coldStart = false
  
  const cookies = event.hasOwnProperty('headers') && event.headers.hasOwnProperty('Cookie') ? cookie.parse(event.headers.Cookie) : ''

  const response = {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
  }
  
  if (event.path == '/api') {
    
    const payload = JSON.parse(event.body)
    const result = await api(cookies, payload)
    
    response.body = JSON.stringify(result)
    
  } else if (event.path == '/auth/google') {
    
    return google.index()
    
  } else if (event.requestContext.eventType == 'CONNECT') {

    connectionID = event.requestContext.connectionId
    
    return {
      statusCode: 200
    }

  } else if (event.requestContext.eventType == 'MESSAGE') {
    
    const payload = JSON.parse(event.body)
    const result = await ws(event, payload.data)
    
    console.log('[websocket result]')
    console.log(result)
    console.log('[AWS]')
    console.log(AWS)
    
    let wsClient = new AWS.ApiGatewayManagementApi({
      apiVersion: "2018-11-29",
      endpoint: 'https://kbm6sisjkh.execute-api.us-east-1.amazonaws.com/dev/'
    })
    
    wsClient.postToConnection({
      ConnectionID: connectionID,
      Data: JSON.stringify(result)
    })
    
    return
    
  } else {
    
    response.body = await util.promisify(ssr)(event, cookies)
    
  }
  
  return response
}
