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
  
  const appContext = {
    url: event.path,
    title: 'Vue SSR Serverless'
  }
  
  renderer.renderToString(appContext, (err, html) => {
    
    if (err) {
      
      console.dir(err)
      
    } else {
      
      const response = {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html"
        },
        body: html
      }
      
      callback(null, response)
      
    }
    
  })

}
