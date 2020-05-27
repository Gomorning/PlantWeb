<!--图片容器组件--->
<template>
  <div class="containner">
    <div class="main-wrap">

      <!-- <div class="mask">
        <div class="left">
          <span v-show="currIndex>0 && imgList.length>1"
                class="left-btn"
                v-on:click="goPre()">left</span>
          <div class="right">
            <span v-show="currIndex<imgList.length-1 && imgList.length>1"
                  v-on:click="goNext()"
                  class="right-btn">right</span>
          </div>
        </div>
      </div> -->

      <div class="center">
        <img class="main-img"
             v-if="isZoom"
             v-on:click="isZoom = false"
             :src="imgList[currIndex].url"
             alt="">
        <!--九宫格缩略图-->
        <div v-else
             class="top-thumbnail-wrap">
          <div></div>
          <img class="thumbnail"
               :src="img.url"
               v-on:click="go(index)"
               v-for="(img,index) in imgList"
               v-bind:key="index">
        </div>
      </div>

    </div>

    <!--下面一排缩略图-->
    <div v-if="isZoom && imgList.length>1"
         class="thumbnail-wrap">
      <img class="thumbnail"
           v-for="(img,index) in imgList"
           v-bind:key="index"
           :src="img.url"
           v-bind:class="currIndex==index ? 'current' : 'notCurrent'"
           v-on:click="go(index)">
    </div>

  </div>
</template>

<script>
export default {
  props: ['imgList'],
  data: function () {
    return {
      currIndex: 0, // 当前显示的图片下标
      isZoom: false // 是否选中放大图片
    }
  },
  methods: {
    goPre () {
      this.currIndex--
    },
    goNext () {
      this.currIndex++
    },
    go (index) {
      this.isZoom = true // 放大图片
      this.currIndex = index
      console.log(this.currIndex)
    }
  }
}
</script>

<style lang="less" scoped>
//主图容器

.main-wrap {
  cursor: pointer;
}
.main-img {
  width: 100%;
  height: auto;
}

// .mask {
//   display: flex;
//   justify-content: space-between;
//   align-content: center;
//   position: absolute;
// }
//九宫格缩略图
.top-thumbnail-wrap {
  width: 330px;
  .thumbnail {
    padding: 2px;
    display: inline-block;
    font-size: 0;
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 10px;
    cursor: pointer;
  }
}
//单排缩略图
.current {
  opacity: 1;
  border: 1px solid #fb7299;
}

.notCurrent {
  opacity: 0.5;
  border: 1px solid white;
}
.thumbnail-wrap {
  .thumbnail {
    padding: 4px;
    display: inline-block;
    border-radius: 10px;
    font-size: 0;
    width: 60px;
    height: 60px;
    object-fit: cover;
    cursor: pointer;
    padding: 2px;
  }
}
</style>
