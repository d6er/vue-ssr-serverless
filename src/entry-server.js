import { createApp } from './app'

export default context => {
  
   return new Promise((resolve, reject) => {
     
     console.log('entry-server.js')
     
     const { app, router } = createApp()
     
     router.push(context.url)
     
     router.onReady(() => {
       
       console.log('entry-server.js onReady')
       
       const matchedComponents = router.getMatchedComponents()
       
       if (!matchedComponents.length) {
         return reject({ code: 404 })
       }
       
       resolve(app)
       
     }, reject)
     
   })
}
