import api from '../../src-server/api/index.js'

// Lambda
// https://stackoverflow.com/questions/35754766/nodejs-invoke-an-aws-lambda-function-from-within-another-lambda-function
import AWS from 'aws-sdk'
//AWS.config.region = 'us-east-1'
const lambda = new AWS.Lambda()

export default {
  
  call (payload) {
    
    let params = {
      FunctionName: 'vue-ssr-serverless-dev-api',
      //InvocationType: 'RequestResponse',
      //LogType: 'Tail',
      Payload: JSON.stringify(payload)
    }
    
    return new Promise((resolve, reject) => {
      lambda.invoke(params, function(err, data) {
        if (err) {
          reject(err)
        } else {
          console.log('[api-server]')
          console.log(data)
          resolve(data)
        }
      })
    })
  }
}
