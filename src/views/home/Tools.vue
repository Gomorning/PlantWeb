<!--工具介绍（盆，肥料）-->
<template>
  <div>
    <!--分类-->
    <div id="sorts">
      <span v-for="(sort,index) in sorts"
            v-bind:key="index"
            :class="{current:isCurrent==index}"
            v-on:click="loadBySort(index)">{{sort}}
      </span>
    </div>
  </div>
</template>
<script>
export default {
  data: function () {
    return {
      sorts: ['介质', '花盆', '肥料', '常见搭配'],
      isCurrent: 0
    }
  },
  methods: {
    loadBySort (index) {
      this.isCurrent = index
    }
  }
}
</script>
<style lang="less" scoped>
#sorts {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  padding: 10px;

  //当前选项
  .current {
    background-color: rgba(37, 118, 124);
    color: white;
  }
  span {
    border-radius: 10px;
    display: inline-block;
    padding: 6px;
    min-width: 68px;
    text-align: center;
    margin-right: 10px;
    color: #2c3e50;
    cursor: pointer;
    border: 1px solid gray;
  }

  span:hover {
    background-color: rgba(37, 118, 124);
    color: white;
  }
}
</style>
