<!--植物成长记录列表组件-->
<template>
  <div class="wrap">
    <div class="title-bar">
      <h2 class="title">🌵 {{plantName}} 的成长记录簿</h2>
      <button class="back-btn"
              v-on:click="backHistory">返回</button>
    </div>

    <!--添加植物成长记录-->
    <user-add-record v-on:refresh="load"
                     v-bind:plantId="plantId"
                     class="add-record"></user-add-record>

    <div class="record-list">
      <el-timeline>
        <el-timeline-item v-for="record in recordList"
                          v-bind:key="record.id"
                          :timestamp="record.datetime|dateFormat"
                          placement="top">
          <!--植物成长记录列表-->
          <el-card class="item">
            <user-record v-on:load="load"
                         v-bind:record=record></user-record>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>

</template>
<script>
import UserAddRecord from '@/components/userplant/UserAddRecord'
import UserRecord from '@/components/userplant/UserRecord'
const moment = require('moment')
export default {
  components: { 'user-add-record': UserAddRecord, 'user-record': UserRecord },
  created () {
    this.plantId = this.$route.query.plantId
    this.plantName = this.$route.query.plantName
    console.log(this.plantName)

    this.load()
  },
  filters: {
    dateFormat (timeStr) {
      return moment(timeStr).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  data: function () {
    return {
      plantId: '',
      plantName: '',
      recordList: [],
      imgList: []
    }
  },
  methods: {
    load () {
      this.$axios.get('api/plant/queryRecord', {
        params: {
          plantId: this.plantId
        }
      }).then((res) => {
        console.log(res.data)
        this.recordList = res.data
      })
    },
    backHistory () {
      this.$router.go(-1)
    }
  }

}
</script>

<style lang="less" scoped>
.wrap {
  padding-top: 20px;
  background-color: #fafbfb;
  min-height: 540px;
}
.title-bar {
  position: relative;
  text-align: center;

  margin-bottom: 20px;
  height: 50px;

  .back-btn {
    position: absolute;
    cursor: pointer;
    right: 20px;
    width: 50px;
    height: 50px;
    padding: 10px;
    border-radius: 10px;
    border: none;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 0px;
  }
  .back-btn:hover {
    box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 2px;
  }
}

.add-record {
  margin-bottom: 20px;
  width: 520px;
  margin: 0 auto;
}

.record-list {
  width: 700px;
  margin: 0 auto;
}

.item {
  position: relative;
}
h2 {
  display: inline;
  color: #6b6d6b;
}
</style>
