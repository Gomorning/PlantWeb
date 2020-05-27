<template>
  <div>
    <div id="flex-wrap">
      <div class="left">
        <p class="title">当前头像</p>
        <img class="user-avatar"
             :src="avatar"
             alt="">
        <p><input type="file"
                 name="file"
                 id=""
                 accept="image/png,image/gif,image/jpeg"
                 v-on:change="inputChange"></p>
      </div>
      <div class="right"
           v-if="previewUrl">
        <p class="title">预览头像</p>
        <img class="preview-avatar"
             :src="previewUrl"
             alt="">
      </div>
    </div>
    <button class="submit-button"
            v-on:click="confirm">确定修改</button>
  </div>
</template>

<script>
export default {
  created () {
    this.load()
  },
  computed: {
    id () {
      return this.$store.state.id
    }
  },
  data: function () {
    return {
      avatar: '',
      previewUrl: '',
      files: [],
      file: {},
      rate: 0
    }
  },
  methods: {
    load () {
      this.$axios.post('api/user/getById', {
        id: this.id
      }).then((res) => {
        this.avatar = res.data.user.avatar
        console.log('当前头像' + this.avatar)
      }).catch((err) => {
        console.log(err)
      })
    },

    inputChange (e) {
      this.file = e.target.files[0] // 单个图片
      const formData = new FormData()
      formData.append('file', this.file) // 上传文件的name要和服务端接收的保持一致
      this.$axios.post('api/user/upload', formData).then((res) => {
        this.previewUrl = res.data.url
        console.log(this.previewUrl)
      }).catch((err) => {
        console.log(err)
      })
    },
    confirm () {
      // 如果用户没有选择头像，就不用发起请求
      // if (!this.prepreviewUrl) {
      //   this.$message({ message: '您没有做任何修改', type: 'warning' })
      //   return
      // }

      this.$axios.post('api/user/updateAvatar', {
        id: this.id, url: this.previewUrl
      }).then((res) => {
        if (res.data.status === 2) {
          this.$message({ message: '修改成功', type: 'success' })
          this.load()// 刷新头像
          this.previewUrl = '' // 预览头像清空
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@borderColor: #e1e4e8;
#wrap {
  display: flex;
}
.left,
.right {
  vertical-align: top;
  width: 250px;
  text-align: center;
  display: inline-block;
  flex: 1;
}
.user-avatar {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid @borderColor;
  cursor: pointer;
}
.preview-avatar {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid @borderColor;
}

.title {
  color: #333;
  text-align: center;
  font-size: 14px;
}
.submit-button {
  width: 200px;
  min-height: 30px;
  line-height: 30px;
  outline: none; /*点击后的框框 */
  border: 1px solid black;
  padding: 4px;
  font-size: 16px;
  border-radius: 5px;
  margin-top: 20px;
  background-color: #2b3137;
  color: white;
  cursor: pointer;
}
</style>
