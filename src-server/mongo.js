// https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
const MongoClient = require('mongodb').MongoClient

//const url = 'mongodb+srv://slsuser:AeirLN8nlHGobLbD@cluster0-hgxr1.mongodb.net/test'
const url = 'mongodb://slsuser:AeirLN8nlHGobLbD@cluster0-shard-00-00-hgxr1.mongodb.net:27017,cluster0-shard-00-01-hgxr1.mongodb.net:27017,cluster0-shard-00-02-hgxr1.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'

let db

const actions = {
  
  connect: function () {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db)
      } else {
        return MongoClient.connect(url).then(dbobj => {
          db = dbobj
          resolve(db)
        })
      }
    })
  },
  
  getConnection: function () {
    return db
  },
  
  getNextId: function (collectionName) {
    return db.collection('counters').findOneAndUpdate(
      { _id: collectionName },
      { $inc: { seq: 1 } },
      { upsert: true, returnOriginal: false }
    )
  }
}

module.exports = actions
