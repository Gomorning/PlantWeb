<!--用户主页-->
<template>
  <div id="user">
    <div class="user-info">
      <img :src=userInfo.avatar
           alt="">
      <p><strong>{{userInfo.username}}</strong></p>

      <p>{{userInfo.personalStatus}}</p>
    </div>
    <div class="user-news">
      <article class="news"
               v-for="theNew in news"
               v-bind:key="theNew.id">
        <user-news @loadNews="loadNews"
                   :theNew=theNew></user-news>
      </article>
    </div>
  </div>
</template>

<script>
import News from '@/components/News'

export default {
  components: { 'user-news': News },
  created () {
    this.id = this.$route.query.id
    this.loadUserInfo(this.id)
    this.loadNews(this.id)
  },
  data: function () {
    return {
      id: '',
      userInfo: '',
      news: []
    }
  },
  methods: {
    // 加载用户信息
    loadUserInfo () {
      var id = this.id
      this.$axios.post('api/user/getById', { id: id }, {
      }).then((res) => {
        this.userInfo = res.data.user
      }).catch((err) => {
        console.log(err)
      })
    },
    // 加载用户动态
    loadNews () {
      var id = this.id
      this.$axios.post('api/user/queryNewsById', { userId: id }, {
      }).then((res) => {
        this.news = res.data
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="less" scoped>
#user {
  .user-info {
    text-align: center;
    padding-top: 10px;
    padding-bottom: 10px;
    background-color: #fafbfb;
    strong {
      font-size: 20px;
    }
    img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid white;
      cursor: pointer;
    }
  }

  .user-news {
    margin-top: 20px;
    padding-top: 20px;
    width: 100%;
    min-height: 460px;
    padding-bottom: 50px;
    background-color: #fafbfb;
  }
  .news {
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>
