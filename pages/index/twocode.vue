<template>
	<view>
		<view class="title">扫一扫,向我付钱</view>
		<view class="ewm-view">
			<image :src="imgUrl"></image>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	export default{
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		data(){
			return{
				uid:'',
				imgUrl:''
			}
		},
		methods:{
			async loadData(){
				let res1=await this.$http.post('/transfer/getQRCodeByUid',{
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
					        "resolution":"960*640",
					        "deviceType":"P6",
					        "carrier":"china mobile",
					        "city":"合肥",
					        "brand": "huawei"
					    },
					    "param": {
					        "uid": this.userInfo.userId
					    }
				})
				this.imgUrl=res1
			}
		},
		onLoad() {
			let that = this
			try {
				// const userId = uni.getStorageSync('userId');
				const userId = that.userInfo.userId;
				if (userId) {
					that.uid = userId;
					that.loadData()
				}else{
					uni.redirectTo({
						url: '../public/login'
					});
				}
			} catch (e) {
				// error
			}
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
