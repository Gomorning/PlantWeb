<!--发表回复组件-->
<template>
  <div>
    <p>
      <input type="text"
             v-model=userReply>
      <button>回复</button>
      <button v-on:click="cancelReply">取消</button>
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      userReply: '', // 发表的回复内容
      currentCmt: ''// 当前回复的评论
    }
  },
  methods: {
    cancelReply () {
      this.currentCmt = false
    }
  }
}
</script>
