'use strict'

require = require("esm")(module/*, options*/)

const { google } = require('googleapis');
const config = require('../../config/server')
const apiAccount = require('../api/account')
const util = require('util')
const amplifyAuth = require('./amplify-auth').default

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

module.exports.index = async (event) => {
  const response = {
    statusCode: 301,
    headers: { Location: url }
  }
  return response
}

module.exports.callback = async (event) => {
  
  const { tokens } = await oauth2Client.getToken(event.queryStringParameters.code)
  
  oauth2Client.setCredentials(tokens)
  
  const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client
  })
  
  const profile = await util.promisify(gmail.users.getProfile)({ userId: 'me' })
  
  const user_id = await amplifyAuth(event)
  
  const account = {
    profile: profile.data,
    tokens: tokens
  }
  
  await apiAccount.addAccount(user_id, account)
  
  const response = {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: 'oauthcallback-done'
  }
  
  return response
}
