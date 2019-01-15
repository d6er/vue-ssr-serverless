'use strict'

const require_esm = require("esm")(module)

const AWS = require('aws-sdk')
const mongo = require('./mongo')
const util = require('util')
const ssr = require('./ssr')
const api = require_esm('./api').default
const websocket = require_esm('./websocket').default
const cookie = require('cookie')
const google = require('./auth/google')

let coldStart = true

module.exports.index = async (event, context) => {
  
  // Logging
  if (coldStart) {
    console.log('[handler.js] COLD START path: ' + event.path)
  }
  if (event.hasOwnProperty('requestContext')) {
    console.log('[handler.js] eventType: ' + event.requestContext.eventType)
  }
  if (!event.path) {
    console.log('[handler.js no event.path]')
  }
  console.log('event.isOffline: ' + event.isOffline)
  
  context.callbackWaitsForEmptyEventLoop = false
  
  coldStart = false
  
  const cookies = event.hasOwnProperty('headers') && event.headers.hasOwnProperty('Cookie')
        ? cookie.parse(event.headers.Cookie) : ''

  const response = {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
  }
  
  if (event.hasOwnProperty('requestContext') && event.requestContext.eventType == 'CONNECT') {
    await websocket(event)
    return { statusCode: 200 }
  }
  
  if (process.env.IS_OFFLINE
      && event.hasOwnProperty('headers')
      && event.headers.hasOwnProperty('sec-websocket-key')) {
    
    if (event.body) {
      const payload = JSON.parse(event.body)
      const result = await websocket(event, payload.data)
      const data = {
        job_id: payload.job_id,
        resolve: result
      }
      response.body = JSON.stringify(data)
    }
    
  } else if (event.path == '/api') {
    
    const payload = JSON.parse(event.body)
    const result = await api(cookies, payload)
    
    response.body = JSON.stringify(result)
    
  } else if (event.path == '/auth/google') {
    
    return google.index()
    
  } else if (event.hasOwnProperty('requestContext') && event.requestContext.eventType == 'CONNECT') {

    await websocket(event)
    return { statusCode: 200 }

  } else if (event.hasOwnProperty('requestContext') && event.requestContext.eventType == 'MESSAGE') {
    
    const payload = JSON.parse(event.body)
    const result = await websocket(event, payload.data)
    const data = {
      job_id: payload.job_id,
      resolve: result
    }
    console.log('[websocket result]')
    console.log(data)
    
    let wsClient = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: 'https://kbm6sisjkh.execute-api.us-east-1.amazonaws.com/dev/'
    })
    
    await wsClient.postToConnection({
      ConnectionId: event.requestContext.connectionId,
      Data: JSON.stringify(data)
    }).promise().catch(err => {
      console.log('[err]')
      console.log(err)
    })
    
    return {
      statusCode: 200
    }
    
  } else {
    
    response.body = await util.promisify(ssr)(event, cookies)
    
  }
  
  if (response.hasOwnProperty('body')) {
    return response
  }
}
