<template>
  <div id="app">
    <NavbarGuest/>
    <div>
      <router-link to="/">
        Home
      </router-link>
    </div>
    <hr/>
    <section class="section">
      <router-view></router-view>
    </section>
  </div>
</template>

<script>
import NavbarGuest from './views/NavbarGuest.vue'

export default {
  components: {
    NavbarGuest: NavbarGuest
  }
}
</script>

<style lang="sass" rel="stylesheet/sass">
  // https://github.com/sass/libsass/issues/1766#issuecomment-160543586
  @import "~bulma/sass/utilities/initial-variables.sass";

  $navbar-background-color: $white-ter;
  $box-background-color: $white-bis;
  $section-padding: 1rem 1rem;
  $section-padding-medium: 1rem 1rem;
  $section-padding-large: 1rem 1rem;
  $gap: 0;

  @import "~bulma/bulma.sass";
</style>
