<!--花友广场-->
<template>
  <div id="square"
       style="background-image:;">
    <div class="left">
      <section>
        <!--没有token不显示发布动态组件-->
        <post-news v-if="token"
                   class="post-news"
                   @refresh="loadNews"></post-news>
        <div v-else
             class="title">
          <h2>😳登录你的账号,<br>和花友们一起分享你的养花日常吧🔸🔸🔸</h2>
        </div>

      </section>

      <user-news class="news"
                 v-for="(theNew) in news"
                 :key="theNew.id"
                 @loadNews="loadNews"
                 :theNew=theNew></user-news>
    </div>
  </div>
</template>
<script>
import News from '@/components/News'
import PostNews from '@/components/PostNews'
export default {
  components: { 'user-news': News, 'post-news': PostNews },
  created () {
    this.loadNews()
  },

  data: function () {
    return {
      news: [],
      timer: ''
    }
  },
  computed: {
    token () {
      return this.$store.state.token
    }
  },
  methods: {
    loadNews () {
      this.$axios.post('api/user/queryNews', {
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
#square {
  background-color: #fafbfb;
  padding-top: 20px;
  padding-bottom: 20px;
  .title {
    text-align: center;

    h2 {
      color: #6b6d6b;
    }
  }
}

.post-news {
  margin: 0 auto;
}
.news {
  margin: 0 auto;
  margin-top: 30px;
}
</style>
