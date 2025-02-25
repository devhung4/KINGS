<template>
	<view class="page">
		<view class="title">{{noticeinfo.title}}</view>
		<view class="time">{{noticeinfo.createTime}}</view>
		<view v-if="htmltext" class="introduce">{{noticeinfo.content}}</view>
		<view v-else>
			<jyf-parser :html="htmlNodes"></jyf-parser>
		</view>
		<!-- <view v-html="noticeinfo.content">
			
		</view> -->
	</view>
</template>

<script>
	import {mapState} from 'vuex';
	import jyfParser from '@/components/jyf-parser/jyf-parser.vue'
	export default {
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		data() {
			return {
				noticeinfo:{},
				htmlNodes:"",
				htmltext:true,
				navTitle: this.$t('headlines.index4')
			}
		},
		onLoad() {
			uni.setNavigationBarTitle({
				title: this.navTitle
			})
		},
		onShow() {
			let that = this;
			let info = uni.getStorageSync("noticelist");
			that.$data.noticeinfo = JSON.parse(info);
			// console.log(that.$data.noticeinfo.content,'that.$data.noticeinfo')
			// if(that.$data.noticeinfo.content.indexOf("<!--HTML-->") == -1){
			// 	that.$data.htmltext = true;
			// }else{
				that.$data.htmltext = false;
				that.$data.htmlNodes = that.$data.noticeinfo.content;
				// console.log(that.$data.htmlNodes,'that.$data.htmlNodes')
			// }
			
			// that.detailinfo();
		},
		methods: {
			// async detailinfo(){
			// 	let that = this;
			// 	let resdata = await that.$request.post('/user/updateSystemNoticeIsRead', {
			// 		"data":{
			// 			"base": {
			// 				"appId": "001",
			// 				"channels": "001",
			// 				"ver": "1.1.5",
			// 				"clientVer": "1.0",
			// 				"apn": "wifi",
			// 				"deviceId": "1233eedds2112",
			// 				"uid": that.userInfo.userId,
			// 				"valat": 22.332112,
			// 				"lalong": 12.332112,
			// 				"platform": "IOS",
			// 				"platformVer": "8",
			// 				"resolution": "960*640",
			// 				"deviceType": "P6",
			// 				"carrier": "china mobile",
			// 				"city": "合肥",
			// 				"brand": "huawei"
			// 			},
			// 			"param":{
			// 				"noticeId": that.$data.noticeinfo.noticeId
			// 			}
			// 		}
			// 	});
			// 	if(resdata.data.base.code=="000000"){
			// 		console.log(resdata.data.base.msg);
			// 	}else{
			// 		console.log(resdata.data.base.msg);
			// 	}
			// }
		}
	}
</script>

<style lang='scss' scoped>
	.page {
		padding: 5%;
		
		.title{
			line-height: 60upx;
		}
		.time{
			font-size: 26upx;
			color: #999;
			margin: 3% 0 5%;
		}
		.introduce{
			font-size: 28upx;
			line-height: 50upx;
		}
	}
</style>
