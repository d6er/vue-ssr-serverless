'use strict'

require = require("esm")(module/*, options*/)

const mongo = require('./mongo')
const util = require('util')
const ssr = require('./ssr')
const api = require('./api').default
const cookie = require('cookie')

let coldStart = true

module.exports.index = async (event, context) => {
  
  console.log('[handler.js] ' + event.path + ' coldStart:' + coldStart)
  
  coldStart = false
  
  context.callbackWaitsForEmptyEventLoop = false
  
  const cookies = event.headers.hasOwnProperty('Cookie') ? cookie.parse(event.headers.Cookie) : ''
  
  if (event.path == '/api') {
    
    const payload = JSON.parse(event.body)
    const result = await api(cookies, payload)
    
    const response = {
      statusCode: 200,
      headers: { "Content-Type": "text/html" },
      body: JSON.stringify(result)
    }
    
    return response
  }
  
  const html = await util.promisify(ssr)(event, cookies)
  
  const response = {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: html
  }
  return response
}
