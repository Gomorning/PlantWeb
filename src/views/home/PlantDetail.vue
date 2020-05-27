<!--  植物详情组件 -->
<template>
  <div id="plant-detail">
    <!--顶部返回条-->
    <p class="title-bar"><button class="back-btn"
              v-on:click="backHistory">返回</button></p>
    <!--显示板块-->
    <div class="plant">
      <!--植物基本信息-->
      <div class="plant-info">
        <div class="left">
          <img :src="absolutePath+plant.plant_img"
               :title="plant.plant_name">
        </div>

        <!--植物文字说明-->
        <div class="right">
          <h2>{{plant.plant_name}}</h2>
          <h3>{{plant.plant_english_name}}</h3>
          <p><b>科:</b>{{plant.family}}</p>
          <p><b>属:</b>{{plant.genus}}</p>
          <p><b>原产地:</b>{{plant.distribution}}</p>
          <p><b>花期:</b>{{plant.season}}</p>
          <p><b>栽培基质:</b>{{plant.soil}}</p>
        </div>
      </div>
      <div class="plant-article">
        <h4>植物介绍</h4>
        <p>{{plant.plant_intro}}</p>
        <h4>养护小贴士</h4>
        <p>{{plant.tips}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.plant = JSON.parse(this.$route.query.plant)
  },
  data: function () {
    return {
      plant: '',
      absolutePath: '/image/plantPics' // public图片资源路径
    }
  },
  methods: {
    backHistory () {
      this.$router.go(-1)
    }
  }

}
</script>

<style lang="less" scoped>
@maincolor: #ea4c88;
#plant-detail {
  margin: 0 auto;
  width: 80%;
}
.plant {
  border-top: 4px solid @maincolor;
  padding: 30px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 0px;

  .plant-info {
    display: flex;
    box-sizing: border-box;

    .left {
      img {
        width: 400px;
        height: 400px;
      }
    }
    .right {
      padding: 20px;
      flex: 1; //左侧固定，右侧内容自动铺满
      border-right: 1px solid gray;
      border-bottom: 1px solid gray;
      border-top: 1px solid gray;
      b {
        margin-right: 8px;
      }
    }
  }

  .plant-article {
    h4 {
      margin-top: 26px;
    }
  }
}

.title-bar {
  text-align: right;
}
.back-btn {
  width: 50px;
  height: 50px;
  padding: 10px;
  border: none;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 0px;
  cursor: pointer;
}

p {
  padding-top: 14px;
  padding-bottom: 14px;
}
</style>
