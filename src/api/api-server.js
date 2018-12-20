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
      Payload: JSON.stringify({ body: JSON.stringify(payload) })
    }
    
    console.log('[api-server]')
    console.log(params)
    
    return new Promise((resolve, reject) => {
      lambda.invoke(params, function(err, result) {
        if (err) {
          console.log('[api-server lambda.invoke error]')
          console.log(err)
          resolve({ data: err })
        } else {
          console.log('[api-server]')
          console.log(result)
          let resultPayload = JSON.parse(result.Payload)
          resolve({ data: JSON.parse(resultPayload.body) })
        }
      })
    })
  }
}
