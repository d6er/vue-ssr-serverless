import config from '../config/server'
import mongo from '../src-server/mongo'
//import { createApp } from './app' // note: moved to inside Promise
import { Auth } from 'aws-amplify'

export default context => {
  
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
        console.log('===[filters]===')
        db.collection('filters').find(query).toArray().then(filters => {
          console.log(filters)
          store.state.lists.forEach(list => {
            list.filters = filters.filter(f => f.list == list.name)
          })
        }).then(() => {
          console.log('===[accounts]===')
          db.collection('accounts').find(query).toArray().then(accounts => {
            store.state.accounts = accounts
          })
          resolve()
        })

      }).then(() => {
        
        // https://github.com/aws-amplify/amplify-js/issues/493

        Auth.currentAuthenticatedUser().then(user => {
          console.log('[entry-server user]')
          console.log(user)
        }).catch(err => {
          console.log('[entry-server err]')
          console.log(err)
        })
        
        router.push(context.url)
        
        router.onReady(() => {
          
          const matchedComponents = router.getMatchedComponents()
          
          if (!matchedComponents.length) {
            return reject({ code: 404 })
          }
          
          resolve(app)
          
        }, reject)
        
      })
      
    })
  })
}
