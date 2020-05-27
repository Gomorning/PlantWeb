<!--传入数组渲染-->
<template>
  <div id="plants">
    <ul>
      <li v-for="plant in plants"
          v-bind:key="plant.plant_id"
          v-on:click="goDetailPage(plant)">
        <img style="width: 200px; height: 200px"
             :src="absolutePath+plant.plant_img"
             alt="">
        <p>{{plant.plant_name}}</p>

      </li>

    </ul>
  </div>
</template>

<script>

export default {
  props: ['plants'],
  data () {
    return {
      absolutePath: '/image/plantPics'
    }
  },
  methods: {
    // 带参跳转路由
    goDetailPage (plant) {
      var thePlant = JSON.stringify(plant)
      this.$router.push({
        path: '/plantDetail',
        query: {
          plant: thePlant
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#plants {
  ul {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-center;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;

    li {
      margin-left: 20px;
      margin-right: 20px;
      list-style: none;
      margin-top: 20px;
      border-radius: 20px;
      box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 0px;
      background: white;
      padding: 10px;
      cursor: pointer;
    }

    img {
      display: inline-block;
      height: auto;
      max-width: 100%;
      object-fit: cover;
    }
  }
}
</style>
