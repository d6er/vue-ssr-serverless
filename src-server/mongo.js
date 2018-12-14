// https://team.goodeggs.com/export-this-interface-design-patterns-for-node-js-modules-b48a3b1f8f40
const MongoClient = require('mongodb').MongoClient

let db

const actions = {
  
  connect: function (url) {
    return new Promise((resolve, reject) => {
      if (db) {
        resolve(db)
      } else {
        return MongoClient.connect(url).then(client => {
          db = client.db('test')
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
