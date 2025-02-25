<template>
	<view>
		
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default{
		computed: {
			...mapState(['hasLogin','userInfo'])
		},
		data(){
			return{
				uid:'',
			}
		},
		methods:{
		
		},
		onLoad() {
			let that = this;
			// try {
			// 	// const userId = uni.getStorageSync('userId');
			// 	const userId = that.userInfo.userId;
			// 	if (userId) {
			// 		that.uid = userId;
			// 	}
			// } catch (e) {
			// 	// error
			// }
			uni.scanCode({
			    success: function (res) {
			        console.log('条码类型：' + res.scanType);
			        console.log('条码内容：' + res.result);
			    }
			});
			//扫描二维码
			// uni.scanCode({
			//     success:async function (res) {
			   //     let res1=await that.$http.post('/user/getUserInfoByUid',{
					 //   "base": {
					 //           "appId": "001",
					 //           "channels": "001",
					 //           "ver": "1.1.5",
					 //           "clientVer": "1.0",
					 //           "apn": "wifi",
					 //           "deviceId": "1233eedds2112",
					 //           "uid": that.userInfo.userId,
					 //           "valat": 22.332112,
					 //           "lalong": 12.332112,
					 //           "platform": "IOS",
					 //           "platformVer": "8",
					 //           "resolution":"960*640",
					 //           "deviceType":"P6",
					 //           "carrier":"china mobile",
					 //           "city":"合肥",
					 //           "brand": "huawei"
					 //       },
					 //       "param": {
					 //           "uid":that.userInfo.userId
					 //       }
				  //  })
				  //  if(res1){
					 //   console.log(111)
					 // // uni.navigateTo({
					 // // 	url:'/pages/index/payMoney?payeeId='+ res1.id
					 // // })
				  //  }
			// 	  console.log(res)
			//     }
			// });
			// balance: 0
			// expertStatus: -1
			// headImg: "https://wx.qlogo.cn/mmopen/vi_32/cg0yk4ZMVAwAMVgSk5tAfChgSV79SK4FVud3fqhr0ic03YS1HrZcibgFWEOKllQDegMazs9N9iajF6oHEcOAcyeyg/132"
			// id: "89c9052fccc44ce7bad9e28fb90d7759"
			// inviCodeStatus: 0
			// isMember: 1
			// levelName: "普通用户"
			// score: 0
			// sex: 0
			// storekeeperStatus: -1
			// username: "埙"
			// wokerStatus: -1
		}
	}
</script>

<style lang="scss">
	page{
		background:#efefef;
	}
	.title{
		text-align:center;
		margin:60upx 0 30upx;
	}
	.ewm-view{
		background:#fff;
		width:80%;
		margin:0 auto;
		height:600upx;
		padding:20upx;
		image{
			width:100%;
			height:100%
		}
	}
</style>
