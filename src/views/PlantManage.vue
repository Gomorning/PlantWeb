<!--植物管理-->
<template>
  <div class="manage">
    <div>
      <p class="add-wrap"><span class="tips">通过点击红色按钮来添加你的植物吧 👉</span>
        <input type="button"
               class="add-btn"
               value="+"
               v-on:click="change"></p>
      <!--添加植物面板-->
      <user-add-pant v-if="isOpen"
                     class="user-add-plant"
                     v-on:load="loadPlant"
                     v-on:change="change"></user-add-pant>
      <!--用户植物列表-->

      <h2>🌼已拥有的植物 [共{{userPlantList.length}}个]</h2>
      <div class="user-plant-list">
        <user-plant class="user-plant"
                    v-for="plant in userPlantList"
                    v-bind:key="plant.id"
                    v-bind:plant="plant"
                    v-on:load="loadPlant">
        </user-plant>
      </div>

      <div class="hiden"
           v-if="userPlantList.length<=0">
        <p>😳你还没有添加植物哦</p>
        <p>尝试点击右上角的红色按钮进行添加</p>
        <p>来为你的植物记录成长吧~</p>
      </div>

    </div>
  </div>
</template>

<script>
import UserPlant from '@/components/userplant/UserPlant'
import UserAddPlant from '@/components/userplant/UserAddPlant'
export default {
  components: { 'user-add-pant': UserAddPlant, 'user-plant': UserPlant },
  created () {
    this.loadPlant()
  },
  data: function () {
    return {
      isOpen: false,
      userPlantList: []
    }
  },
  computed: {
    // 当前用户id
    userId () {
      return this.$store.state.id
    }
  },
  methods: {
    loadPlant () {
      this.$axios.get('api/plant/queryPlant', {
        params: {
          id: this.userId
        }
      }).then((res) => {
        this.userPlantList = res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    // 按钮开关状态
    change () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style lang="less" scoped>
@mainColor: #ea4c89;
.manage {
  padding-top: 20px;
  min-height: 540px;
  background-color: #fafbfb;
}
.add-wrap {
  width: 900px;
  text-align: right;
  margin: 0 auto;

  .tips {
    font-size: 13px;
    margin-right: 10px;
    color: #ea4c89;
  }
  .add-btn {
    width: 40px;
    height: 40px;
    line-height: 40px;
    border: none;
    font-size: 30px;
    border-radius: 5px;
    background-color: @mainColor;
    color: white;
    opacity: 1;
    cursor: pointer;
  }

  .add-btn:hover {
    opacity: 0.7;
  }
}
.user-add-plant {
  margin-top: 20px;
  width: 900px;
}

.user-plant-list {
  margin: 0 auto;
  width: 800px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .user-plant {
    flex: 0 0 auto; //解决flex子项宽度失效
  }
}

h2 {
  margin-top: 100px;
  width: 900px;
  margin: 0 auto;
  border-bottom: 3px dotted black;
}

.hiden {
  padding-top: 80px;
  width: 900px;
  margin: 0 auto;
  text-align: center;

  p {
    padding: 6px;
    font-size: 18px;
  }
}
</style>
