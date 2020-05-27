<template>
  <div>
    <form>
      <dl>
        <dt>
          <label>用户名:</label>
        </dt>
        <dd>
          <input type="text"
                 v-model="user.username"
                 disabled />
        </dd>
        <dt>
          <label>性别:</label>
        </dt>
        <dd>
          <input name="sex"
                 type="radio"
                 value="male"
                 v-model="user.gender" />男
          <input name="sex"
                 type="radio"
                 value="female"
                 v-model="user.gender" />女
          <input name="sex"
                 type="radio"
                 value="null"
                 v-model="user.gender" />未填
        </dd>
      </dl>
      <dt>
        <label>出生日期:</label>
      </dt>
      <dd>
        <el-date-picker v-model="user.birthday"
                        type="date"
                        placeholder="选择日期">
        </el-date-picker>
      </dd>
      <dt>
        <label>个性签名:</label>
      </dt>
      <dd>
        <input v-model="user.personalStatus"
               type="text" />
      </dd>
      <p><input class="submit-button"
               type="button"
               v-on:click="onSubmit"
               value="确定修改" /></p>
    </form>
  </div>
</template>
<script>

const moment = require('moment')

export default {
  created () {
    this.load()
  },
  data () {
    return {
      user: {
        username: '',
        gender: '',
        birthday: '',
        personalStatus: '' // 个人签名
      }
    }
  },
  computed: {
    id () {
      return this.$store.state.id
    }
  },
  methods: {
    load () {
      this.$axios.post('api/user/getById', {
        id: this.id
      }).then((res) => {
        this.user = res.data.user
      })
    },
    onSubmit () {
      this.user.birthday = moment(this.user.birthday).format('YYYY-MM-DD')
      console.log(this.user)
      this.$axios.post('api/user/updateInfo', {
        user: this.user
      }).then((res) => {
        if (res.data.status === 2) {
          this.$message({ message: '修改成功', type: 'success' })
          this.load()// 刷新个人信息
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
form {
  padding: 10px;
  background-color: white;
  dt,
  dd {
    font-size: 14px;
    color: #606266;
    text-align: left;
    margin-top: 10px;
  }

  a {
    font-size: 13px;
    color: #f59;
  }

  input[type="text"] {
    width: 50%;
    min-height: 30px;
    line-height: 30px;
    outline: none; /*点击后的框框 */
    border: 1px solid #dcdfe6;
    padding: 4px;
    font-size: 14px;
    border-radius: 5px;
  }

  input:disabled {
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    color: #aca899;
  }

  input[type="radio"] {
    width: 50px;
    cursor: pointer;
  }
  .submit-button {
    width: 200px;
    min-height: 30px;
    line-height: 30px;
    outline: none; /*点击后的框框 */
    border: 1px solid black;
    padding: 4px;
    font-size: 16px;
    border-radius: 5px;
    margin-top: 20px;
    background-color: #2b3137;
    color: white;
    cursor: pointer;
  }
}
</style>
