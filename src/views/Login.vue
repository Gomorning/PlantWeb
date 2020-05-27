<template>
  <div id="box">
    <div class="left"
         style="background-image: url('/other/bg_img.png')"></div>
    <div class="right">
      <form>
        <p class="title">登录你的账号 | </p>
        <dl>
          <dt><label>用户名:</label></dt>
          <dd><input class="inputText"
                   type="text"
                   v-model="username" /></dd>
          <dt><label>密码:</label></dt>
          <dd><input class="inputText"
                   type="password"
                   v-model="password" /></dd>
        </dl>
        <a href=""
           v-on:click="toRegister">没有账号?先注册一个</a>
        <p><input class="submit-button"
                 type="button"
                 v-on:click="login"
                 value="登录" /></p>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    toRegister () {
      this.$router.push({ path: '/register' })
    },
    login () {
      if (!this.username || !this.password) {
        this.$message.error('用户名或密码不能为空')
      } else {
        // 发送请求验证用户
        this.$axios.post('api/user/getUser', {
          username: this.username,
          password: this.password
        }).then((res) => {
          if (res.data.status === '-1' || res.data.status === '0') {
            // console.log(res.data.status) // 打印错误信息
            this.$message({ message: res.data.msg, type: 'error' })
          } else {
            this.$message({ message: '登录成功!', type: 'success' })
            this.$store.commit('set_token', res.data.token)
            this.$store.commit('set_id', res.data.id)
            this.$store.commit('set_username', res.data.username)
            this.$store.commit('set_isAdministor', res.data.isAdministor)
            console.log(res.data)

            // this.$route.query.redirect 指的是你进入登录页前，点击的那个页面
            if (this.$route.query.redirect) {
              const redirectPath = this.$route.query.redirect
              this.$router.push({ path: redirectPath })
            } else {
              this.$router.push({ path: '/home' })
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@inputBgColor: #f3f3f4;
@borderColor: #d1d5da;
@linkColor: #4f3cc9;
@mainColor: #ea4c89;

#box {
  width: 100%;
  height: 100%;
  position: absolute;
}

.left {
  vertical-align: top;
  display: inline-block;
  width: 34%;
  height: 100%;
  background-position-x: -100px;
  background-position-y: -80px;
}
.right {
  vertical-align: top;
  display: inline-block;
  width: 60%;
  height: 100%;
  background-color: white;
}
form {
  width: 500px;
  margin: 0 auto;
  margin-top: 80px;
  padding: 30px;

  dt,
  dd {
    letter-spacing: 4px;
    text-align: left;
    margin-top: 20px;
    font-weight: bolder;
  }

  .title {
    font-size: 34px;
    letter-spacing: 6px;
    margin-bottom: 30px;
  }
  a {
    margin-top: 20px;
    display: inline-block;
    font-size: 13px;
    color: @linkColor;
  }

  .inputText {
    text-indent: 1em;
    width: 100%;
    height: 40px;
    line-height: 40px;
    outline: none; /*点击后的框框 */
    border: 1px solid @inputBgColor;
    padding: 4px;
    font-size: 16px;
    background: @inputBgColor;
    border-radius: 5px;
    box-shadow: none;
  }

  .inputText:hover {
    background: white;
    box-shadow: #fff1eb 0 1px 2px 4px;
    border: 1px solid @borderColor;
  }
  .inputText:focus {
    background: white;
    box-shadow: #fff1eb 0 1px 2px 4px;
    border: 1px solid @borderColor;
  }
  .submit-button {
    width: 180px;
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
    border: none;
    font-size: 14px;
    border-radius: 5px;
    background-color: @mainColor;
    color: white;
    opacity: 1;
    cursor: pointer;
  }

  .submit-button:hover {
    opacity: 0.7;
  }
}
</style>
