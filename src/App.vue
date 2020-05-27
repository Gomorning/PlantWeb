<template>
  <div id="app">
    <top-bar v-show="$route.name!=='Login'&& $route.name!=='Register'"></top-bar>
    <router-view />
  </div>
</template>

<script>
import TopBar from '@/components/TopBar'
export default {
  components: { 'top-bar': TopBar },
  // 页面刷新时，取出localStorage的数据存入store中
  mounted () {
    if (localStorage.getItem('token')) {
      this.$store.commit('set_token', localStorage.getItem('token'))
    }
    if (localStorage.getItem('username')) {
      this.$store.commit('set_username', localStorage.getItem('username'))
    }
    if (localStorage.getItem('id')) {
      this.$store.commit('set_id', localStorage.getItem('id'))
    }
  }
}
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: all 0.3s ease-in-out 0s;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-seriffont-family, Helvetica;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  a {
    text-decoration: none;
  }
  .router-link-active {
    text-decoration: none;
  }
}
</style>
