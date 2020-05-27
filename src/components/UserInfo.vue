<!--个人信息修改组件-->
<template>
  <div class="user-info">
    <div class="wrap">
      <div class="left">
        <ul>
          <li v-on:click="selectSection()">修改基本资料</li>
          <li v-on:click="selectSection('avatar')">修改头像</li>
          <li v-on:click="selectSection('password')">修改密码</li>
        </ul>
      </div>
      <div class="right">
        <!--修改密码-->
        <section v-if="select=='password'">
          <update-psd></update-psd>
        </section>

        <!--修改头像-->
        <section v-else-if="select=='avatar'">
          <update-avatar></update-avatar>
        </section>

        <!--修改基本资料-->
        <section v-else>
          <update-info></update-info>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import UpdateInfo from '@/components/update/UpdateInfo'
import UpdateAvatar from '@/components/update/UpdateAvatar'
import UpdatePsd from '@/components/update/UpdatePsd'

export default {
  components: { 'update-info': UpdateInfo, 'update-psd': UpdatePsd, 'update-avatar': UpdateAvatar },
  data: function () {
    return {
      select: '' // 选项信息
    }
  },
  methods: {
    selectSection (select) {
      this.select = select
    }
  }
}
</script>

<style lang="less" scoped>
.user-info {
  min-height: 540px;
  padding-top: 20px;
  box-sizing: border-box;
  background-color: #fafbfb;
}
.wrap {
  margin: 0 auto;
  width: 70%;
  display: flex;
}

.left {
  flex: 1;
  ul {
    box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 0px;
  }
  ul li {
    list-style: none;
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 15px;
    color: #2b3137;
    background: white;
    border-bottom: 1px solid gray;
    cursor: pointer;
  }
}

.right {
  flex: 5;
  padding: 20px;
  background: white;
  box-shadow: rgba(0, 0, 0, 0.2) 0 1px 5px 0px;
}
</style>
