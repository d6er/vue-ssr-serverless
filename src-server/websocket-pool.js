import AWS from 'aws-sdk'

const sockets = [] // for offline use only

async function add (user_id, event) {
  
  if (event.isOffline) {
    
    // offline
    let obj = {
      user_id: user_id,
      ws: event.ws
    }
    sockets.push(obj)
    
  } else {
    
    // production
    
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
    
    // production
    let wsClient = new AWS.ApiGatewayManagementApi({
      apiVersion: '2018-11-29',
      endpoint: 'https://kbm6sisjkh.execute-api.us-east-1.amazonaws.com/dev/'
    })
    
  }
}

export { add, send }
