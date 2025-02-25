<template>
	<view class="container">
		<view class="guess-section">
			<view v-if="goodsList.length" v-for="(item, index) in goodsList" :key="index" class="guess-item" @click="navToDetailPage(item.objectId)">
				<view class="image-wrapper">
					<image :src="item.displayImg" mode="aspectFill"></image>
				</view>
				<view class="right-text">
					<view class="title twoclamp">{{item.name}}</view>
					<view class="price">
						<text class="sd-price">{{item.price}}/{{item.unit}}</text>
					</view>
				</view>
			</view>
			<view v-if="!goodsList.length" style="display:flex;width:100%;justify-content: center;padding:100upx 0">
				<image src="../../static/nodata.png" style="width:360upx;height:250upx"></image>
			</view>
		</view>


	</view>
</template>

<script>
	import {mapState} from 'vuex';
	export default {

		data() {
			return {
				goodsList: []
			};
		},
		computed:{
			...mapState(['hasLogin','userInfo'])
		},
		onLoad(options) {
			this.loadData();
		},
		mounted() {
		},
		methods: {
			async loadData() {
				let category2 = await this.$http.post('/lanhan/user/myConcern', {
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
					},
					"param": {
						"lastSequence": 0,
						"pageSize": 10,
						"type": 1
					}
				},{isFactory:false});
				if(category2.data.base.code == '000000'){
					this.goodsList = category2.data.data;
				}else{
					this.goodsList = [];
				}

			},
			
			//详情页
			navToDetailPage(id) {
				uni.navigateTo({
					url: `/pages/product/product?id=${id}`
				})
			},
		},
	}
</script>

<style lang="scss">

	page {
		background: #f5f5f5;
	}

	/* 猜你喜欢 */
	.guess-section {
		.guess-item {
			display: flex;
		    background: #fff;
			padding: 3% 5%;
			border-bottom: 1rpx solid #eee;
		}

		.image-wrapper {
			width: 240upx;
			height: 165upx;
			overflow: hidden;
			margin-right: 3%;

			image {
				width: 100%;
				height: 100%;
				opacity: 1;
			}
		}
		
		.right-text{
			width: 435rpx;
		}

		.title {
			font-size: $font-base;
			color: $font-color-dark;
			margin: 5% 0 0;
			font-weight: bold;
		}
		
		.twoclamp{overflow: hidden;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;}

		.price{
			margin: 10% 0 5%;
		}
		.sd-price{
			font-size: $font-base;
			color: $uni-color-primary;
		}
	}
</style>
