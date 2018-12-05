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

module.exports.index = (event, context, callback) => {
  
  console.log('called index')
  console.log(event)
  
  const appContext = {
    url: event.path,
    title: 'Vue SSR Serverless'
  }
  
  renderer.renderToString(appContext, (err, html) => {
    
    console.log('renderToString callback')
    
    if (err) {
      
      console.log('--ERROR--')
      console.log(err)
      
      const response = {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html"
        },
        body: err
      }
      
      callback(null, response)
      
    } else {
      
      console.log('--SUCCESS--')
      
      const response = {
        isBase64Encoded: false,
        statusCode: 200,
        //headers: { "Content-Type": "text/html" },
        body: "test"
      }
      
      console.log(response)
      
      callback(null, response)
      
    }
    
  })

}
