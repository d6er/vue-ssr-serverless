import AWS from 'aws-sdk'
import mongo from './mongo'

const sockets = [] // for offline use only

async function add (user_id, event) {
  
  console.log('websocket-pool add')
  
  if (event.isOffline) {
    
    // offline
    let obj = {
      user_id: user_id,
      ws: event.ws
    }
    sockets.push(obj)
    
  } else {
    
    // production
    const _id = event.requestContext.connectionId
    const db = mongo.getConnection()
    db.collection('websockets').updateOne(
      { _id: _id },
      { $set: { _id: _id, user_id: user_id } },
      { upsert: true })
  }
  
}

async function send (user_id, message) {
  
  console.log(user_id + ' => ' + message)
  
  if (process.env.IS_OFFLINE) {
    
    // offline
    sockets.filter(s => s.user_id == user_id).map(s => {
      if (s.ws.readyState != 1) return
      s.ws.send(JSON.stringify({ job_id: 0, message: message }))
    })
    
  } else {
    
    const db = mongo.getConnection()
    
    const docs = await db.collection('websockets').find({ user_id: user_id }).toArray()
    
    console.log(docs)
    
    // production
    let wsClient = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: 'https://kbm6sisjkh.execute-api.us-east-1.amazonaws.com/dev/'
    })
    
  }
}

export { add, send }
