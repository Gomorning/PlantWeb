<!--单个植物成长记录-->

<template>
  <div class="record">
    <img :src="deleteIcon"
         alt=""
         class="delete-btn"
         v-on:click="deleteRecord(record.id)">
    <p v-html="record.content"
       class="content"></p>
    <!--图片容器-->
    <img-container class="img-container"
                   v-if="imgList!=''"
                   :imgList="imgList"></img-container>
    <p class="action">
      <span v-if="record.isWatering"> <img src="/icon/isWatering.png"
             alt=""> 浇水</span>
      <span v-if="record.isFertilize"><img src="/icon/isFertilize.png"
             alt="">施肥</span>
      <span v-if="record.isControlInsect"><img src="/icon/isControlInsect.png"
             alt="">除虫</span>
    </p>
  </div>
</template>

<script>
import ImgContainer from '@/components/ImgContainer'
export default {
  components: { 'img-container': ImgContainer },
  props: ['record'],
  created () {
    this.loadRecordImg(this.record.id) // 加载植物成长记录相关图片
  },
  data: function () {
    return {
      imgList: [],
      deleteIcon: '/icon/delete.png'
    }
  },
  methods: {
    deleteRecordsInfo (id) {
      return this.$axios.post('api/plant/deleteRecord', { recordId: this.record.id })
    },
    // 删除成长记录的相关图片
    deleteRecordsImgs (id) {
      return this.$axios.post('api/user/deleteImgs', { id: id, type: 'record' })
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
    // 删除成长记录
    deleteRecord (recordId) {
      this.$axios.all([this.deleteRecordsInfo(recordId), this.deleteRecordsImgs(recordId), this.deleteLocalImgs(this.imgList)])
        .then(this.$axios.spread((info, imgs, deleteLocal) => {
          this.$message({ message: '成功删除记录', type: 'success' })
        }))
      this.$emit('load') // 调用父组件重新加载列表
    },
    // 加载该成长记录的相关图片
    loadRecordImg (id) {
      this.$axios.post('api/user/queryImgs', { id: id, type: 'record' }).then((res) => {
        this.imgList = res.data
        console.log(this.imgList)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.record {
  width: 570px;

  .img-container {
    margin-top: 10px;
    width: 400px;
  }
}
.delete-btn {
  position: absolute;
  top: 0;
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
.content {
  font-size: 16px;
  padding-top: 6px;
  padding-bottom: 6px;
}
.action {
  margin-top: 6px;
  span {
    margin-right: 4px;
    font-size: 14px;
    display: inline-block;
  }
  img {
    width: 22px;
    height: 22px;
  }
}
</style>
