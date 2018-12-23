'use strict'

const fs = require('fs')

const { createBundleRenderer } = require('vue-server-renderer')

const template = fs.readFileSync('./src/index.template.html', 'utf-8')
const serverBundle = require('../dist/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/vue-ssr-client-manifest.json')

const cookie = require('cookie')

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template,
  clientManifest
})

module.exports.index = (event, context, callback) => {
  
  // https://github.com/aws-amplify/amplify-js/issues/1460
  context.callbackWaitsForEmptyEventLoop = false;
  
  const cookies = event.headers.hasOwnProperty('Cookie') ? cookie.parse(event.headers.Cookie) : ''
  
  const appContext = {
    url: event.path,
    cookies: cookies,
    title: event.headers.Host
  }
  
  renderer.renderToString(appContext, (err, html) => {
    
    if (err) {
      
      const response = {
        statusCode: 500,
        headers: { "Content-Type": "text/html" },
        body: err
      }
      callback(err, response)
      
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
