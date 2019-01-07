'use strict'

require = require("esm")(module/*, options*/)

const mongo = require('./mongo')
const util = require('util')
const ssr = require('./ssr')
const api = require('./api').default
const cookie = require('cookie')
const google = require('./auth/google')
//const ws = require('ws')

let coldStart = true

module.exports.index = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false
  
  console.log('[handler.js] ' + event.path + ' coldStart:' + coldStart)
  
  coldStart = false
  
  const cookies = event.headers.hasOwnProperty('Cookie') ? cookie.parse(event.headers.Cookie) : ''

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
    
  } else if (event.headers.hasOwnProperty('Sec-WebSocket-Key')) {
    
    return {
      statusCode: 200
    }
    
  } else {
    
    response.body = await util.promisify(ssr)(event, cookies)
    
  }
  
  return response
}
