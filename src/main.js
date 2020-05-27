import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import element from '@/element'
import 'element-ui/lib/theme-chalk/index.css'
import VueCropper from 'vue-cropper'

Vue.use(element)
Vue.use(VueCropper)

Vue.prototype.$axios = axios // 设置axios
Vue.config.productionTip = false

axios.defaults.headers.post['Content-Type'] = 'application/json' // 请求体中的数据以json字符串的形式发送到后端
axios.defaults.headers.common['Authentication-Token'] = store.state.token // 请求头带上token

axios.defaults.baseURL = ''

// 配置axios请求头，axios每次发起请求携带token，在Network中的headers看的到
axios.interceptors.request.use(config => {
  if (store.state.token) {
    config.headers.Authorization = store.state.token
  }
  return config
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
