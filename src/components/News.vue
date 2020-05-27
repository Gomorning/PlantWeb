<!--  用户动态组件 -->
<template>
  <div class="news">
    <img v-if="userId==theNew.user_id || isAdministor==1"
         :src="deleteIcon"
         alt=""
         class="delete-btn"
         v-on:click="deleteNews(theNew.id)">
    <!--用户个人信息-->
    <div class="user-info">
      <img :src="user.avatar"
           v-on:click="toUserHomePage(theNew.user_id)"
           alt="">
    </div>
    <div class="user-news">
      <p class="user-name"><a v-on:click="toUserHomePage(theNew.user_id)">{{user.username}}</a></p>
      <p class="user-content"
         v-html="theNew.content"></p>
      <!--图片容器-->
      <img-container class="img-container"
                     v-if="imgList!=''"
                     :imgList="imgList"></img-container>
      <p class="user-postTime">{{theNew.postTime|dateFormat }}</p>
      <!--点赞评论按钮-->
      <p class="user-like">
        <img v-on:click="like(theNew.id,theNew._like)"
             :src="likeIcon"><span v-show="theNew._like>0">{{theNew._like}}</span>
        <img v-on:click="showComment=!showComment"
             src="/icon/comment.png"><span v-show="commentCount>0">{{commentCount}}</span>
      </p>
      <!--评论组件-->
      <comment v-show="showComment"
               :topicId="theNew.id"
               :userId="theNew.user_id"
               v-on:loadCommentCount="loadCommentCount"></comment>
    </div>
  </div>
</template>

<script>
import Comment from '@/components/Comment'
import ImgContainer from '@/components/ImgContainer'
const moment = require('moment')

export default {
  props: ['theNew'],
  components: { comment: Comment, 'img-container': ImgContainer },
  created () {
    this.loadNews(this.theNew.user_id) // 加载用户个人信息
    this.loadNewsImg(this.theNew.id) // 加载用户动态相关图片
    this.loadLikeStatus(this.theNew.id, this.userId) // 加载点赞状态
    console.log('管理员' + this.isAdministor)
  },
  computed: {
    userId () {
      return this.$store.state.id
    },
    token () {
      return this.$store.state.token
    },
    isAdministor () {
      return this.$store.state.isAdministor
    }
  },
  filters: {
    dateFormat (timeStr) {
      return moment(timeStr).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data: function () {
    return {
      user: {},
      islike: false, // 是否点赞
      showComment: false,
      commentCount: 0, // 评论数
      likeIcon: '/icon/unlike.png',
      deleteIcon: '/icon/delete.png',
      imgList: ''
    }
  },
  methods: {
    // 加载用户个人信息，用于显示头像用户名
    loadNews (id) {
      this.$axios.post('api/user/getById', { id: id }).then((res) => {
        this.user = res.data.user
      }).catch((err) => {
        console.log(err)
      })
    },
    // 加载用户动态相关图片
    loadNewsImg (id) {
      this.$axios.post('api/user/queryImgs', { id: id, type: 'news' }).then((res) => {
        this.imgList = res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    // 加载用户点赞状态 (有返回结果代表有点赞)
    loadLikeStatus (topicId, fromUId) {
      this.$axios.post('api/user/queryLikeByUId', {
        topicId: topicId, fromUId: fromUId // topic:用户动态ID，fromUid：点赞人ID
      }).then((res) => {
        if (res.data.length > 0) {
          this.islike = true // 改变点赞状态
          this.likeIcon = '/icon/like.png'
        }
      })
    },
    // 用户点赞
    like () {
      // 如果登录则可以点赞，否则提示用户登录
      if (!this.token) {
        this.$message.error('请先登录账号哦😳')
        return
      }
      // 先修改页面点赞数,再把数值传到数据库
      if (this.islike) {
        this.theNew._like--
        this.likeIcon = '/icon/unlike.png'
        // 取消点赞
        this.$axios.post('api/user/delLike', {
          fromUId: this.userId,
          topicId: this.theNew.id
        }).then((res) => {
          if (res.data.status === 2) {
            console.log('取消点赞成功')
          }
        })
      } else {
        this.theNew._like++
        this.likeIcon = '/icon/like.png'
        // 添加点赞
        var likeInfo = {}
        likeInfo.fromUId = this.userId
        likeInfo.topicId = this.theNew.id
        likeInfo.time = moment().format('YYYY-MM-DD HH:mm:ss')
        this.$axios.post('api/user/addLike', {
          likeInfo: likeInfo
        }).then((res) => {
          if (res.data.status === 2) {
            console.log('点赞成功')
          }
        })
      }
      this.islike = !this.islike // 改变点赞状态
      this.$axios.post('api/user/likeNews', { like: this.theNew._like, id: this.theNew.id }).then((res) => {
      }).catch((err) => {
        console.log(err)
      })
    },
    // 删除动态内容
    deleteNewsInfo (newsId) {
      return this.$axios.post('api/user/deleteNewsById', { newsId: newsId })
    },
    // 删除用户动态的相关图片
    deleteNewsImgs (newsId) {
      return this.$axios.post('api/user/deleteImgs', { newsId: newsId, type: 'news' })
    },
    // 删除本地文件夹的相关图片
    deleteLocalImgs (imgList) {
      var urls = []
      // 存放图片地址
      for (let i = 0; i < imgList.length; i++) {
        urls.push(imgList[i].url)
      }
      return this.$axios.post('api/user/deleteLocalImgs', { urls: urls })
    },
    // 删除动态
    deleteNews (newsId) {
      this.$axios.all([this.deleteNewsInfo(newsId), this.deleteNewsImgs(newsId), this.deleteLocalImgs(this.imgList)])
        .then(this.$axios.spread((info, imgs, deleteLocal) => {
          if (info.data.status === 2) {
            console.log('成功删除动态')
          }
          if (imgs.data.status === 2) {
            console.log('成功删除动态图片')
          }
        }))
      this.$message({ message: '成功删除动态 😄', type: 'success' })
      this.$emit('loadNews') // 刷新数据（调用父组件方法）
    },
    // 进入用户主页
    toUserHomePage (id) {
      this.$router.push({
        path: '/user',
        query: {
          id: id
        }
      })
    },
    // 评论数
    loadCommentCount (count) {
      this.commentCount = count
      console.log(this.commentCount)
    }
  }
}
</script>

<style lang="less" scoped>
@borderColor: #e1e4e8;

.img-container {
  width: 400px;
  margin-top: 10px;
}
.delete-btn {
  position: absolute;
  right: 0;
  width: 30px;
  cursor: pointer;
  transition: All 0.4s ease-in-out;
  -webkit-transition: All 0.4s ease-in-out;
  -moz-transition: All 0.4s ease-in-out;
  -o-transition: All 0.4s ease-in-out;
}

.delete-btn:hover {
  transform: rotate(360deg) scale(1.2);
  -webkit-transform: rotate(360deg) scale(1.2);
  -moz-transform: rotate(360deg) scale(1.2);
  -o-transform: rotate(360deg) scale(1.2);
  -ms-transform: rotate(360deg) scale(1.2);
}
p {
  padding-top: 4px;
  padding-bottom: 4px;
}
.news {
  width: 570px;
  position: relative;
  padding: 10px;
  display: flex;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 0px;
  border-radius: 10px;
}
.user-info {
  flex: 1;
  display: inline-block;
  vertical-align: top;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid @borderColor;
    cursor: pointer;
  }
}

.user-news {
  flex: 6;
  display: inline-block;
  vertical-align: top;

  .user-name a {
    text-decoration: none;
    font-weight: bolder;
    cursor: pointer;
  }
  a:hover {
    color: #ea4c88;
  }
  .user-content {
    font-size: 16px;
    color: #2b3137;
  }
  .user-postTime {
    font-size: 14px;
    color: gray;
  }
  .user-like {
    img {
      margin-left: 6px;
      width: 20px;
      cursor: pointer;
    }
  }
}
p {
  text-align: left;
}
</style>
