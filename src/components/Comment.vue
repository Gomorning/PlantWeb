<!--评论组件-->

<template>
  <!--评论输入框-->
  <div class="cmt">
    <p class="sendCmt"><input type="text"
             v-model=content>
      <button v-on:click="sendCmt">评论</button></p>
    <!--评论列表显示-->
    <user-cmt v-for="(cmt,index) in cmtlist"
              :cmt="cmt"
              :key=index></user-cmt>
  </div>
</template>

<script>
import UserCmt from '@/components/UserCmt'
const moment = require('moment')
export default {
  props: ['topicId'],
  components: { 'user-cmt': UserCmt },
  data: function () {
    return {
      cmtlist: [], // 评论数组
      content: '' // 发表的评论内容
    }
  },
  created () {
    this.loadCmt() // 加载评论列表
  },
  computed: {
    userId () {
      return this.$store.state.id
    },
    token () {
      return this.$store.state.token
    }
  },
  methods: {
    loadCmt () {
      this.$axios.post('api/user/queryCmt', { topicId: this.topicId }).then((res) => {
        this.cmtlist = res.data
        this.$emit('loadCommentCount', this.cmtlist.length) // 传给父组件评论数
      }).catch((err) => {
        console.log(err)
      })
    },
    // 添加评论
    sendCmt () {
      if (this.token) {
        if (this.content === '') {
          this.$message.error('内容不能为空哦🙂')
        } else {
          var currTime = moment().format('YYYY-MM-DD HH:mm:ss')

          var cmt = {
            topicId: this.topicId,
            from_uid: this.userId,
            content: this.content,
            currTime: currTime
          }
          this.$axios.post('api/user/addCmt', { cmt: cmt }).then((res) => {
            if (res.data.status === 2) {
              this.$message({ message: res.data.msg, type: 'success' })
            } else if (res.data.status === 300) {
              this.$message({ message: res.data.msg, type: 'error' })
              this.$store.commit('del_token') // 移除localstorage和vuex中的token
              this.$store.commit('del_id')
              this.$store.commit('del_username')
              this.$router.push({ path: '/Login' }) // 退出跳转到主页
            }
          }).catch((err) => {
            console.log(err)
          })
          this.content = ''// 清空评论框
          this.loadCmt() // 重新加载评论列表
        }
      } else {
        this.$message({ message: '请先登录账号哦😳', type: 'error' })
      }
      //
    }
  }
}
</script>

<style lang="less" scoped>
@maincolor: #ea4c88;
* {
  text-align: left;
}

.cmt {
  background-color: #f2f2f5;
  padding: 14px;
}
.sendCmt {
  input[type="text"] {
    width: 80%;
    min-height: 30px;
    line-height: 30px;
    border: 1px solid #cececf;
    outline: none;
    border-radius: 10px;
    text-indent: 0.5em;
  }
  button {
    margin-left: 10px;
    width: 50px;
    height: 24px;
    line-height: 24px;
    border-radius: 4px;
    text-align: center;
    color: #fff;
    background: @maincolor;
    border: none;
    cursor: pointer;
  }
}
</style>
