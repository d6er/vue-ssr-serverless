import config from '../config/server'
import mongo from '../src-server/mongo'
import CustomStorage from '../src-server/CustomStorage'
//import { createApp } from './app' // note: moved to inside Promise

/* Amplify */
import Amplify, { Auth } from 'aws-amplify'
import aws_exports from './aws-exports'
Amplify.configure(aws_exports)

export default context => {
  
  console.log(context)
  
  /* Cookie */
  Amplify.configure({
    Auth: {
      storage: new CustomStorage(context.cookies)
    }
  })

  return new Promise((resolve, reject) => {
    
    return mongo.connect(config.mongo_url).then(db => {
      
      // note: import app.js after mongo connection
      //const { app, router, store } = createApp()
      const { app, router, store } = require('./app').createApp()
      
      return new Promise((resolve, reject) => {

        // fetch filter data and set to store (for redirect from / path)
        let query = {
          //user_id: context.user._id,
          user_id: 'nabe'
        }
        // todo: exclude user_id from result
        db.collection('filters').find(query).toArray().then(filters => {
          store.state.lists.forEach(list => {
            list.filters = filters.filter(f => f.list == list.name)
          })
        }).then(() => {
          db.collection('accounts').find(query).toArray().then(accounts => {
            store.state.accounts = accounts
          })
          resolve()
        })

      }).then(() => {
        
        router.push(context.url)
        
        router.onReady(() => {
          
          const matchedComponents = router.getMatchedComponents()
          
          if (!matchedComponents.length) {
            return reject({ code: 404 })
          }
          
          context.state = store.state
          resolve(app)
          
        }, reject)
        
      })
      
    })
  })
}
