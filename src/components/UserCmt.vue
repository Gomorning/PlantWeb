<!--单条用户评论组件   （包含评论下的回复）-->
<template>
  <div class="user-cmt">
    <!--渲染单条评论-->
    <p class="content">
      <a href="">{{cmt.username}}</a>
      <span>{{cmt.content}}</span>
    </p>
    <p>
      <time>{{cmt.time|dateFormat}}</time>
      <a class="reply-btn"
         v-if="userId!=cmt.from_uid"
         v-on:click="replyCmt(cmt.from_uid)">回复</a>
    </p>
    <!--单条评论下的回复列表-->
    <ul class="user-reply">
      <li v-for="reply in replylist"
          :key="reply.id">
        <p class="content">
          <a href="">{{reply.from_username}}
          </a>回复了<a href="">{{reply.to_username}}</a>
          <span>{{reply.content}}</span>
        </p>
        <p><time>{{reply.time|dateFormat}}</time>
          <!--如果回复内容是当前用户发布的，就不用显示回复按钮-->
          <a class="reply-btn"
             v-if="userId!=reply.from_uid"
             v-on:click="replyCmt(reply.from_uid)">回复</a>
        </p>
      </li>
    </ul>
    <!--点击回复弹出 回复框-->
    <p v-if="isOpenReply">
      <input type="text"
             v-model=replyContent>
      <button class="send-btn"
              v-on:click="sendReply()">回复</button>
      <button class="send-btn"
              v-on:click="cancelReply">取消</button>
    </p>
  </div>
</template>

<script>
const moment = require('moment')
export default {
  props: ['cmt'],
  created () {
    this.loadReply()
  },
  data () {
    return {
      replylist: [],
      replyContent: '', // 发表的回复内容
      isOpenReply: false, // 是否打开回复框
      toUid: ''// 回复对象
    }
  },
  filters: {
    dateFormat (timeStr) {
      return moment(timeStr).format('YYYY-MM-DD HH:mm:ss')
    }
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
    loadReply () {
      this.$axios.post('api/user/queryReplyById', { cmtId: this.cmt.id }).then((res) => {
        this.replylist = res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    // 点击回复按钮后修改回复的目标用户id
    replyCmt (toUId) {
      this.toUId = toUId
      this.isOpenReply = true
    },
    sendReply () {
      if (this.token) {
        // commentId:评论id ，replyUid评论用户id ，content:回复内容
        // fromUId:写回复的用户id（当前用户），toUid:回复对象id
        if (this.replyContent === '') {
          this.$message.error('内容不能为空哦🙂')
        } else {
          var currTime = moment().format('YYYY-MM-DD HH:mm:ss')
          var replyObj = {
            commentId: this.cmt.id,
            replyUId: this.cmt.from_uid,
            content: this.replyContent,
            fromUId: this.userId,
            toUId: this.toUId,
            time: currTime
          }
          // console.log(replyObj)  //回复内容
          this.$axios.post('api/user/addReply', { replyObj: replyObj }).then((res) => {
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

          this.isOpenReply = false
          this.replyContent = ''
          this.loadReply() // 刷新回复列表
        }
      } else {
        this.$message({ message: '请先登录账号哦😳', type: 'error' })
      }
    },
    cancelReply () {
      this.isOpenReply = false
    }
  }
}
</script>
<style lang="less" scoped>
@maincolor: #ea4c88;
.user-cmt {
  padding-top: 4px;
  padding-bottom: 4px;
  list-style: none;
  font-size: 12px;
  color: black;
  border-bottom: 1px solid #e7e7e7;

  a {
    color: #7594b3;
    text-decoration: none;
  }
  span {
    margin-left: 6px;
  }

  time {
    color: gray;
  }
}
.content {
  height: 26px;
  line-height: 26px;
}
.reply-btn {
  cursor: pointer;
}

.user-reply {
  margin-left: 10px;
  background-color: #eaeaec;
}

ul li {
  list-style: none;
  padding: 4px;
  border-bottom: 1px solid #d9d9d9;
}

.send-btn {
  margin-left: 10px;
  width: 50px;
  height: 20px;
  line-height: 20px;
  border-radius: 4px;
  text-align: center;
  font-size: 12px;
  color: #fff;
  background: @maincolor;
  border: none;
  cursor: pointer;
}
</style>
