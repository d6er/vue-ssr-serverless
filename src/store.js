import Vue from 'vue'
import Vuex from 'vuex'
import api from 'api'

import config from '../config/client'

Vue.use(Vuex)

export function createStore () {
  
  return new Vuex.Store({
    
    state: {
      
      user: null,
      
      accounts: [],
      
      lists: config.lists,
      
      paging: [],
      
      filterForm: {},
      
      currentList: {},

      isNavBarActive: false, // todo: delete
      
      isDropdownActive: false,
      
      isFilterFormActive: false,
      
      notification: null
    },
    
    actions: {
      callApi ({ commit, state }, data) {
        
        data.user_id = state.user.username
        
        return api.call(data).then(result => {
          
          console.log('[store.js callApi() result]')
          console.dir(result.data)
          
          let payload = {
            result: result.data,
            callData: data
          }
          
          if (data.action == 'fetchFilterTree') {
            commit('setFilterTree', payload)
          }
        })
      }
    },
    
    mutations: {
      
      setItem (state, { id, item }) {
        Vue.set(state.items, id, item)
      },
      
      setUser (state, user) {
        console.log('store.js setUser')
        Vue.set(state, 'user', user)
      },

      unsetUser (state) {
        Vue.set(state, 'user', null)
      },
      
      setFilterTree (state, payload) {
        console.log('[store.js setFilterTree]')
        console.dir(payload)
        let list = state.lists.find(l => l.name == payload.callData.listName)
        Vue.set(list, 'filterTree', payload.result)
      }
    }
  })
}
