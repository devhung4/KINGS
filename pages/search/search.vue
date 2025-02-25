<template>
	<view>
		<zy-search :is-focus="true" :theme="themeClass" :show-want="true"
		:hot-list="hotList" :search-list="searchList" @getSearchText="getSearchText"></zy-search>
		<!--  :speechEngine="speechEngine" -->
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import zySearch from '@/components/zy-search/zy-search.vue';
	export default {
		components: {
			zySearch
		},
		data() {
			return {
				themeClass: 'block',
				// speechEngine: 'baidu', //语音识别引擎
				hotList: []	,//初始化推荐列表
				searchList:[],
			}
		},
		onLoad(){
			if(!this.hasLogin){
				console.log(this.hasLogin)
				uni.showModal({
					content: "您还未登录，现在去登录",
					confirmText: "确定",
					cancelText: "取消",
					success: function (res) {
						if (res.confirm) {
							uni.navigateTo({
								url:"../public/login"
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
			}else{
				this.loaddata();
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo'])
		},
		methods: {
			async loaddata(){
				let that = this;
				let searchdata = await that.$http.post('/lanhan/user/hotSearchInfo', {
					"base": {
						"appId": "001",
						"channels": "001",
						"ver": "1.1.5",
						"clientVer": "1.0",
						"apn": "wifi",
						"deviceId": "1233eedds2112",
						"uid": this.userInfo.userId,
						"valat": 22.332112,
						"lalong": 12.332112,
						"platform": "IOS",
						"platformVer": "8",
						"resolution": "960*640",
						"deviceType": "P6",
						"carrier": "china mobile",
						"city": "合肥",
						"brand": "huawei"
					}
				});
				if(searchdata.length!==0){
					for(let i=0; i<searchdata.length; i++){
						that.$data.hotList.push(searchdata[i].keyWord);
					}
					for(let y=0; y<searchdata.length; y++){
						that.$data.searchList.push(searchdata[y].keyWord);
					}
				}
			},
			getSearchText(e) {
				// uni.showToast({
				// 	title:'回调的搜索信息: ' + e,
				// 	icon:"none"
				// })
				console.log(e)
				uni.navigateTo({
					url:"../product/productlist?categoryid=0&typeid="+''+"&name="+''+"&keyword="+e,
					
				})
			}
		},
	}
</script>

<style>
</style>
