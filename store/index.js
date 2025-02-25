import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: uni.getStorageSync('hasLogin') || false,
		userInfo: uni.getStorageSync('userInfo') || "",
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;

			uni.setStorageSync("userInfo",provider);
		},
		logout(state) {
			uni.request({
				// url: 'http://app2021gdp.keliyun.cc/uc/loginout',
				// url: 'http://39.96.21.122/uc/loginout',
				// url: 'http://appcj2021.coneys.shop/uc/loginout',
				url: 'http://192.168.32.19/uc/loginout',
				data: {},
				dataType: 'json',
				method:"POST",
				header : {
					'content-type':'application/x-www-form-urlencoded;charset=UTF-8n',
					'x-auth-token':uni.getStorageSync('token'),
					'Accept-Language': uni.getStorageSync('locale')?uni.getStorageSync('locale') : 'zh-CN,zh',
				},
				success:function(res){
					state.hasLogin = false;
					state.userInfo = "";
					uni.setStorageSync("userInfo","");
					uni.setStorageSync("token","");
					uni.reLaunch({
						url:'../public/login'
					})
				},
				fail:function(e){
					console.log(e);
				}
			});
				
		}
	},
	actions: {
	
	}
})
const language = function(){
	
}

export default store
