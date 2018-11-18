'use strict';

// Step 1: Create a Vue instance
const Vue = require('vue')
const app = new Vue({
  template: `<div>Hello World</div>`
})

// Step 2: Create a renderer
const renderer = require('vue-server-renderer').createRenderer({
  template: require('fs').readFileSync('./index.template.html', 'utf-8')
})

module.exports.hello = async (event, context, callback) => {
  
  const ssrContext = {
    title: 'Vue SSR Serverless'
  }
  
  // Step 3: Render the Vue instance to HTML
  renderer.renderToString(app, ssrContext, (err, html) => {
    if (err) throw err
    
    const response = {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html"
      },
      body: html
    }
    
    callback(null, response)
  })

};
