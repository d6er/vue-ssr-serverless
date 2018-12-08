<template>
  <nav class="navbar is-fixed-top">
    <div class="navbar-brand">
      <router-link to="/" class="navbar-item is-tab is-capitalized">
        <span class="is-hidden-mobile">
          Home
        </span>
      </router-link>
      <router-link to="/signup" class="navbar-item is-tab is-capitalized">
        <span class="is-hidden-mobile">
          Sign Up
        </span>
      </router-link>
      <router-link to="/signin" class="navbar-item is-tab is-capitalized">
        <span class="is-hidden-mobile">
          Sign In
        </span>
      </router-link>
    </div>
  </nav>
</template>
