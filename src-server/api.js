'use strict'

require = require("esm")(module)

const config = require('../config/server')
const mongo = require('./mongo')

module.exports.index = (event, context, callback) => {

  let payload = JSON.parse(event.body)
  console.log(payload)
    
  mongo.connect(config.mongo_url).then(db => {
    
    const api = require('./api/index.js')
    
    if (api.hasOwnProperty(payload.action)) {
      api[payload.action](payload).then(r => {
        console.log(r)
      }).catch(e => {
        console.log(e)
      })
    }
        
    const response = {
      statusCode: 200,
      body: JSON.stringify(event.body)
    }

    callback(null, response)
    
  })
  
}
