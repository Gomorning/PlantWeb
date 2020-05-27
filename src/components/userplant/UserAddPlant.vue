<!--添加植物组件-->
<template>
  <div id="user-add-plant">
    <form>
      <dl>
        <dt>
          <label>植物名：</label>
        </dt>
        <dd>
          <input type="text"
                 v-model="plant.name" />
        </dd>
        <dt>
          <label for="">封面图：</label>
        </dt>
        <dd>
          <img class="plant-cover"
               :src="plant.cover"
               alt="">
          <input ref="inputfile"
                 type="file"
                 name="file"
                 id=""
                 accept="image/png,image/gif,image/jpeg"
                 v-on:change="inputChange">
        </dd>
        <dt>
          <label>种植日期:</label>
        </dt>
        <dd>
          <el-date-picker v-model="plant.birthday"
                          type="date"
                          placeholder="选择日期">
          </el-date-picker>
        </dd>
        <dt>
          <label>说明:</label>
        </dt>
        <dd>
          <input v-model="plant.desc"
                 type="text" />
        </dd>
        <p><input class="submit-button"
                 type="button"
                 v-on:click="onSubmit"
                 value="添加到我的植物" /></p>
      </dl>

    </form>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  created () { console.log('addPlant访问' + this.userId) },
  data () {
    return {
      plant: {
        name: '',
        cover: '',
        birthday: '',
        desc: '',
        userId: ''
      }
    }
  },
  computed: {
    userId () {
      return this.$store.state.id
    }
  },
  methods: {
    onSubmit () {
      console.log(this.userId)
      this.plant.birthday = moment(this.plant.birthday).format('YYYY-MM-DD')
      this.plant.userId = this.userId
      this.$axios.post('api/plant/addUserPlant', { plant: this.plant }).then((res) => {
        if (res.data.status === 2) {
          this.$message({ message: '添加成功', type: 'success' })
        }
        this.$emit('load')// 刷新植物列表
        this.$emit('change')// 关闭添加植物的面板
        this.reset()
      }).catch((err) => {
        console.log(err)
      })
    },
    // 上传图片
    inputChange (e) {
      this.file = e.target.files[0] // 单个图片
      const formData = new FormData()
      formData.append('file', this.file) // 注意，这里必须上传文件的name为avatar要和服务端接收的保持一致
      this.$axios.post('api/user/upload', formData).then((res) => {
        this.plant.cover = res.data.url
      }).catch((err) => {
        console.log(err)
      })
    },
    // 重置
    reset () {
      this.plant.name = ''
      this.plant.cover = ''
      this.plant.birthday = ''
      this.plant.desc = ''
      this.plant.userId = ''
    }

  }
}
</script>

<style lang="less" scoped>
.user-add-plant {
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 0px;
}

form {
  padding: 10px;
  background-color: white;
  dt,
  dd {
    font-size: 14px;
    color: #606266;
    text-align: left;
    margin-top: 10px;
  }

  a {
    font-size: 13px;
    color: #f59;
  }

  .plant-cover {
    width: 200px;
    height: 200px;
    object-fit: cover;
  }
  input[type="text"] {
    width: 50%;
    min-height: 30px;
    line-height: 30px;
    outline: none; /*点击后的框框 */
    border: 1px solid #dcdfe6;
    padding: 4px;
    font-size: 14px;
    border-radius: 5px;
  }

  input:disabled {
    border: 1px solid #ddd;
    background-color: #f5f5f5;
    color: #aca899;
  }

  input[type="radio"] {
    width: 50px;
    cursor: pointer;
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
}
</style>
