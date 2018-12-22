import api from '../../src-server/api/index.js'
const { Auth } = require('aws-amplify')

// Lambda
// https://stackoverflow.com/questions/35754766/nodejs-invoke-an-aws-lambda-function-from-within-another-lambda-function
import AWS from 'aws-sdk'
const lambda = new AWS.Lambda()

export default {
  
  call (payload) {
    
    return Auth.currentUserInfo().then(user => {
      
      payload.user_id = parseInt(user.attributes['custom:user_id'])
      
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
      
    })
  }
}
