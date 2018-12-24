'use strict'

const fs = require('fs')
const mongo = require('./mongo')
const util = require('util')

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

module.exports.index = async (event, context) => {
  
  context.callbackWaitsForEmptyEventLoop = false
  
  const cookies = event.headers.hasOwnProperty('Cookie') ? cookie.parse(event.headers.Cookie) : ''
  
  const appContext = {
    url: event.path,
    cookies: cookies,
    title: event.headers.Host
  }
  
  const html = await util.promisify(renderer.renderToString)(appContext)
  
  const response = {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: html
  }
  
  return response
}
