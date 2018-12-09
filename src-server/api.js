'use strict'

require = require("esm")(module)

const MongoClient = require('mongodb').MongoClient
//const url = 'mongodb+srv://slsuser:AeirLN8nlHGobLbD@cluster0-hgxr1.mongodb.net/test'
const url = 'mongodb://slsuser:AeirLN8nlHGobLbD@cluster0-shard-00-00-hgxr1.mongodb.net:27017,cluster0-shard-00-01-hgxr1.mongodb.net:27017,cluster0-shard-00-02-hgxr1.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
const client = new MongoClient(url, { useNewUrlParser: true })

module.exports.index = (event, context, callback) => {

  // mongo
  client.connect(err => {
    
    const response = {
      statusCode: 200
    }

    if (err) {
      response.body = JSON.stringify(err)
    } else {
      const collection = client.db("test").collection("devices")
      console.log(collection)
      collection.insertOne({ foo: 'bar' })
      response.body = 'SUCCESS'
    }
    
    callback(null, response)
    
    client.close();
  })
  
}
