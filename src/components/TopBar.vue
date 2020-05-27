<!--顶部导航栏-->
<template>
  <div id="top">
    <!--搜索框-->

    <div class="left">
      <router-link to="/home">首页</router-link>
      <router-link to="/square">花友广场</router-link>
      <router-link to="/plantManage">植物管理</router-link>
    </div>
    <div class="center">
      <input class="search"
             v-on:keyup.enter="search"
             v-model="keywords"
             type="text">
    </div>
    <div class="right">
      <div v-if="token">
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <span v-if="isAdministor==1">管理员:</span>{{username}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="/User">个人主页</el-dropdown-item>
            <el-dropdown-item command="/userInfo">编辑资料</el-dropdown-item>
            <el-dropdown-item command="quit"
                              divided>退出账号</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class=".user"
           v-else>
        <router-link to="/Register"><button type="submit">注册</button></router-link>
        <router-link to="/Login"><button type="submit"
                  class="login">登录</button></router-link>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data: function () {
    return {
      keywords: ''
    }
  },
  computed: {
    id (state) {
      return this.$store.state.id
    },
    username (state) {
      return this.$store.state.username
    },
    token () {
      return this.$store.state.token
    },
    isAdministor () {
      return this.$store.state.isAdministor
    }
  },
  methods: {
    search () {
      if (this.keywords) {
        this.$router.push({
          path: '/search',
          query: { keywords: this.keywords }
        })
      } else {
        this.$router.push({
          path: '/home'
        })
      }
    },
    quit () {
      this.$store.commit('del_token') // 移除localstorage和vuex中的token
      this.$store.commit('del_id')
      this.$store.commit('del_username')
      this.$store.commit('del_isAdministor')
      this.$router.push({ path: '/home' }) // 退出跳转到主页
    },
    handleCommand (command) {
      if (command === 'quit') {
        this.quit()
      } else {
        this.$router.push({ path: command, query: { id: this.id } })
      }
    }
  }
}
</script>

<style lang="less" scope>
@maincolor: #ea4c88;
@borderColor: #d1d5da;
@inputBgColor: #f3f3f4;
@linkColor: #4f3cc9;

#top {
  letter-spacing: 2px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  color: #6e6d7a;
  box-sizing: border-box;
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 0px;

  div {
    display: inline-block;
  }
  a {
    color: #6e6d7a;
    font-size: 16px;
    padding-left: 16px;
    font-weight: bold;
    &.router-link-exact-active {
      color: @maincolor;
    }
  }
  a:hover {
    color: black;
  }

  .search {
    width: 300px;
    height: 40px;
    line-height: 40px;
    border-radius: 10px;
    font-size: 14px;
    text-indent: 1em;
    background: @inputBgColor;
    outline: none; /*点击后的框框 */
    border: 1px solid @inputBgColor;
    padding: 4px;

    border-radius: 5px;

    box-shadow: none;
  }

  .search:hover {
    background: white;
    box-shadow: #fff1eb 0 1px 1px 2px;
    border: 1px solid @borderColor;
  }
  .search:focus {
    background: white;
    box-shadow: #fff1eb 0 1px 1px 2px;
    border: 1px solid @borderColor;
  }
  .left {
    flex: auto;
  }

  .center {
    flex: auto;
  }

  .right {
    flex: none;
    padding-right: 20px;

    button {
      margin-left: 10px;
      padding-left: 20px;
      padding-right: 20px;
      height: 40px;
      line-height: 40px;
      border-radius: 10px;
      text-align: center;
      border: none;
      cursor: pointer;
    }

    .login {
      color: #fff;
      background: @maincolor;
    }
  }

  //登录后显示的用户信息
  .user {
    padding-left: 10px;
    padding-right: 10px;
  }
}
.el-dropdown-link {
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
  cursor: pointer;
}
</style>
