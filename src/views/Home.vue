<template>
  <div id="home">
    <sort class="sort"></sort>
    <!--导航栏-->
    <!-- <div class="nav-wrap">
      <nav class="nav">
        <router-link to="/sort">植物分类</router-link> |
        <router-link to="/tools">工具介绍</router-link>
      </nav>
    </div>
    <router-view></router-view> -->
  </div>
</template>

<script>
import Sort from '@/views/home/Sort'
export default {
  name: 'Home',
  components: {
    sort: Sort
  }
}
</script>

<style lang="less" scope>
@maincolor: #ea4c88;
#home {
  width: 90%;
  margin: 0 auto;
  letter-spacing: 2px;
}

.sort {
  margin-top: 30px;
}

.nav {
  margin-top: 20px;
  text-align: right;
  padding: 20px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: @maincolor;
    }
  }
}
</style>
