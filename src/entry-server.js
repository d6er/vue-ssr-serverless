import { Auth } from 'aws-amplify'
import { createApp } from './app'

export default context => {
  
   return new Promise((resolve, reject) => {
     
     const { app, router, store } = createApp()
     
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
}
