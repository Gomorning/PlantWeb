<template>
  <div id="wrap">
    <div id="plant-wrap">
      <p class="title">🌷 含有 <strong>{{keywords}}</strong> 的植物 【{{plants.length}}】</p>
      <hr>
      <plant-show v-bind:plants="plants"></plant-show>
    </div>
    <div id="news-wrap">
      <p class="title">含有 <strong>{{keywords}}</strong> 的用户动态 【{{news.length}}】</p>
      <hr>
      <user-news class="news"
                 v-for="(theNew) in news"
                 :key="theNew.id"
                 :theNew=theNew></user-news>
    </div>

  </div>
</template>
<script>
// 引入植物和用户动态组件
import Plant from '@/components/Plant'
import News from '@/components/News'
export default {
  components: { 'plant-show': Plant, 'user-news': News },
  created () {
    this.keywords = this.$route.query.keywords
    this.search() // 开始搜索
  },
  watch: {
    // 监听路由参数的变化
    $route: {
      handler: function (route) {
        this.keywords = route.query.keywords
        this.search()
      },
      immediate: true
    }
  },
  data: function () {
    return {
      keywords: '',
      plants: [],
      news: []
    }
  },
  methods: {
    searchPlant () {
      return this.$axios.get('api/search/searchPlant', {
        params: { keywords: this.keywords }
      })
    },
    searchNews () {
      return this.$axios.get('api/search/searchNews', {
        params: { keywords: this.keywords }
      })
    },
    search () {
      this.$axios.all([this.searchPlant(), this.searchNews()])
        .then(this.$axios.spread((plant, news) => {
          this.plants = plant.data
          this.news = news.data
        }))
    }
  }
}
</script>

<style lang="less" scoped>
#wrap {
  padding-top: 20px;
  padding-left: 50px;
  padding-right: 50px;
  padding-bottom: 50px;
  // background-color: #fafbfb;
  min-height: 540px;

  .title {
    padding: 10px;
    text-align: left;
    border-bottom: 2px solid #ea4c88;
  }
}

#plant-wrap {
  text-align: center;
  padding-bottom: 20px;
  background-color: #fafbfb;
}

#news-wrap {
  margin-top: 20px;
  padding-bottom: 20px;
  background-color: #fafbfb;

  .news {
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>
