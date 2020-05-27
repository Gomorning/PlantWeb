
<!-- 主页植物分类组件 -->
<template>
  <div id="plantList">
    <!--分类-->
    <div id="sorts">
      <span v-for="sort in sorts"
            v-bind:key="sort.sort_id"
            v-bind:class="{current:isCurrent==sort.sort_id}"
            v-on:click="showPlants(sort.sort_id)">{{sort.sort_name}}
      </span>
    </div>
    <plant-show :plants="plants"></plant-show>
  </div>
</template>

<script>
// 引入植物显示组件
import Plant from '@/components/Plant'

export default {
  components: { 'plant-show': Plant },
  data () {
    return {
      sorts: [],
      plants: '',
      absolutePath: '/image/plantPics',
      isCurrent: '' // 当前分类
    }
  },
  created () {
    this.$axios.post('api/plant/querySorts', {
    }).then((res) => {
      this.sorts = res.data // 把返回的数据赋给数组
      this.isCurrent = this.sorts[0].sort_id
    }).catch((err) => {
      console.log(err)
    })
    this.showPlants(1)
  },
  methods: {
    showPlants (id) {
      this.isCurrent = id
      this.$axios.post('api/plant/queryPlantsBySort', {
        id: id
      }).then((res) => {
        this.plants = res.data
      }).catch((err) => {
        console.log(err)
      })
    },
    showSorts () {
      this.$axios.post('api/plant/querySorts', {
      }).then((res) => {
        this.sorts = res.data // 把返回的数据赋给数组
        console.log(this.sorts)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang="less">
* {
  box-sizing: border-box;
  transition: all 0.3s ease-in-out 0s;
}
img {
  width: 100px;
  border-radius: 10px;
}

#plantList {
  text-align: center;
  color: #2c3e50;
  box-sizing: border-box;
  font-size: 15px;
}

#sorts {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 20px;
  padding-left: 50px;

  //当前选项
  .current {
    background-color: #3e436e;
    color: white;
  }

  span {
    border-radius: 10px;
    display: inline-block;
    padding: 6px;
    margin-right: 10px;
    color: #6e6d7a;
    cursor: pointer;
    // border: 1px solid gray;
  }

  span:hover {
    background-color: #3e436e;
    color: white;
  }
}
</style>
