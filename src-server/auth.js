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