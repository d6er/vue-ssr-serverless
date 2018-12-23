'use strict'

const { google } = require('googleapis');
const config = require('../../config/server')
const apiAccount = require('../api/account')
const util = require('util')

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

module.exports.callback = async (event) => {
  
  const {tokens} = await oauth2Client.getToken(event.queryStringParameters.code)
  
  //await apiAccount.addAccount(req.user._id, tokens)
  oauth2Client.setCredentials(tokens)
  
  const gmail = google.gmail({
    version: 'v1',
    auth: oauth2Client
  })
  
  const res = await util.promisify(gmail.users.getProfile)({ userId: 'me' })
  
  console.dir(res.data)
  
  const account = {
    _id: 0,
    user_id: 0,
    email: '',
    tokens: tokens
  }
  
  gmail.users.messages.list({
    userId: 'me',
    maxResults: 2
  }, (err, res) => {
    if (err) {
      console.log('ERR')
    } else {
      console.dir(res.data)
    }
  })
  
  const response = {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: 'oauthcallback-done'
  }
  
  return response
}
