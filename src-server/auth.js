'use strict'

const { google } = require('googleapis');
const config = require('../config/server')

const oauth2Client = new google.auth.OAuth2(
  config.GOOGLE_CLIENT_ID,
  config.GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
)

const scopes = [
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/gmail.readonly'
]

const url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes
})

module.exports.index = (event, context, callback) => {
  const response = {
    statusCode: 301,
    headers: { Location: url }
  }
  callback(null, response)
}

module.exports.oauthcallback = async (event) => {
  
  const {tokens} = await oauth2Client.getToken(event.queryStringParameters.code)
  console.log('[tokens]')
  console.log(tokens)
  oauth2Client.setCredentials(tokens)
  
  const response = {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: 'oauthcallback-done'
  }
  
  return response
}
