'use strict';

const fs = require('fs')

const { createBundleRenderer } = require('vue-server-renderer')

const template = fs.readFileSync('./src/index.template.html', 'utf-8')
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template,
  clientManifest
})

// mongo
const MongoClient = require('mongodb').MongoClient
const uri = 'mongodb+srv://slsuser:AeirLN8nlHGobLbD@cluster0-hgxr1.mongodb.net/test'
const client = new MongoClient(uri, { useNewUrlParser: true })
client.connect(err => {
  const collection = client.db("test").collection("devices")
  console.log(collection)
  client.close();
})

module.exports.index = (event, context, callback) => {
  
  // https://github.com/aws-amplify/amplify-js/issues/1460
  context.callbackWaitsForEmptyEventLoop = false;
  
  const appContext = {
    url: event.path,
    title: 'Vue SSR Serverless'
  }
  
  renderer.renderToString(appContext, (err, html) => {
    
    if (err) {
      
      console.log(err)
      
      const response = {
        statusCode: 500,
        headers: {
          "Content-Type": "text/html"
        },
        body: err
      }
      
      callback(null, response)
      
    } else {
      
      const response = {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body: html
      }
      
      callback(null, response)
      
    }
    
  })

}
