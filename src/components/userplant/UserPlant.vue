<!--用户植物列表-->
<template>
  <div class="user-plant">
    <p class="top">
      <i class="el-icon-view"
         v-on:click="goRecordPage"></i>
      <i class="el-icon-delete"
         v-on:click="deletePlant"></i>
    </p>
    <div class="wrap">
      <div class="left">
        <img :src="plant.cover"
             alt="">
      </div>
      <div class="right">
        <p><span class="attri">植物名称：</span>{{plant.name}}</p>
        <p><span class="attri">开始时间：</span>{{plant.birthday|dateFormat }}</p>
        <p><span class="attri">备注：</span>{{plant.description}}</p>
      </div>
    </div>
  </div>
</template>

<script>

const moment = require('moment')
export default {
  props: ['plant'],
  data: function () {
    return {

    }
  },
  filters: {
    dateFormat (timeStr) {
      return moment(timeStr).format('YYYY-MM-DD')
    }
  },
  methods: {
    // 删除本地文件夹的相关图片
    deleteLocalImgs (imgList) {
      var urls = []
      // 存放图片地址
      for (let i = 0; i < imgList.length; i++) {
        urls.push(imgList[i].url)
      }
      // 添加封面图片的地址（一起删除）
      urls.push(this.plant.cover)
      return this.$axios.post('api/user/deleteLocalImgs', { urls: urls })
    },
    // 删除植物信息
    deleteInfo () {
      var id = this.plant.id
      return this.$axios.post('api/plant/deletePlant', { id: id })
    },
    deletePlant () {
      // 1.查询该植物下的所有植物记录的相关图片(用于删除本地图片)
      this.$axios.get('api/plant/queryImgsByPlantId/', {
        params: {
          plantId: this.plant.id
        }
      }).then((res) => {
        var imgList = res.data
        // 2.删除植物数据及本地图片
        this.$axios.all([this.deleteInfo(), this.deleteLocalImgs(imgList)])
          .then(this.$axios.spread((Info, Img) => {
          }))
        this.$message({ message: '删除植物成功', type: 'success' })
        this.$emit('load')// 调用父组件方法刷新植物列表
      })
    },
    // 去植物成长记录页
    goRecordPage () {
      this.$router.push({
        path: '/userPlantRecord',
        query: {
          plantId: this.plant.id,
          plantName: this.plant.name
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-plant {
  width: 320px;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 0px;
  margin-top: 30px;
  display: inline-block;

  .top {
    height: 40px;
    line-height: 40px;
    padding-top: 4px;
    padding-bottom: 4px;
    border-bottom: 1px solid #d1d5da;
    font-size: 30px;
    display: flex;
    justify-content: flex-end;
    i {
      margin-left: 10px;
      opacity: 0.8;
      cursor: pointer;
      color: #2b3137;
    }

    i:hover {
      opacity: 1;
    }
  }

  .left {
    display: inline-block;
  }

  .right {
    margin-left: 10px;
    vertical-align: top;
    display: inline-block;

    p {
      margin-top: 10px;
      font-size: 15px;
      font-weight: bold;
      color: #1d2439;

      .attri {
        font-size: 13px;
        color: #6b6d6b;
      }
    }
  }

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
}
</style>
