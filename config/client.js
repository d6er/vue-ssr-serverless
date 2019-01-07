const lists = require('./list')

const config = {
  
  websocket_url: {
    'localhost': 'ws://localhost:3000',
    //'sls.d6er.com': 'wss://ws.sls.d6er.com/dev'
    'sls.d6er.com': 'wss://kbm6sisjkh.execute-api.us-east-1.amazonaws.com/dev'
  },
  
  lists: lists
}

module.exports = config
