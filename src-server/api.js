'use strict'

require = require("esm")(module)

const config = require('../config/server')
const mongo = require('./mongo')

module.exports.index = (event, context, callback) => {

  let payload = JSON.parse(event.body)
  console.log(payload)
    
  mongo.connect(config.mongo_url).then(db => {
    
    const api = require('./api/index.js')
    
    if (!api.hasOwnProperty(payload.action)) {
      
      const response = {
        statusCode: 200,
        body: 'no action'
      }
      
      callback(null, response)
      
      return
    }
    
    api[payload.action](payload).then(r => {
      
      const response = {
        statusCode: 200,
        body: JSON.stringify(r)
      }
      
      callback(null, response)
      
    }).catch(e => {
      
      console.log(e)
      
    })
    
  })
  
}
