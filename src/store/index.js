import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    id: '',
    username: '',
    token: '',
    isAdministor: ''
  },
  getters: { // getter相当于vue中的computed
    getuserid: (state) => { return state.id },
    getusername: (state) => { return state.username },
    getToken: (state) => { return state.token },
    getIsAdministor: (state) => { return state.isAdministor }

  },
  mutations: {
    set_token (state, theToken) { // state是拿到的state对象
      localStorage.setItem('token', theToken)// 把本地存的token值给vuex
      state.token = theToken
    },
    set_id (state, theId) { // state是拿到的state对象
      localStorage.setItem('id', theId)
      state.id = theId
    },
    set_username (state, theUsername) {
      localStorage.setItem('username', theUsername)
      state.username = theUsername
    },
    set_isAdministor (state, isAdministor) {
      localStorage.setItem('isAdministor', isAdministor)
      state.isAdministor = isAdministor
    },
    del_token (state) {
      localStorage.removeItem('token')
      state.token = ''
    },
    del_id (state) {
      localStorage.removeItem('id')
      state.id = ''
    },
    del_username (state) {
      localStorage.removeItem('username')
      state.username = ''
    },
    del_isAdministor (state) {
      localStorage.removeItem('isAdministor')
      state.isAdministor = ''
    }
  },
  actions: { // 可以直接用mutation去修改state的值，但官方建议使用action去调用mutations

  },
  modules: {
  }
})
