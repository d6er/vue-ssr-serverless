'use strict'

require = require("esm")(module)

const mongo = require('./mongo')

module.exports.index = (event, context, callback) => {

  let payload = JSON.parse(event.body)
  console.log(payload)
    
  mongo.connect().then(db => {
    
    const api = require('./api/index.js')
    
    api[payload.action](payload).then(r => {
      console.log(r)
    }).catch(e => {
      console.log(e)
    })
        
    const response = {
      statusCode: 200,
      body: JSON.stringify(event.body)
    }

    callback(null, response)
    
  })
  
}
