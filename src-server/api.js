'use strict'

require = require("esm")(module/*, options*/)

const cookie = require('cookie')
const api2 = require('./api2').default
const mongo = require('./mongo')

module.exports.index = async (event, context) => {

  // https://github.com/aws-amplify/amplify-js/issues/1460
  context.callbackWaitsForEmptyEventLoop = false;
  
  const cookies = event.headers.hasOwnProperty('Cookie') ? cookie.parse(event.headers.Cookie) : ''
  const payload = JSON.parse(event.body)
  
  const result = await api2(cookies, payload)

  console.log('5 result')
    
  const response = {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: JSON.stringify(result)
  }
  
  return response
}
