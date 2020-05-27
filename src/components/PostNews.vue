<!--发布用户动态组件-->
<template>

  <div id="post-news">
    <h4>🌱来分享你的养花日常吧：</h4>
    <textarea name=""
              id=""
              cols="30"
              rows="5"
              v-model=news></textarea>

    <input type="file"
           ref="fileInput"
           name="file"
           accept="image/png,image/gif,image/jpeg"
           v-on:change="inputChange"
           style="display: none">
    <p>
      <button @click="onPickFile">+</button>
      <button class="send-btn"
              v-on:click="postNews">发布</button>
    </p>

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
  data () {
    return {
      news: '',
      imageUrl: '', // img绑定的src地址
      imgList: [], // 图片列表
      file: {}
    }
  },
  computed: {
    userId () {
      return this.$store.state.id
    }
  },
  methods: {
    // 打开文件
    onPickFile () {
      if (this.imgList.length < 6) {
        this.$refs.fileInput.click()
      } else {
        this.$message({ message: '最多上传四张图片哦，试着删除一些图片再添加', type: 'warning' })
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
      var url = this.imgList[index]
      this.imgList.splice(index, 1)
      this.$axios.post('api/user/delete', { url: url }).then((res) => {

      })
    },
    // 发布动态
    postNews () {
      if (this.news === '') {
        this.$message.error('内容不能为空哦🙂')
      } else {
        // 内容,发布人,当前时间
        var currTime = moment().format('YYYY-MM-DD HH:mm:ss')
        var news = this.news.split('\n').join('<br/>') // 替换
        this.$axios.post('api/user/postNews', {
          news: news,
          userId: this.userId,
          currTime: currTime
        }).then((res) => {
          if (res.data.status) {
            this.$message({ message: '发布成功！', type: 'success' })
          }
          var insertId = res.data.insertId // 返回的用户动态自增id

          if (this.imgList.length > 0) {
            this.$axios.post('api/user/insertImgs', { imgList: this.imgList, insertId: insertId, type: 'news' }).then((res) => {
              this.imgList = []
            })
          }
          // 通过返回自增id插入相关图片
        }).catch((err) => {
          console.log(err)
        })
        this.news = ''
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
#post-news {
  width: 550px;
  padding: 4px;

  background-size: 80%;
  background-repeat: no-repeat;
  margin-bottom: 0px;

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
    padding: 14px;
    width: 500px;
    border: 1px solid #cececf;
    outline: none;
    border-radius: 10px;
    font-size: 14px;
    resize: none;
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
