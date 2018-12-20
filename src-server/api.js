'use strict'

require = require("esm")(module)

const config = require('../config/server')
const mongo = require('./mongo')

module.exports.index = (event, context, callback) => {

  // https://github.com/aws-amplify/amplify-js/issues/1460
  context.callbackWaitsForEmptyEventLoop = false;
  
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
