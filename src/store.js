import Vue from 'vue'
import Vuex from 'vuex'
import api from './api'

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
      callApi ({ commit, state }, payload) {
        api.call(payload).then(result => {
          console.log(result)
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
      }
      
    }
  })
}
