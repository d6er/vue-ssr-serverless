const lists = require('./list')

const config = {
  
  websocket_url: process.env.IS_OFFLINE
    ? 'ws://localhost:3000'
    : 'wss://kbm6sisjkh.execute-api.us-east-1.amazonaws.com/dev',
  
  lists: lists
}

module.exports = config
