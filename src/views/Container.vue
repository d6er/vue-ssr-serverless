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
              <button @click="signOut" class="button is-small">
                Sign out
              </button>
            </li>
            <li>
              <a :href="logoutUrl">
                <span class="icon">
                  <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                </span>
                Logout
              </a>
            </li>
            <li>
              <a :href="logoutUrlLocal">
                <span class="icon">
                  <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
                </span>
                LogoutLocal
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

    logoutUrl () {
      let url = 'https://sls-d6er-com.auth.us-east-1.amazoncognito.com/logout'
      url += '?logout_uri=https://sls.d6er.com/'
      url += '&client_id=4o28h4bcbnk071idmpcflufjvd'
      return url
    },

    logoutUrlLocal () {
      let url = 'https://sls-d6er-com.auth.us-east-1.amazoncognito.com/logout'
      url += '?logout_uri=http://localhost:3000/'
      url += '&client_id=4o28h4bcbnk071idmpcflufjvd'
      return url
    }
  },
  
  methods: {
    toggleDropdown () {
      this.$store.commit('toggleDropdown')
    },
    signOut () {
      Auth.signOut()
        .then(data => console.log(data))
        .catch(err => console.log(err));
    }
  }
}

</script>
