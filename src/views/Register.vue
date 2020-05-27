<template>
  <div id="box">
    <div class="left"></div>
    <div class="right">

      <form>
        <p class="title">创建一个账号 | </p>
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
           v-on:click="toLogin">已有账号?去登录吧</a>
        <p><input class="submit-button"
                 type="button"
                 v-on:click="register"
                 value="注册" /></p>
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
    toLogin () {
      this.$router.push({ path: '/login' })
    },
    register () {
      if (!this.username || !this.password) {
        this.$message.error('用户名或密码不能为空')
      } else {
        this.$axios.post('api/user/addUser', {
          username: this.username,
          password: this.password
        }).then((res) => {
          console.log()
          if (res.data.status === 200) {
            this.$message({ message: res.data.msg, type: 'success' })
            this.$router.push({ path: '/login' })
          } else if (res.data.status === 300) {
            this.$message.error(res.data.msg)
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
  background-color: #fff1eb;
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
