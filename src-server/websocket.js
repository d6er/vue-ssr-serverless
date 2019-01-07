import config from '../config/server'
import mongo from './mongo'

async function callAPI (event, payload) {
  
  console.log('[websocket.js]')
  console.log(payload)
  
  console.log('2 db ' + config.mongo_url)
  const db = await mongo.connect(config.mongo_url)
  
  console.log('3 api call')
  const api = require('./api/index.js')
  
  return api[payload.action](payload)
  
}

export default callAPI
