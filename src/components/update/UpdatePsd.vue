<template>
  <form>
    <dl>
      <dt><label>新密码:</label></dt>
      <dd><input type="password"
               v-model="psd"
               v-on:focus="delWarning" /></dd>
      <dt><label>确认密码:</label></dt>
      <dd><input type="password"
               v-model="confirmPsd"
               v-on:focus="delWarning" /><span class="warnning">{{warnning}}</span></dd>
    </dl>
    <p><input class="submit-button"
             type="button"
             v-on:click="modify"
             value="确定修改" /></p>
  </form>
</template>
<script>
export default {
  data: function () {
    return {
      psd: '',
      confirmPsd: '',
      warnning: ''
    }
  },
  computed: {
    id () {
      return this.$store.state.id
    }
  },
  methods: {
    selectSection (select) {
      this.select = select
    },
    delWarning () {
      this.warnning = ''
    },
    modify () {
      if (this.psd && this.confirmPsd) {
        if (this.psd === this.confirmPsd) {
          // 调用修改密码接口
          this.$axios.post('api/user/updatePsd', {
            id: this.id,
            password: this.psd
          }).then((res) => {
            // 修改成功返回状态码
            if (res.data.status === 2) {
              this.$message({ message: '密码修改成功,请重新登录🙂', type: 'success' })
              this.$store.commit('del_token') // 移除localstorage和vuex中的token
              this.$store.commit('del_id')
              this.$store.commit('del_username')
              this.$router.push({ path: '/Login' }) // 退出跳转到主页
            }
          }).catch((err) => {
            console.log(err)
          })
        } else {
          this.warnning = '两次密码不一致哦！'
        }
      } else {
        this.warnning = '密码不能为空哦！'
      }
    }
  }
}
</script>

<style lang="less" scoped>
//表单统一样式
form {
  margin-left: 20px;
  width: 40%;
  background-color: white;
  dt,
  dd {
    text-align: left;
    margin-top: 10px;
    font-weight: bolder;
  }

  input {
    width: 100%;
    min-height: 30px;
    line-height: 30px;
    outline: none; /*点击后的框框 */
    border: 1px solid black;
    padding: 4px;
    font-size: 16px;
    border-radius: 5px;
  }
  .warnning {
    color: crimson;
    font-size: 12px;
    font-weight: 500;
  }
  .submit-button {
    margin-top: 20px;
    background-color: #2b3137;
    color: white;
    cursor: pointer;
  }
}
</style>
