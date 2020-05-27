<!--添加植物成长记录组件-->
<template>

  <div class="post-news">
    <h4>🌱来记录下它现在的样子吧：</h4>
    <textarea name=""
              id=""
              cols="30"
              rows="5"
              v-model="content"></textarea>

    <input type="file"
           ref="fileInput"
           name="file"
           accept="image/png,image/gif,image/jpeg"
           v-on:change="inputChange"
           style="display: none">

    <!--操作按钮-->
    <div class="action">
      <ul>
        <li v-bind:class="{ select: isWatering }"
            v-on:click="Watering">
          <img src="icon/isWatering.png">
          <span>浇水</span>
        </li>
        <li v-bind:class="{ select: isFertilize }"
            v-on:click="Fertilize">
          <img src="icon/isFertilize.png">
          <span>施肥</span></li>
        <li v-bind:class="{ select: isControlInsect}"
            v-on:click="ControlInsect">
          <img src="icon/isControlInsect.png">
          <span>除虫</span></li>
      </ul>
      <button @click="onPickFile">+</button>
      <button class="send-btn"
              v-on:click="postRecord">添加</button>
    </div>

    <div class="img-show">
      <div class="img-wrap"
           v-for="(img,index) in imgList"
           v-bind:key="index">
        <span class="del-btn"
              v-on:click="delImg(index)">X</span>
        <img :src=img
             alt="">
      </div>
    </div>

  </div>
</template>

<script>
const moment = require('moment')
export default {
  props: ['plantId'],
  data () {
    return {
      content: '',
      isWatering: 0,
      isFertilize: 0,
      isControlInsect: 0,
      imageUrl: '', // img绑定的src地址
      imgList: [], // 图片列表
      file: {}
    }
  },
  methods: {
    Watering () {
      this.isWatering = !this.isWatering
    },
    Fertilize () {
      this.isFertilize = !this.isFertilize
    },
    ControlInsect () {
      this.isControlInsect = !this.isControlInsect
    },
    // 打开文件
    onPickFile () {
      if (this.imgList.length < 6) {
        this.$refs.fileInput.click()
      } else {
        this.$message({ message: '最多上传6张图片哦，试着删除一些图片', type: 'warning' })
      }
    },
    // 上传图片
    inputChange (e) {
      this.file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', this.file)
      this.$axios.post('api/user/upload', formData).then((res) => {
        this.imgList.push(res.data.url)
      })
    },
    // 根据索引删除图片
    delImg (index) {
      console.log('删除:' + index)
      var url = this.imgList[index]
      console.log(url)

      this.imgList.splice(index, 1)
      this.$axios.post('api/user/delete', { url: url }).then((res) => {

      })
    },
    postRecord () {
      if (this.content === '') {
        this.$message.error('内容不能为空哦')
      } else {
        // 内容,发布人,当前时间
        var currTime = moment().format('YYYY-MM-DD HH:mm:ss')
        var content = this.content.split('\n').join('<br/>') // 替换
        this.$axios.post('api/plant/addPlantRecord', {
          record: {
            content: content,
            isWatering: this.isWatering,
            isFertilize: this.isFertilize,
            isControlInsect: this.isControlInsect,
            plantId: this.plantId,
            datetime: currTime
          }
        }).then((res) => {
          if (res.data.status === 2) {
            this.$message({ message: '成长记录添加成功', type: 'success' })
          }
          var insertId = res.data.insertId // 返回的植物记录自增id
          console.log('插入的id为：' + insertId)

          // 如果有图片就插入图片
          if (this.imgList.length > 0) {
            // 通过返回自增id插入相关图片
            this.$axios.post('api/user/insertImgs', { imgList: this.imgList, insertId: insertId, type: 'record' }).then((res) => {
              this.imgList = []
            })
          }
        }).catch((err) => {
          console.log(err)
        })

        this.content = ''
        this.isWatering = 0
        this.isFertilize = 0
        this.isControlInsect = 0
        this.$emit('refresh') // 触发父组件的方法刷新页面动态
      }
    }
  }
}
</script>

<style lang="less" scoped>
@maincolor: #ea4c88;

.insert-btn {
  background: gray;
}
.preview-img {
  width: 50px;
  border: 1px solid gray;
}
.post-news {
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
  textarea {
    margin-top: 4px;
    padding: 10px;
    width: 500px;
    border: 1px solid #cececf;
    outline: none;
    border-radius: 10px;
    resize: none;
  }

  textarea:hover {
    border: 1px solid #359be5;
  }

  //选中操作按钮的样式
  .select {
    border: 2px solid #6e6da5;
  }
  .action {
    display: flex;
    align-items: center;

    ul li {
      margin-left: 4px;
      border-radius: 10px;
      list-style: none;
      display: inline-block;
      height: 40px;
      font-size: 0;
      padding: 4px;
      cursor: pointer;

      span {
        font-size: 14px;
      }
      img {
        width: 24px;
        height: 24px;
      }
    }
  }

  .img-show {
    margin-top: 10px;
    //单个图片容器(为了放置删除按钮)
    .img-wrap {
      position: relative;
      display: inline-block;

      .del-btn {
        position: absolute;
        right: 0;
        top: 0;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        background: rgba(255, 255, 255, 1);
        border-radius: 50%;
        font-size: 12px;
        color: gray;
        cursor: pointer;
      }
      img {
        margin-left: 6px;
        width: 50px;
        height: 50px;
        border-radius: 8px;
      }
    }
  }
}
</style>
