import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    hasLogin: uni.getStorageSync('hasLogin') || false,
    userInfo: uni.getStorageSync('userInfo') || '',
    userCardList: [],
    userAddress: [],
    userHasCards: false,
  },
  mutations: {
    login(state, provider) {
      state.hasLogin = true
      state.userInfo = provider

      uni.setStorageSync('userInfo', provider)
    },
    logout(state) {
      uni.request({
        // url: 'http://app2021gdp.keliyun.cc/uc/loginout',
        // url: 'http://39.96.21.122/uc/loginout',
        // url: 'http://appcj2021.coneys.shop/uc/loginout',
        url: 'http://192.168.32.19/uc/loginout',
        data: {},
        dataType: 'json',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=UTF-8n',
          'x-auth-token': uni.getStorageSync('token'),
          'Accept-Language': uni.getStorageSync('locale')
            ? uni.getStorageSync('locale')
            : 'zh-CN,zh',
        },
        success: function (res) {
          state.hasLogin = false
          state.userInfo = ''
          uni.setStorageSync('userInfo', '')
          uni.setStorageSync('token', '')
          uni.reLaunch({
            url: '../public/login',
          })
        },
        fail: function (e) {
          console.log(e)
        },
      })
    },
    setUserCardList(state, list) {
      state.userCardList = list
    },
    setUserHasCards(state, flag) {
      state.userHasCards = flag
    },
  },
  actions: {
    /**
     * 获取用户账号下的所有卡片
     * @param {Object} ctx
     * @param {Object} request
     * @description 需要手动传入request对象, 因为无法使用this.$request
     * @example this.$store.dispatch('fetchUserCardList', this.$request)
     */
    async fetchUserCardList(ctx, request) {
      const resp = await request.post('/finance/card/findPhysicalCards')
      if (resp.data.code === 0) {
        const content = resp.data.data.content
        ctx.commit('setUserCardList', content)
        ctx.commit('setUserHasCards', content.length !== 0)
      }
    },
    /**
     * 获取用户的所有地址
     * @param {Object} ctx
     * @param {Object} request
     * @description 需要手动传入request对象, 因为无法使用this.$request
     * @example this.$store.dispatch('fetchUserAddress', this.$request)
     */
    async fetchUserAddress(ctx, request) {
      const resp = await request.post('/uc/withdraw/address/page')
      if (resp.data.code === 0) {
        ctx.state.userAddress = resp.data.data.content
      }
    },
  },
})
const language = function () {}

export default store
