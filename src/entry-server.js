import config from '../config/server'
import mongo from '../src-server/mongo'
import CustomStorage from '../src-server/CustomStorage'
//import { createApp } from './app' // note: moved to inside Promise

/* Amplify */
import Amplify, { Auth } from 'aws-amplify'
import aws_exports from './aws-exports'
Amplify.configure(aws_exports)

export default context => {
  
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

        Auth.currentAuthenticatedUser().then(user => {
          
          store.state.user = user
          
          // fetch filter data and set to store (for redirect from / path)
          let query = {
            user_id: store.state.user.username
          }
          // todo: exclude user_id from result
          db.collection('filters').find(query).toArray().then(filters => {
            store.state.lists.forEach(list => {
              list.filters = filters.filter(f => f.list == list.name)
            })
            return
          }).then(() => {
            db.collection('accounts').find(query).toArray().then(accounts => {
              store.state.accounts = accounts
            })
            resolve()
          })
          
        }).catch(e => {
          resolve()
        })
  

      }).then(() => {
        
        router.push(context.url)
        
        router.onReady(() => {
          
          const matchedComponents = router.getMatchedComponents()
          if (!matchedComponents.length) {
            reject({ code: 404 })
          }
          
          Promise.all(matchedComponents.map(Component => {
            if (Component.asyncData) {
              console.log(Component.__file)
              return Component.asyncData({ store, route: router.currentRoute })
            }
          })).then(() => {
            console.log('async ok')
          }).catch(e => {
            console.log('async error')
            console.log(e)
          })
                      
          context.state = store.state
          resolve(app)
          
        }, reject)
        
      })
      
    })
  })
}
