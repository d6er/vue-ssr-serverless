<template>
  <div class="container is-fluid">
    <div class="columns">
      <div v-if="$store.state.user" class="column is-narrow"
           :class="{ 'is-hidden-mobile': !$store.state.isNavBarActive }">
        
        <aside class="menu">
          <ul class="menu-list">
            <li>
              <button class="button is-small is-fullwidth">
                <span class="icon is-small">
                  <i class="fas fa-edit" aria-hidden="true"></i>
                </span>
                <span>Create</span>
              </button>
            </li>
          </ul>
          <p class="menu-label">
            <span class="icon">
              <i class="fa fa-list" aria-hidden="true"></i>
            </span>
            {{ $route.params.list }}
          </p>
          <router-view name="filterTree"></router-view>
          <hr/>
          <p class="menu-label">
            <span class="icon">
              <i class="fas fa-user" aria-hidden="true"></i>
            </span>
            Account
          </p>
          <ul class="menu-list">
            <li>
              <router-link to="/settings">
                <span class="icon">
                  <i class="fa fa-cog" aria-hidden="true"></i>
                </span>
                Settings
              </router-link>
            </li>
            <li>
              <a @click="signOut">
                Sign Out
              </a>
            </li>
            <li>
              <a @click="callAPI">
                Call API
              </a>
            </li>
          </ul>
        </aside>
      </div>
      <div class="column">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth, Hub, Logger } from 'aws-amplify';

// Hub
const alex = new Logger('Alexander_the_auth_watcher')
alex.onHubCapsule = (capsule) => {
  console.log('[Container.vue Hub] ' + capsule.payload.event)
}
Hub.listen('auth', alex)

export default {
  
  computed: {
    
    username () {
      if (this.$store.state.user.google) {
        return this.$store.state.user.google.displayName
      } else {
        return this.$store.state.user.username
      }
    },

  },
  
  methods: {
    
    toggleDropdown () {
      this.$store.commit('toggleDropdown')
    },
    
    signOut () {
      Auth.signOut().then(data => {
        this.$store.commit('unsetUser')
        this.$router.push('/')
      }).catch(err => {
        console.log(err)
      })
    },

    callAPI () {
      let payload = {
        foo: 'bar'
      }
      this.$store.dispatch('callApi', payload)
    }
  }
}

</script>
